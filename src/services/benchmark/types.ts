export enum WeightBucket {
    OneToFivePounds = '1-5 lbs',
    SixToTenPounds = '6-10 lbs',
    ElevenToFifteenPounds = '11-15 lbs',
    SixteenToTwentyPounds = '16-20 lbs',
    TwentyOneToThirtyPounds = '21-30 lbs',
    ThirtyOneToFiftyPounds = '31-50 lbs',
    FiftyOneToSeventyPounds = '51-70 lbs',
    SeventyPlusPounds = '70+ lbs',
}

export enum Method {
    Ground = 'Ground',
    HomeDelivery = 'Home Delivery',
    SmartPost = 'SmartPost',
    InternationalGround = 'International Ground',
}

export enum DiscountType {
    GraceDiscount = 'Grace Discount',
    Discount = 'Discount',
    EarnedDiscount = 'Earned Discount',
    PerformancePricing = 'Performance Pricing',
    AutomationDiscount = 'Automation Discount',
}

export interface SummaryRow {
    count: number;
    transportationCharge: number;
    graceDiscount: number;
    discount: number;
    earnedDiscount: number;
    performancePricing: number;
    automationDiscount: number;
}

export interface MethodSummary {
    [bucket: string]: SummaryRow;
}

export interface Summary {
    methods: {[method: string]: MethodSummary};
    annualizationFactor: number;
}

export interface Benchmark {

}
