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
    annualization: number;
    discount: number;
}

interface BenchmarkCharge {
    type: string;
    grossCharge: GrossCharge;
    netCharge: NetCharge;
    projectedCharge: ProjectedCharge;
}

interface BenchmarkSummary {
    id: number;
    charges: BenchmarkCharge[];
    grossTotal: GrossCharge;
    netTotal: NetCharge;
    projectedTotal: ProjectedCharge;
    shipmintFee: number;
}

const summarize = async (benchmark: Benchmark): Promise<BenchmarkSummary> => {
    const charges = {} as { [key: string]: BenchmarkCharge };
    for (const total of await benchmark.getTotals()) {
        const newCharge = charges[total.class] || {
            type: total.class,
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
                annualization: 0,
                discount: 0,
            },
        } as BenchmarkCharge;

        newCharge.grossCharge.sample += total.transportationCharge;
        newCharge.grossCharge.annualization += (total.transportationCharge / benchmark.annualizationFactor);

        let totalDiscount = 0;
        for (let d of await total.getDiscounts()) {
            totalDiscount += d.amount;
        }
        newCharge.netCharge.sample += (total.transportationCharge + totalDiscount);
        newCharge.netCharge.annualization += ((total.transportationCharge + totalDiscount) / benchmark.annualizationFactor);

        const annualizedGrossCharge = (total.transportationCharge / benchmark.annualizationFactor);
        newCharge.projectedCharge.annualization += (annualizedGrossCharge - (total.targetDiscount / 100) * annualizedGrossCharge);

        charges[total.class] = newCharge;
    }

    const surcharges = {
        type: 'Surcharges',
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
            annualization: 0,
            discount: 0,
        },
    } as BenchmarkCharge;
    for (const surcharge of await benchmark.getSurcharges()) {
        surcharges.grossCharge.sample += (surcharge.publishedCharge * surcharge.count);
        surcharges.grossCharge.annualization += ((surcharge.publishedCharge * surcharge.count) / benchmark.annualizationFactor);

        surcharges.netCharge.sample += surcharge.totalCharge;
        surcharges.netCharge.annualization += (surcharge.totalCharge / benchmark.annualizationFactor);

        const annualizedGrossCharge = ((surcharge.publishedCharge * surcharge.count) / benchmark.annualizationFactor);
        surcharges.projectedCharge.annualization += (annualizedGrossCharge - (surcharge.targetDiscount / 100) * annualizedGrossCharge);
    }
    charges['Surcharges'] = surcharges;

    for (const charge of Object.values(charges)) {
        charge.netCharge.discount = 100.0 * (charge.grossCharge.annualization - charge.netCharge.annualization) / charge.grossCharge.annualization;
        charge.projectedCharge.discount = 100.0 * (charge.grossCharge.annualization - charge.projectedCharge.annualization) / charge.grossCharge.annualization;
    }

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
        annualization: 0,
        discount: 0,
    };
    for (const charge of Object.values(charges)) {
        grossTotal.sample += charge.grossCharge.sample;
        grossTotal.annualization += charge.grossCharge.annualization;

        netTotal.sample += charge.netCharge.sample;
        netTotal.annualization += charge.netCharge.annualization;

        projectedTotal.annualization += charge.projectedCharge.annualization;
    }
    netTotal.discount = 100.0 * (grossTotal.annualization - netTotal.annualization) / grossTotal.annualization;
    projectedTotal.discount = 100.0 * (grossTotal.annualization - projectedTotal.annualization) / grossTotal.annualization;

    return {
        id: benchmark.id,
        charges: Object.values(charges),
        grossTotal,
        netTotal,
        projectedTotal,
        shipmintFee: 0,
    };
};

export default summarize;
