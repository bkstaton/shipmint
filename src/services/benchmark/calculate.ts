import { Benchmark } from "../../models";
import { Method, WeightBucket } from "../types/fedex";

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
    file: string;
    totals: CalculatedTotal[];
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
            count: total.count,
            discounts,
            transportationCharge: total.transportationCharge,
            targetDiscount: total.targetDiscount,
        };
    }))).sort((a, b) => {
        if (Object.values(Method).indexOf(a.method as Method) > Object.values(Method).indexOf(b.method as Method)) {
            return 1;
        }
        
        if (Object.values(Method).indexOf(a.method as Method) < Object.values(Method).indexOf(b.method as Method)) {
            return -1;
        }

        if (Object.values(WeightBucket).indexOf(a.bucket as WeightBucket) > Object.values(WeightBucket).indexOf(b.bucket as WeightBucket)) {
            return 1;
        }

        if (Object.values(WeightBucket).indexOf(a.bucket as WeightBucket) < Object.values(WeightBucket).indexOf(b.bucket as WeightBucket)) {
            return -1;
        }

        return 0;
    });

    return {
        id: benchmark.id,
        annualizationFactor: benchmark.annualizationFactor,
        file: benchmark.file,
        totals: calculatedTotals,
        createdAt: benchmark.createdAt,
    };
};

export default calculate;
