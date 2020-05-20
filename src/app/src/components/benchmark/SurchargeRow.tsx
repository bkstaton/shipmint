import React, { useEffect, useState } from 'react';
import { formatDollar, formatPercentage } from '../../utility/format';

interface Props {
    surcharge: any;
    savePublishedCharge: (surchargeId: number, publishedCharge: number | null) => void;
}

const SurchargeRow = ({ surcharge, savePublishedCharge }: Props) => {
    const [publishedCharge, setPublishedCharge] = useState(surcharge.publishedCharge);

    useEffect(() => {
        setPublishedCharge(surcharge.publishedCharge);
    }, [surcharge]);

    const [values, setValues] = useState({
        totalPublishedCharge: surcharge.publishedCharge * surcharge.count,
        totalCharge: surcharge.charge * surcharge.count,
        discount: (surcharge.publishedCharge * surcharge.count) - (surcharge.charge * surcharge.count),
    });

    useEffect(() => {
        setValues({
            totalPublishedCharge: publishedCharge * surcharge.count,
            totalCharge: surcharge.charge * surcharge.count,
            discount: (publishedCharge * surcharge.count) - (surcharge.charge * surcharge.count),
        });
    }, [surcharge, publishedCharge]);

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
                    value={publishedCharge || ''}
                    onChange={e => setPublishedCharge(e.target.value && e.target.value.length ? parseFloat(e.target.value) : null)}
                    onBlur={() => savePublishedCharge(surcharge.id, publishedCharge)}
                />
            </td>
            <td>{formatDollar(values.totalPublishedCharge)}</td>
            <td>{formatDollar(values.totalCharge)}</td>
            <td>{formatDollar(values.discount)}</td>
            <td>{formatPercentage(values.discount / values.totalPublishedCharge)}</td>
        </tr>
    );
};

export default SurchargeRow;
