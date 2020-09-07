import { ShipmentSummary } from "./calculate";

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

interface CustomerCharge {
    type: string;
    count: number;
    grossCharge: GrossCharge;
    netCharge: NetCharge;
    projectedCharge: ProjectedCharge;
}

interface CustomerSummary {
    count: number;
    transportationCharges: CustomerCharge[];
    surchargeTotal: CustomerCharge;
    grossTotal: GrossCharge;
    netTotal: NetCharge;
    projectedTotal: ProjectedCharge;
}

const summarize = async (shipmentSummary: ShipmentSummary): Promise<CustomerSummary> => {
    const charges = {} as { [key: string]: CustomerCharge };
    for (const total of shipmentSummary.totals) {
        const newCharge = charges[total.class] || {
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
        } as CustomerCharge;

        newCharge.count += total.count;

        const sampleGrossCharge = total.transportationCharge;
        const annualizedGrossCharge = (total.transportationCharge / shipmentSummary.annualizationFactor);

        newCharge.grossCharge.sample += sampleGrossCharge;
        newCharge.grossCharge.annualization += annualizedGrossCharge;

        let totalDiscount = 0;
        for (let d of total.discounts) {
            totalDiscount += d.amount;
        }
        newCharge.netCharge.sample += (total.transportationCharge + totalDiscount);
        newCharge.netCharge.annualization += ((total.transportationCharge + totalDiscount) / shipmentSummary.annualizationFactor);

        newCharge.projectedCharge.sample += (sampleGrossCharge - (total.targetDiscount / 100) * sampleGrossCharge);
        newCharge.projectedCharge.annualization += (annualizedGrossCharge - (total.targetDiscount / 100) * annualizedGrossCharge);

        charges[total.class] = newCharge;
    }

    const surchargeTotal = {
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
    } as CustomerCharge;
    for (const surcharge of shipmentSummary.surcharges) {
        const sampleGrossCharge = (surcharge.publishedCharge * surcharge.count);
        const annualizedGrossCharge = (sampleGrossCharge / shipmentSummary.annualizationFactor);

        surchargeTotal.grossCharge.sample += sampleGrossCharge;
        surchargeTotal.grossCharge.annualization += annualizedGrossCharge;

        surchargeTotal.netCharge.sample += surcharge.totalCharge;
        surchargeTotal.netCharge.annualization += (surcharge.totalCharge / shipmentSummary.annualizationFactor);

        surchargeTotal.projectedCharge.sample += (sampleGrossCharge - (surcharge.targetDiscount / 100) * sampleGrossCharge);
        surchargeTotal.projectedCharge.annualization += (annualizedGrossCharge - (surcharge.targetDiscount / 100) * annualizedGrossCharge);
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
        count,
        transportationCharges: Object.values(charges),
        surchargeTotal,
        grossTotal,
        netTotal,
        projectedTotal,
    };
};

export default summarize;
