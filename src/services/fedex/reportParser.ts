import csv from 'csv-parse/lib/sync';

enum Columns {
    Method = 11,
    Weight = 20,
    TransportationCharge = 9,
    FirstDiscountStart = 105,
}

enum WeightBucket {
    OneToFivePounds = '1-5 lbs',
    SixToTenPounds = '6-10 lbs',
    ElevenToFifteenPounds = '11-15 lbs',
    SixteenToTwentyPounds = '16-20 lbs',
    TwentyOneToThirtyPounds = '21-30 lbs',
    ThirtyOneToFiftyPounds = '31-50 lbs',
    FiftyOneToSeventyPounds = '51-70 lbs',
    SeventyPlusPounds = '70+ lbs',
}

enum Method {
    Ground = 'Ground',
    HomeDelivery = 'Home Delivery',
    SmartPost = 'SmartPost',
    InternationalGround = 'International Ground',
}

enum DiscountType {
    GraceDiscount = 'Grace Discount',
    Discount = 'Discount',
    EarnedDiscount = 'Earned Discount',
    PerformancePricing = 'Performance Pricing',
    AutomationDiscount = 'Automation Discount',
}

interface SummaryRow {
    count: number;
    transportationCharge: number;
    graceDiscount: number;
    discount: number;
    earnedDiscount: number;
    performancePricing: number;
    automationDiscount: number;
}

interface MethodSummary {
    [bucket: string]: SummaryRow;
}

interface Summary {
    [method: string]: MethodSummary;
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

const parse = (data: Buffer) => {
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
        [Method.Ground.toString()]: { ...defaultMethodSummary },
        [Method.HomeDelivery.toString()]: { ...defaultMethodSummary },
        [Method.SmartPost.toString()]: { ...defaultMethodSummary },
        [Method.InternationalGround.toString()]: { ...defaultMethodSummary },
    };

    rows.forEach((row) => {
        const method = row[Columns.Method];
        if (!Object.keys(Method).includes(method)) {
            return;
        }

        const bucket = getBucket(parseFloat(row[Columns.Weight]));
        if (!bucket) {
            return;
        }
        
        summary[method][bucket].count++;
        summary[method][bucket].transportationCharge += parseCsvFloat(row[Columns.TransportationCharge]);

        for (let i = Columns.FirstDiscountStart;i < row.length;i += 2) {
            if (!row[i].length) {
                break;
            }
            
            switch (row[i]) {
                case DiscountType.GraceDiscount:
                    summary[method][bucket].graceDiscount += parseCsvFloat(row[i+1]);
                    break;
                case DiscountType.Discount:
                    summary[method][bucket].discount += parseCsvFloat(row[i+1]);
                    break;
                case DiscountType.EarnedDiscount:
                    summary[method][bucket].earnedDiscount += parseCsvFloat(row[i+1]);
                    break;
                case DiscountType.PerformancePricing:
                    summary[method][bucket].performancePricing += parseCsvFloat(row[i+1]);
                    break;
                case DiscountType.AutomationDiscount:
                    summary[method][bucket].automationDiscount += parseCsvFloat(row[i+1]);
                    break;
            }
        }
    });

    return summary;
};

export default parse;