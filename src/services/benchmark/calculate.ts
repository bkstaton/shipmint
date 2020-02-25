import { Benchmark } from "../../models";

interface CalculatedDiscount {
    type: string;
    amount: number;
}

interface CalculatedMethod {
    method: string;
    bucket: string;
    discounts: CalculatedDiscount[];
    totalDiscountMoney: number;
    totalDiscountPercent: number;
    netSpend: number;
}

const calculate = async (benchmark: Benchmark): Promise<CalculatedMethod[]> => {
    const totals = await benchmark.getTotals();

    return Promise.all(Object.values(totals).map(async total => {
        const discounts = await total.getDiscounts();

        const discountTotal = discounts.reduce((total, d) => total + d.amount, 0);

        return {
            method: total.method,
            bucket: total.bucket,
            discounts: discounts.map(d => { return { type: d.type, amount: d.amount / total.transportationCharge }; }),
            totalDiscountMoney: discountTotal,
            totalDiscountPercent: discountTotal / total.transportationCharge,
            netSpend: discountTotal + total.transportationCharge,
        };
    }));
};

export default calculate;
