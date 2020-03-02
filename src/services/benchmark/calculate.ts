import { Benchmark } from "../../models";

interface CalculatedDiscount {
    type: string;
    amount: number;
}

interface CalculatedTotal {
    method: string;
    bucket: string;
    discounts: CalculatedDiscount[];
    transportationCharge: number;
}

interface CalculatedBenchmark {
    id: number;
    annualizationFactor: number;
    totals: CalculatedTotal[];
    createdAt: Date;
}

const calculate = async (benchmark: Benchmark): Promise<CalculatedBenchmark> => {
    const totals = await benchmark.getTotals();

    const calculatedTotals = await Promise.all(Object.values(totals).map(async total => {
        const discounts = await total.getDiscounts();

        return {
            method: total.method,
            bucket: total.bucket,
            discounts: discounts.map(d => { return { type: d.type, amount: d.amount }; }),
            transportationCharge: total.transportationCharge,
        };
    }));

    return {
        id: benchmark.id,
        annualizationFactor: benchmark.annualizationFactor,
        totals: calculatedTotals,
        createdAt: benchmark.createdAt,
    };
};

export default calculate;
