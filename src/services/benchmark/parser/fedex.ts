import csv from 'csv-parse/lib/sync';
import moment, { min } from 'moment';

import { WeightBucket, Summary, Method, DiscountType } from '../types';

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

const fedexParse = (data: Buffer): Summary => {
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

    const defaultMethodSummary = {
        [WeightBucket.OneToFivePounds.toString()]: { ...defaultRow },
        [WeightBucket.SixToTenPounds.toString()]: { ...defaultRow },
        [WeightBucket.ElevenToFifteenPounds.toString()]: { ...defaultRow },
        [WeightBucket.SixteenToTwentyPounds.toString()]: { ...defaultRow },
        [WeightBucket.TwentyOneToThirtyPounds.toString()]: { ...defaultRow },
        [WeightBucket.ThirtyOneToFiftyPounds.toString()]: { ...defaultRow },
        [WeightBucket.FiftyOneToSeventyPounds.toString()]: { ...defaultRow },
        [WeightBucket.SeventyPlusPounds.toString()]: { ...defaultRow },
    }

    const summary: Summary = {
        methods: {
            [Method.Ground.toString()]: { ...defaultMethodSummary },
            [Method.HomeDelivery.toString()]: { ...defaultMethodSummary },
            [Method.SmartPost.toString()]: { ...defaultMethodSummary },
            [Method.InternationalGround.toString()]: { ...defaultMethodSummary },
        },
        annualizationFactor: 1,
    };

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
        
        summary.methods[method][bucket].count++;
        summary.methods[method][bucket].transportationCharge += parseCsvFloat(row[Columns.TransportationCharge]);

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
                    summary.methods[method][bucket].graceDiscount += parseCsvFloat(row[i+1]);
                    break;
                case DiscountType.Discount:
                    summary.methods[method][bucket].discount += parseCsvFloat(row[i+1]);
                    break;
                case DiscountType.EarnedDiscount:
                    summary.methods[method][bucket].earnedDiscount += parseCsvFloat(row[i+1]);
                    break;
                case DiscountType.PerformancePricing:
                    summary.methods[method][bucket].performancePricing += parseCsvFloat(row[i+1]);
                    break;
                case DiscountType.AutomationDiscount:
                    summary.methods[method][bucket].automationDiscount += parseCsvFloat(row[i+1]);
                    break;
            }
        }
    });

    summary.annualizationFactor = moment(maxDate).diff(moment(minDate), 'days') / 365.0;

    return summary;
};

export default fedexParse;