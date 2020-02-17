import Benchmark from "../../models/benchmark";

interface FullBenchmark {
    graceDiscountPercent: number;
    discountPercent: number;
    earnedDiscountPercent: number;
    performancePricingPercent: number;
    automationDiscount: number;
    totalDiscountMoney: number;
    totalDiscountPercent: number;
    netSpend: number;
}

const calculate = (benchmarks: Benchmark[]): FullBenchmark[] => {
    return benchmarks.map(b => {
        return {
            method: b.method,
            weightBucket: b.bucket,
            graceDiscountPercent: b.graceDiscount / b.transportationCharge,
            discountPercent: b.discount / b.transportationCharge,
            earnedDiscountPercent: b.earnedDiscount / b.transportationCharge,
            performancePricingPercent: b.performancePricing / b.transportationCharge,
            automationDiscount: b.automationDiscount / b.transportationCharge,
            totalDiscountMoney: b.graceDiscount + b.discount + b.earnedDiscount + b.performancePricing + b.automationDiscount,
            totalDiscountPercent: (b.graceDiscount + b.discount + b.earnedDiscount + b.performancePricing + b.automationDiscount) / b.transportationCharge,
            netSpend: b.graceDiscount + b.discount + b.earnedDiscount + b.performancePricing + b.automationDiscount + b.transportationCharge,
        };
    });
};

export default calculate;
