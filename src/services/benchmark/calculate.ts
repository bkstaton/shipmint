import { Benchmark, BenchmarkDiscount } from "../../models";

interface CalculatedDiscount {
    type: string;
    amount: number;
}

interface CalculatedTotal {
    method: string;
    bucket: string;
    discounts: CalculatedDiscount[];
    totalDiscountMoney: number;
    totalDiscountPercent: number;
    netSpend: number;
}

interface CalculatedBenchmark {
    id: number;
    totals: CalculatedTotal[];
    createdAt: Date;
}

const calculate = async (benchmark: Benchmark): Promise<CalculatedBenchmark> => {
    const totals = await benchmark.getTotals();

    const calculatedTotals = await Promise.all(Object.values(totals).map(async total => {
        const discounts = await total.getDiscounts();

        const discountTotal = discounts.reduce((total, d: BenchmarkDiscount) => total + d.amount, 0);

        return {
            method: total.method,
            bucket: total.bucket,
            discounts: discounts.map(d => { return { type: d.type, amount: d.amount / total.transportationCharge }; }),
            totalDiscountMoney: discountTotal,
            totalDiscountPercent: discountTotal / total.transportationCharge,
            netSpend: discountTotal + total.transportationCharge,
        };
    }));

    return {
        id: benchmark.id,
        totals: calculatedTotals,
        createdAt: benchmark.createdAt,
    };
};

export default calculate;
