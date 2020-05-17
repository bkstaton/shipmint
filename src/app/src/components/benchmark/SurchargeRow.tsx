import React from 'react';
import { formatDollar, formatPercentage } from '../../utility/format';

interface Props {
    surcharge: any;
}

const SurchargeRow = ({ surcharge }: Props) => {
    const totalPublishedCharge = surcharge.publishedCharge * surcharge.count;
    const totalCharge = surcharge.charge * surcharge.count;
    const discount = totalPublishedCharge - totalCharge;

    return (
        <tr>
            <td>{surcharge.type}</td>
            <td>{surcharge.count}</td>
            <td>{formatDollar(surcharge.publishedCharge)}</td>
            <td>{formatDollar(totalPublishedCharge)}</td>
            <td>{formatDollar(totalCharge)}</td>
            <td>{formatDollar(discount)}</td>
            <td>{formatPercentage(discount / totalPublishedCharge)}</td>
        </tr>
    );
};

export default SurchargeRow;
