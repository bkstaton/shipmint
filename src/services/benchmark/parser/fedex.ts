import csv from 'csv-parse/lib/sync';
import moment from 'moment';

import { WeightBucket, Method, DiscountType } from '../types';
import { Benchmark, Discount } from '../../../models';

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

const parseCsvFloat = (value: string): number => {
    return parseFloat(value.replace(/ /g, ''));
};

const fedexParse = async (data: Buffer): Promise<Benchmark> => {
    const rows: Array<string>[] = csv(data, {
        delimiter: ';',
        from_line: 2,
    });

    const benchmark = await Benchmark.create();

    let minDate = new Date(8640000000000000); // All dates in the file are guaranteed to be less than this large date
    let maxDate = new Date(-8640000000000000); // All dates in the file are guaranteed to be greater than this small date

    for (let row of rows) {
        const method = row[Columns.Method];
        if (!Object.keys(Method).includes(method)) {
            continue;
        }

        const bucket = getBucket(parseFloat(row[Columns.Weight]));
        if (!bucket) {
            continue;
        }

        benchmark.count++;
        benchmark.transportationCharge += parseCsvFloat(row[Columns.TransportationCharge]);

        const shipmentDate = moment(row[Columns.ShipmentDate], 'YYYYmmdd').toDate();
        if (shipmentDate < minDate) {
            minDate = shipmentDate;
        }
        if (shipmentDate > maxDate) {
            maxDate = shipmentDate;
        }

        for (let i = Columns.FirstDiscountStart; i < row.length; i += 2) {
            // If the name is empty, we've reached the end of this row
            if (!row[i].length) {
                break;
            }

            // If the name is not a valid discount type, skip it
            if (!Object.values(DiscountType).includes(row[i] as DiscountType)) {
                continue;
            }

            const [ discount, created ] = await Discount.findOrCreate({
                where: {
                    benchmarkId: benchmark.id,
                    method: method.toString(),
                    bucket: bucket.toString(),
                    type: row[i],
                }
            });

            discount.amount += parseCsvFloat(row[i+1]);

            await discount.save();
        }
    }

    benchmark.annualizationFactor = moment(maxDate).diff(moment(minDate), 'days') / 365.0;

    await benchmark.save();

    return benchmark;
};

export default fedexParse;