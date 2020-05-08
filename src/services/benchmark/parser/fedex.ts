import csv from 'csv-parse/lib/sync';
import moment from 'moment';

import { WeightBucket, Method, DiscountType } from '../../types/fedex';
import { Benchmark, BenchmarkDiscount, BenchmarkTotal, FedexShippingMethod, FedexShippingMethodBucket } from '../../../models';

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

const parseCsvFloat = (value: string): number => {
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

    let minDate = new Date(8640000000000000); // All dates in the file are guaranteed to be less than this large date
    let maxDate = new Date(-8640000000000000); // All dates in the file are guaranteed to be greater than this small date

    const methods = await FedexShippingMethod.findAll();
    const buckets = {} as {[key: string] : FedexShippingMethodBucket[]};

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
                bucket: bucket.displayName,
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
            // If the name is not a valid discount type, skip it
            if (!Object.values(DiscountType).includes(row[i] as DiscountType)) {
                continue;
            }

            const discountCacheKey = `${total.id}-${row[i]}`;
            if (!Object.keys(discounts).includes(discountCacheKey)) {
                discounts[discountCacheKey] = await BenchmarkDiscount.create({
                    benchmarkTotalId: total.id,
                    type: row[i],
                });
            }

            const discount = discounts[discountCacheKey];

            discount.amount += parseCsvFloat(row[i+1]);
        }
    }

    benchmark.annualizationFactor = moment(maxDate).diff(moment(minDate), 'days') / 365.0;

    await Promise.all(Object.values(totals).map(t => t.save()));

    await Promise.all(Object.values(discounts).map(t => t.save()));

    await benchmark.save();

    return benchmark;
};

export default fedexParse;