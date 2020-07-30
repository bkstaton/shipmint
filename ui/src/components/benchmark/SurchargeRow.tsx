import React, { useEffect, useState } from 'react';
import { formatDollar, formatPercentage } from '../../utility/format';

interface Props {
    surcharge: any;
    savePublishedCharge: (surchargeId: number, publishedCharge: number | null, targetDiscount: number | null) => void;
}

const SurchargeRow = ({ surcharge, savePublishedCharge }: Props) => {
    const [publishedCharge, setPublishedCharge] = useState(surcharge.publishedCharge);
    const [targetDiscount, setTargetDiscount] = useState(surcharge.targetDiscount);

    useEffect(() => {
        setPublishedCharge(surcharge.publishedCharge);
        setTargetDiscount(surcharge.targetDiscount);
    }, [surcharge]);

    const [values, setValues] = useState({
        totalPublishedCharge: surcharge.publishedCharge * surcharge.count,
        totalCharge: surcharge.charge * surcharge.count,
        discount: (surcharge.publishedCharge * surcharge.count) - (surcharge.charge * surcharge.count),
        proposedNetCharge:(surcharge.publishedCharge * surcharge.count) - (targetDiscount * surcharge.publishedCharge * surcharge.count / 100),
    });

    useEffect(() => {
        setValues({
            totalPublishedCharge: publishedCharge * surcharge.count,
            totalCharge: surcharge.charge * surcharge.count,
            discount: (publishedCharge * surcharge.count) - (surcharge.charge * surcharge.count),
            proposedNetCharge: (publishedCharge * surcharge.count) - (targetDiscount * publishedCharge * surcharge.count / 100),
        });
    }, [surcharge, publishedCharge, targetDiscount]);

    return (
        <tr>
            <td>{surcharge.type}</td>
            <td>{surcharge.count}</td>
            <td>
                <input
                    className="input"
                    type="number"
                    min={0}
                    step={0.01}
                    value={publishedCharge !== undefined ? publishedCharge : ''}
                    onChange={e => setPublishedCharge(e.target.value && e.target.value.length ? parseFloat(e.target.value) : null)}
                    onBlur={() => savePublishedCharge(surcharge.id, publishedCharge, targetDiscount)}
                />
            </td>
            <td>{formatDollar(values.totalPublishedCharge)}</td>
            <td>{formatDollar(values.totalCharge)}</td>
            <td>{formatDollar(values.discount)}</td>
            <td>{formatPercentage(values.discount / values.totalPublishedCharge)}</td>
            <td>
                <input
                    className="input"
                    type="number"
                    min={0}
                    step={0.01}
                    value={targetDiscount !== undefined ? targetDiscount : ''}
                    onChange={e => setTargetDiscount(e.target.value && e.target.value.length ? parseFloat(e.target.value) : null)}
                    onBlur={() => savePublishedCharge(surcharge.id, publishedCharge, targetDiscount)}
                />
            </td>
            <td>{formatDollar(values.proposedNetCharge)}</td>
            <td>{formatDollar(values.proposedNetCharge - values.totalCharge)}</td>
        </tr>
    );
};

export default SurchargeRow;
