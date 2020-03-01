import React from 'react';
import { formatPercentage } from '../../utility/format';

const DiscountTable = (props: { benchmark: any }) => {
    const getDiscountValue = (discounts: any[], type: string) => {
        const discount = discounts.find((d: any) => d.type === type);

        if (discount) {
            return formatPercentage(discount.amount);
        }

        return '---';
    }

    const discountTypes = [
        'Grace Discount',
        'Discount',
        'Earned Discount',
        'Performance Pricing',
        'Automation Discount',
    ];

    return (
        <table className="table is-fullwidth is-striped is-hoverable">
            <thead>
                <tr>
                    <th>Method</th>
                    <th>Weight</th>
                    <th>Grace Discount</th>
                    <th>Discount</th>
                    <th>Earned Discount</th>
                    <th>Performance Pricing</th>
                    <th>Automation Discount</th>
                </tr>
            </thead>
            <tbody>
                {props.benchmark && props.benchmark.totals && props.benchmark.totals.length && props.benchmark.totals.map((total: any) => (
                    <tr key={`${total.method} ${total.weightBucket}`}>
                        <td>{total.method}</td>
                        <td>{total.bucket}</td>
                        {discountTypes.map(type => <td key={type}>{getDiscountValue(total.discounts, type)}</td>)}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DiscountTable;
