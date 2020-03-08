import React from 'react';
import { formatDollar, formatPercentage } from '../../utility/format';

interface Props {
    total: any;
    setTargetDiscount: (totalId: number, targetDiscount: number) => void;
}

const DiscountRow = ({ total, setTargetDiscount }: Props) => {
    const getDiscountValue = (discounts: any[], type: string) => {
        const discount = discounts.find((d: any) => d.type === type);

        if (discount) {
            return discount.amount;
        }

        return 0;
    }

    const discountTypes = [
        'Grace Discount',
        'Discount',
        'Earned Discount',
        'Performance Pricing',
        'Automation Discount',
    ];

    const totalDiscount = total.discounts.reduce((total: number, discount: any) => total + discount.amount, 0);

    return (
        <tr key={`${total.method} ${total.bucket}`}>
            <td>{total.method}</td>
            <td>{total.bucket}</td>
            {
                discountTypes.map(type => (
                    <>
                        <td key={`${type}_amount`}>{formatDollar(getDiscountValue(total.discounts, type))}</td>
                        <td key={`${type}_percent`}>{formatPercentage(getDiscountValue(total.discounts, type) / total.transportationCharge)}</td>
                    </>
                ))
            }
            <td>{formatDollar(totalDiscount)}</td>
            <td>{formatPercentage(totalDiscount / total.transportationCharge)}</td>
            <td>{formatDollar(total.transportationCharge + totalDiscount)}</td>
            <td></td>
            <td>
                <input
                    className="input"
                    type="number"
                    min={0}
                    max={100}
                    step={0.01}
                    value={total.targetDiscount}
                    onChange={e => setTargetDiscount(total.id, parseFloat(e.target.value))}
                />
            </td>
        </tr>
    );
};

export default DiscountRow;
