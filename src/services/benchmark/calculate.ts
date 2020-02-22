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

const calculate = (benchmark: Benchmark): Promise<CalculatedMethod[]> => {
    return benchmark.getDiscounts().then(discounts => {
        const groupedDiscounts = discounts.reduce((result, discount) => {
            const key = `${discount.method}-${discount.bucket}`;

            let { amount, type, ...other } = discount;

            result[key] = result[key] || {
                discounts: [],
                ...other,
            };

            result[key].discounts.push({ type, amount });

            return result;
        }, {} as {
            [key: string]: {
                method: string,
                bucket: string,
                discounts: Array<{ type: string, amount: number }>,
            }
        });

        return Object.values(groupedDiscounts).map(g => {
            return {
                method: g.method,
                bucket: g.bucket,
                discounts: g.discounts.map(d => { return { type: d.type, amount: d.amount / benchmark.transportationCharge }; }),
                totalDiscountMoney: g.discounts.reduce((total, d) => total + d.amount, 0),
                totalDiscountPercent: g.discounts.reduce((total, d) => total + d.amount, 0) / benchmark.transportationCharge,
                netSpend: g.discounts.reduce((total, d) => total + d.amount, 0) + benchmark.transportationCharge,
            };
        });
    });
};

export default calculate;
