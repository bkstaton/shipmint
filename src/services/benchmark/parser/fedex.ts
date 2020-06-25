import csv from 'csv-parse/lib/sync';
import moment from 'moment';

import { DiscountType, surchargesGroupedByMethod } from '../../types/fedex';
import { Benchmark, BenchmarkDiscount, BenchmarkTotal, FedexShippingMethod, FedexShippingMethodBucket, BenchmarkSurcharge } from '../../../models';

export enum Columns {
    Method = 11,
    Weight = 20,
    TransportationCharge = 9,
    FirstDiscountStart = 105,
    ShipmentDate = 13,
}

const getMethods = (method: string, altMethod: string, methods: FedexShippingMethod[]): FedexShippingMethod[] => {
    return methods.filter((m) => {
        if (method && method.length) {
            return m.serviceType === method;
        }

        return m.groundService === altMethod;
    });
};

const getBucket = (weight: number, buckets: FedexShippingMethodBucket[]): FedexShippingMethodBucket | null => {
    for (let b of buckets) {
        if (b.minimum && b.minimum > weight) {
            continue;
        }

        if (b.maximum && b.maximum < weight) {
            continue;
        }

        return b;
    }

    return null;
};

const getBucketOrder = (bucket: FedexShippingMethodBucket, buckets: FedexShippingMethodBucket[]): number => {
    const matchingBuckets = buckets
        .sort((a: FedexShippingMethodBucket, b: FedexShippingMethodBucket) => {
            if (a.minimum === null) {
                return -1;
            }
            if (b.minimum === null) {
                return 1;
            }
            return a.minimum - b.minimum;
        });

    return matchingBuckets.findIndex(b => b.id === bucket.id);
};

const parseCsvFloat = (value?: string): number => {
    if (!value || !value.length) {
        return 0;
    }

    return parseFloat(value.replace(/ /g, '')) || 0;
};

const fedexParse = async (customerId: string, data: Buffer): Promise<Benchmark> => {
    let rows: Array<string>[];
    try {
        try {
            rows = csv(data, {
                delimiter: ';',
                from_line: 2,
                relax_column_count: true,
            });
        }
        catch (e) {
            rows = csv(data, {
                delimiter: ',',
                from_line: 2,
                relax_column_count: true,
            });
        }
    } catch (e) {
        console.log(e);

        throw new Error('Failed parsing CSV file.');
    }

    const benchmark = await Benchmark.create({
        customerId
    });

    // Cache of totals and discounts, keyed with a unique string
    const totals = {} as { [key: string]: BenchmarkTotal };
    const discounts = {} as { [key: string]: BenchmarkDiscount };
    const surcharges = {} as { [key: string]: BenchmarkSurcharge };

    let minDate = new Date(8640000000000000); // All dates in the file are guaranteed to be less than this large date
    let maxDate = new Date(-8640000000000000); // All dates in the file are guaranteed to be greater than this small date

    const methods = await FedexShippingMethod.findAll();
    const buckets = {} as { [key: string]: FedexShippingMethodBucket[] };

    for (let row of rows) {
        let matchingMethods = getMethods(row[Columns.Method], row[Columns.Method + 1], methods);
        if (!matchingMethods || !matchingMethods.length) {
            continue;
        }

        let method: FedexShippingMethod | null = null;
        let bucket: FedexShippingMethodBucket | null = null;

        for (const m of matchingMethods) {
            if (!buckets[m.id]) {
                buckets[m.id] = await m.getBuckets();
            }

            bucket = getBucket(parseFloat(row[Columns.Weight]), buckets[m.id]);
            if (!bucket) {
                continue;
            }

            method = m;
            break;
        }

        if (!method || !bucket) {
            continue;
        }

        const totalCacheKey = `${benchmark.id}-${method.id}-${bucket.id}`;
        if (!Object.keys(totals).includes(totalCacheKey)) {
            totals[totalCacheKey] = await BenchmarkTotal.create({
                benchmarkId: benchmark.id,
                method: method.displayName,
                order: method.order,
                bucket: bucket.displayName,
                bucketOrder: getBucketOrder(bucket, buckets[method.id]),
            });
        }

        const total = totals[totalCacheKey];

        total.count++;
        total.transportationCharge += parseCsvFloat(row[Columns.TransportationCharge]);
        total.order = method.order;

        const shipmentDate = moment(row[Columns.ShipmentDate], 'YYYYmmdd').toDate();
        if (shipmentDate < minDate) {
            minDate = shipmentDate;
        }
        if (shipmentDate > maxDate) {
            maxDate = shipmentDate;
        }

        for (let i = Columns.FirstDiscountStart; i < row.length; i += 2) {
            // If the name is a valid discount type, aggregate it that way
            if (Object.values(DiscountType).includes(row[i] as DiscountType)) {
                const discountCacheKey = `${total.id}-${row[i]}`;

                if (!Object.keys(discounts).includes(discountCacheKey)) {
                    discounts[discountCacheKey] = await BenchmarkDiscount.create({
                        benchmarkTotalId: total.id,
                        type: row[i],
                    });
                }

                const discount = discounts[discountCacheKey];

                discount.amount += parseCsvFloat(row[i + 1]);
            }
            else if (row[i] && row[i].length) { // Otherwise, as long as the label isn't empty it must be a surcharge
                let surchargeCacheKey: string;
                let surchargeType: string;

                if (surchargesGroupedByMethod.includes(row[i])) {
                    surchargeCacheKey = `${benchmark.id}-${method.id}-${row[i]}`;
                    surchargeType = `${row[i]} - ${method.displayName}`;
                }
                else {
                    surchargeCacheKey = `${benchmark.id}-${row[i]}`;
                    surchargeType = row[i];
                }

                if (!Object.keys(surcharges).includes(surchargeCacheKey)) {
                    surcharges[surchargeCacheKey] = await BenchmarkSurcharge.create({
                        benchmarkId: benchmark.id,
                        type: surchargeType,
                    });
                }

                const surcharge = surcharges[surchargeCacheKey];

                surcharge.count += 1;
                surcharge.totalCharge += parseCsvFloat(row[i + 1]);
            }
        }
    }

    benchmark.annualizationFactor = moment(maxDate).diff(moment(minDate), 'days') / 365.0;

    await Promise.all(Object.values(totals).map(t => t.save()));

    await Promise.all(Object.values(discounts).map(d => d.save()));

    await Promise.all(Object.values(surcharges).map(s => s.save()));

    await benchmark.save();

    return benchmark;
};

export default fedexParse;