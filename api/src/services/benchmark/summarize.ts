import { Benchmark } from "../../models";

interface GrossCharge {
    sample: number;
    annualization: number;
}

interface NetCharge {
    sample: number;
    annualization: number;
    discount: number;
}

interface ProjectedCharge {
    sample: number;
    annualization: number;
    discount: number;
}

interface BenchmarkSurcharge {
    count: number;
    grossCharge: GrossCharge;
    netCharge: NetCharge;
    projectedCharge: ProjectedCharge;
}

type BenchmarkCharge = BenchmarkSurcharge & {
    type: string;
    method: string;
};

export interface BenchmarkSummary {
    id: number;
    charges: BenchmarkCharge[];
    surcharges: BenchmarkCharge;
    countTotal: number;
    grossTotal: GrossCharge;
    netTotal: NetCharge;
    projectedTotal: ProjectedCharge;
}

const summarize = async (benchmark: Benchmark): Promise<BenchmarkSummary> => {
    const charges = {} as { [key: string]: BenchmarkCharge };
    for (const total of await benchmark.getTotals()) {
        const newCharge = charges[total.method] || {
            method: total.method,
            type: total.class,
            count: 0,
            grossCharge: {
                sample: 0,
                annualization: 0,
            },
            netCharge: {
                sample: 0,
                annualization: 0,
                discount: 0,
            },
            projectedCharge: {
                sample: 0,
                annualization: 0,
                discount: 0,
            },
        } as BenchmarkCharge;

        newCharge.count += total.count;

        const sampleGrossCharge = total.transportationCharge;
        const annualizedGrossCharge = (total.transportationCharge / benchmark.annualizationFactor);

        newCharge.grossCharge.sample += sampleGrossCharge;
        newCharge.grossCharge.annualization += annualizedGrossCharge;

        let totalDiscount = 0;
        for (let d of await total.getDiscounts()) {
            totalDiscount += d.amount;
        }
        newCharge.netCharge.sample += (total.transportationCharge + totalDiscount);
        newCharge.netCharge.annualization += ((total.transportationCharge + totalDiscount) / benchmark.annualizationFactor);

        newCharge.projectedCharge.sample += (sampleGrossCharge - (total.targetDiscount / 100) * sampleGrossCharge);
        newCharge.projectedCharge.annualization += (annualizedGrossCharge - (total.targetDiscount / 100) * annualizedGrossCharge);

        charges[total.class] = newCharge;
    }

    const surcharges = {
        grossCharge: {
            sample: 0,
            annualization: 0,
        },
        netCharge: {
            sample: 0,
            annualization: 0,
            discount: 0,
        },
        projectedCharge: {
            sample: 0,
            annualization: 0,
            discount: 0,
        },
    } as BenchmarkCharge;
    for (const surcharge of await benchmark.getSurcharges()) {
        const sampleGrossCharge = (surcharge.publishedCharge * surcharge.count);
        const annualizedGrossCharge = (sampleGrossCharge / benchmark.annualizationFactor);

        surcharges.grossCharge.sample += sampleGrossCharge;
        surcharges.grossCharge.annualization += annualizedGrossCharge;

        surcharges.netCharge.sample += surcharge.totalCharge;
        surcharges.netCharge.annualization += (surcharge.totalCharge / benchmark.annualizationFactor);

        surcharges.projectedCharge.sample += (sampleGrossCharge - (surcharge.targetDiscount / 100) * sampleGrossCharge);
        surcharges.projectedCharge.annualization += (annualizedGrossCharge - (surcharge.targetDiscount / 100) * annualizedGrossCharge);
    }

    for (const charge of Object.values(charges)) {
        charge.netCharge.discount = 100.0 * (charge.grossCharge.annualization - charge.netCharge.annualization) / charge.grossCharge.annualization;
        charge.projectedCharge.discount = 100.0 * (charge.grossCharge.annualization - charge.projectedCharge.annualization) / charge.grossCharge.annualization;
    }

    let count = 0;
    let grossTotal = {
        sample: 0,
        annualization: 0,
    };
    let netTotal = {
        sample: 0,
        annualization: 0,
        discount: 0,
    };
    let projectedTotal = {
        sample: 0,
        annualization: 0,
        discount: 0,
    };
    for (const charge of Object.values(charges)) {
        count += charge.count;

        grossTotal.sample += charge.grossCharge.sample;
        grossTotal.annualization += charge.grossCharge.annualization;

        netTotal.sample += charge.netCharge.sample;
        netTotal.annualization += charge.netCharge.annualization;

        projectedTotal.sample += charge.projectedCharge.sample;
        projectedTotal.annualization += charge.projectedCharge.annualization;
    }
    netTotal.discount = 100.0 * (grossTotal.annualization - netTotal.annualization) / grossTotal.annualization;
    projectedTotal.discount = 100.0 * (grossTotal.annualization - projectedTotal.annualization) / grossTotal.annualization;

    return {
        id: benchmark.id,
        charges: Object.values(charges),
        surcharges,
        countTotal: count,
        grossTotal,
        netTotal,
        projectedTotal,
    };
};

export default summarize;
