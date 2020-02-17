import csv from 'csv-parse/lib/sync';
import moment from 'moment';

import { WeightBucket, Method, DiscountType } from '../types';
import Benchmark from '../../../models/benchmark';

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

const fedexParse = (data: Buffer): Benchmark[] => {
    const rows: Array<string>[] = csv(data, {
        delimiter: ';',
        from_line: 2,
    });

    const defaultRow = {
        count: 0,
        transportationCharge: 0.0,
        graceDiscount: 0.0,
        discount: 0.0,
        earnedDiscount: 0.0,
        performancePricing: 0.0,
        automationDiscount: 0.0,
    };

    const benchmarks = [] as Benchmark[];

    let minDate = new Date(8640000000000000); // All dates in the file are guaranteed to be less than this large date
    let maxDate = new Date(-8640000000000000); // All dates in the file are guaranteed to be greater than this small date

    rows.forEach((row) => {
        const method = row[Columns.Method];
        if (!Object.keys(Method).includes(method)) {
            return;
        }

        const bucket = getBucket(parseFloat(row[Columns.Weight]));
        if (!bucket) {
            return;
        }

        let benchmark = benchmarks.find(b => b.method === method && b.bucket === bucket);
        if (!benchmark) {
            benchmark = new Benchmark({
                method,
                bucket,
                ...defaultRow,
            });

            benchmarks.push(benchmark);
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

        for (let i = Columns.FirstDiscountStart;i < row.length;i += 2) {
            if (!row[i].length) {
                break;
            }
            
            switch (row[i]) {
                case DiscountType.GraceDiscount:
                    benchmark.graceDiscount += parseCsvFloat(row[i+1]);
                    break;
                case DiscountType.Discount:
                    benchmark.discount += parseCsvFloat(row[i+1]);
                    break;
                case DiscountType.EarnedDiscount:
                    benchmark.earnedDiscount += parseCsvFloat(row[i+1]);
                    break;
                case DiscountType.PerformancePricing:
                    benchmark.performancePricing += parseCsvFloat(row[i+1]);
                    break;
                case DiscountType.AutomationDiscount:
                    benchmark.automationDiscount += parseCsvFloat(row[i+1]);
                    break;
            }
        }
    });

    for (let i in benchmarks) {
        benchmarks[i].annualizationFactor = moment(maxDate).diff(moment(minDate), 'days') / 365.0;
    }

    return benchmarks;
};

export default fedexParse;