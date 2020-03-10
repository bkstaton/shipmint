import React, { useState, useEffect } from 'react';
import { formatDollar, formatPercentage } from '../../utility/format';

interface Props {
    total: any;
    saveTargetDiscount: (totalId: number, targetDiscount: number) => void;
}

const DiscountRow = ({ total, saveTargetDiscount: saveTargetDiscount }: Props) => {
    const [ targetDiscount, setTargetDiscount ] = useState(total.targetDiscount);

    useEffect(() => {
        setTargetDiscount(total.targetDiscount);
    }, [total]);

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

    const proposedNetSpend = (1 - targetDiscount / 100) * total.transportationCharge;

    return (
        <tr key={`${total.method} ${total.bucket}`}>
            <td>{total.method}</td>
            <td>{total.bucket}</td>
            {
                discountTypes.map(type => (
                    <td key={`${type}`}>
                        {formatDollar(getDiscountValue(total.discounts, type))}<br />
                        {formatPercentage(getDiscountValue(total.discounts, type) / total.transportationCharge)}
                    </td>
                ))
            }
            <td>
                {formatDollar(totalDiscount)}<br />
                {formatPercentage(totalDiscount / total.transportationCharge)}
            </td>
            <td>{formatDollar(total.transportationCharge + totalDiscount)}</td>
            <td>{formatPercentage(1 - (total.transportationCharge + totalDiscount) / total.transportationCharge)}</td>
            <td>
                <input
                    className="input"
                    type="number"
                    min={0}
                    max={100}
                    step={0.01}
                    value={targetDiscount}
                    onChange={e => setTargetDiscount(parseFloat(e.target.value))}
                    onBlur={() => saveTargetDiscount(total.id, targetDiscount)}
                />
            </td>
            <td>{formatDollar(proposedNetSpend)}</td>
            <td>{formatDollar(proposedNetSpend - (total.transportationCharge + totalDiscount))}</td>
        </tr>
    );
};

export default DiscountRow;
