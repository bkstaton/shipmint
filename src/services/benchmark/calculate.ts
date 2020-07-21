import { Benchmark } from "../../models";

interface CalculatedDiscount {
    type: string;
    amount: number;
}

interface CalculatedTotal {
    method: string;
    bucket: string;
    order: number;
    discounts: CalculatedDiscount[];
    transportationCharge: number;
}

interface CalculatedSurcharge {
    id: number;
    type: string;
    count: number;
    charge: number;
    publishedCharge: number;
    targetDiscount: number;
}

export interface CalculatedBenchmark {
    id: number;
    annualizationFactor: number;
    file: string;
    totals: CalculatedTotal[];
    surcharges: CalculatedSurcharge[];
    createdAt: Date;
}

const calculate = async (benchmark: Benchmark): Promise<CalculatedBenchmark> => {
    const totals = await benchmark.getTotals();

    const calculatedTotals = (await Promise.all(Object.values(totals).map(async total => {
        const discounts = (await total.getDiscounts())
            .map(d => { return { type: d.type, amount: d.amount }; });

        return {
            id: total.id,
            method: total.method,
            bucket: total.bucket,
            order: total.order,
            bucketOrder: total.bucketOrder,
            count: total.count,
            discounts,
            transportationCharge: total.transportationCharge,
            targetDiscount: total.targetDiscount,
        };
    })));

    const surcharges = await benchmark.getSurcharges();

    const calculatedSurcharges = (await Promise.all(Object.values(surcharges).map(surcharge => {
        return {
            id: surcharge.id,
            type: surcharge.type,
            count: surcharge.count,
            charge: surcharge.totalCharge / surcharge.count,
            publishedCharge: surcharge.publishedCharge || surcharge.totalCharge / surcharge.count,
            targetDiscount: surcharge.targetDiscount,
        }
    })));

    return {
        id: benchmark.id,
        annualizationFactor: benchmark.annualizationFactor,
        file: benchmark.file,
        totals: calculatedTotals,
        surcharges: calculatedSurcharges,
        createdAt: benchmark.createdAt,
    };
};

export default calculate;
