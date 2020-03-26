import csv from 'csv-parse/lib/sync';
import moment from 'moment';

import { WeightBucket, Method, DiscountType } from '../../types/fedex';
import { Benchmark, BenchmarkDiscount, BenchmarkTotal } from '../../../models';

export enum Columns {
    Method = 11,
    Weight = 20,
    TransportationCharge = 9,
    FirstDiscountStart = 105,
    ShipmentDate = 13,
}

const getBucket = (weight: number): WeightBucket | null => {
    if (weight >= 1 && weight <= 5) {
        return WeightBucket.OneToFivePounds;
    } else if (weight <= 10) {
        return WeightBucket.SixToTenPounds;
    } else if (weight <= 15) {
        return WeightBucket.ElevenToFifteenPounds;
    } else if (weight <= 20) {
        return WeightBucket.SixteenToTwentyPounds;
    } else if (weight <= 30) {
        return WeightBucket.TwentyOneToThirtyPounds;
    } else if (weight <= 50) {
        return WeightBucket.ThirtyOneToFiftyPounds;
    } else if (weight <= 70) {
        return WeightBucket.FiftyOneToSeventyPounds;
    } else if (weight > 70) {
        return WeightBucket.SeventyPlusPounds;
    }

    return null;
};

const getSmartPostBucket = (weight: number): WeightBucket | null => {
    if (weight <= 0.07) {
        return WeightBucket.OneOunce;
    } else if (weight <= 0.14) {
        return WeightBucket.SixToTenPounds;
    } else if (weight <= 0.20) {
        return WeightBucket.ElevenToFifteenPounds;
    } else if (weight <= 0.26) {
        return WeightBucket.SixteenToTwentyPounds;
    } else if (weight <= 0.32) {
        return WeightBucket.TwentyOneToThirtyPounds;
    } else if (weight <= 0.39) {
        return WeightBucket.ThirtyOneToFiftyPounds;
    } else if (weight <= 0.45) {
        return WeightBucket.FiftyOneToSeventyPounds;
    } else if (weight <= 0.51) {
        return WeightBucket.SeventyPlusPounds;
    } else if (weight <= 0.57) {
        return WeightBucket.SeventyPlusPounds;
    } else if (weight <= 0.64) {
        return WeightBucket.SeventyPlusPounds;
    } else if (weight <= 0.70) {
        return WeightBucket.SeventyPlusPounds;
    } else if (weight <= 0.76) {
        return WeightBucket.SeventyPlusPounds;
    } else if (weight <= 0.82) {
        return WeightBucket.SeventyPlusPounds;
    } else if (weight <= 0.89) {
        return WeightBucket.SeventyPlusPounds;
    } else if (weight <= 0.95) {
        return WeightBucket.SeventyPlusPounds;
    } else if (weight < 1) {
        return WeightBucket.SeventyPlusPounds;
    } else {
        return WeightBucket.OnePlusPounds;
    }

    return null;
};

const parseCsvFloat = (value: string): number => {
    return parseFloat(value.replace(/ /g, '')) || 0;
};

const fedexParse = async (customerId: string, data: Buffer): Promise<Benchmark> => {
    let rows: Array<string>[];
    try {
        rows = csv(data, {
            delimiter: ';',
            from_line: 2,
        });
    }
    catch (e) {
        rows = csv(data, {
            delimiter: ',',
            from_line: 2,
        });
    }

    const benchmark = await Benchmark.create({
        customerId
    });

    // Cache of totals and discounts, keyed with a unique string
    const totals = {} as { [key: string]: BenchmarkTotal };
    const discounts = {} as { [key: string]: BenchmarkDiscount };

    let minDate = new Date(8640000000000000); // All dates in the file are guaranteed to be less than this large date
    let maxDate = new Date(-8640000000000000); // All dates in the file are guaranteed to be greater than this small date

    for (let row of rows) {
        const method = row[Columns.Method];
        if (!Object.values(Method).includes(method as Method)) {
            continue;
        }

        let bucket: WeightBucket | null;
        if (method === Method.SmartPost) {
            bucket = getSmartPostBucket(parseFloat(row[Columns.Weight]));
        } else {
            bucket = getBucket(parseFloat(row[Columns.Weight]));
        }
        if (!bucket) {
            continue;
        }

        const totalCacheKey = `${benchmark.id}-${method.toString()}-${bucket.toString()}`;
        if (!Object.keys(totals).includes(totalCacheKey)) {
            totals[totalCacheKey] = await BenchmarkTotal.create({
                benchmarkId: benchmark.id,
                method: method.toString(),
                bucket: bucket.toString(),
            });
        }

        const total = totals[totalCacheKey];

        total.count++;
        total.transportationCharge += parseCsvFloat(row[Columns.TransportationCharge]);

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