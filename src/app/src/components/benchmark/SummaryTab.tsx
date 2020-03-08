import React from 'react';
import { formatDollar, formatPercentage } from '../../utility/format';

const SummaryTab = (props: { benchmark: any }) => {
    if (!props.benchmark) {
        return null;
    }

    const {
        transportationCharge,
        totalDiscount,
        targetNetCharge,
    } = props.benchmark.totals.reduce(
        (charges: any, total: any) => {
            const totalDiscount = total.discounts.reduce((total: any, discount: any) => total + discount.amount, 0);

            const targetNetCharge = total.transportationCharge * (1 - (total.targetDiscount / 100 || 0));

            return {
                transportationCharge: charges.transportationCharge + total.transportationCharge,
                totalDiscount: charges.totalDiscount + totalDiscount,
                targetNetCharge: charges.targetNetCharge + targetNetCharge,
            };
        },
        {
            transportationCharge: 0,
            totalDiscount: 0,
            targetNetCharge: 0,
        }
    );

    const currentNetCharge = transportationCharge + totalDiscount;

    const yearlyDiscount = currentNetCharge - targetNetCharge;
    const shipmintFee = (currentNetCharge - targetNetCharge) * 0.05;

    return (
        <div className="section">
            <table className="table is-fullwidth is-hoverable">
                <thead>
                    <tr>
                        <td>&nbsp;</td>
                        <td>Transportation Charge</td>
                        <td>Current Net Charge</td>
                        <td>Current Discounts</td>
                        <td>Target Net Charge</td>
                        <td>Target Delta</td>
                        <td>ShipMint Fee</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>$</td>
                        <td>{formatDollar(transportationCharge)}</td>
                        <td>{formatDollar(currentNetCharge)}</td>
                        <td>{formatDollar(totalDiscount)}</td>
                        <td>{formatDollar(targetNetCharge)}</td>
                        <td>{formatDollar(yearlyDiscount)}</td>
                        <td>{formatDollar(shipmintFee)}</td>
                    </tr>
                </tbody>
            </table>

            <table className="table is-striped is-hoverable">
                <thead>
                    <tr>
                        <td>&nbsp;</td>
                        <td>Net Savings (Year 1)</td>
                        <td>Net Savings (Year 2)</td>
                        <td>Net Savings (Year 3)</td>
                        <td>3-year Total Savings</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>$</td>
                        <td>{formatDollar(yearlyDiscount - shipmintFee)}</td>
                        <td>{formatDollar(yearlyDiscount)}</td>
                        <td>{formatDollar(yearlyDiscount)}</td>
                        <td>{formatDollar((3 * yearlyDiscount) - shipmintFee)}</td>
                    </tr>
                    <tr>
                        <td>%</td>
                        <td>{formatPercentage((yearlyDiscount - shipmintFee) / currentNetCharge)}</td>
                        <td>{formatPercentage(yearlyDiscount / currentNetCharge)}</td>
                        <td>{formatPercentage(yearlyDiscount / currentNetCharge)}</td>
                        <td>{formatPercentage(((3 * yearlyDiscount) - shipmintFee) / (3 * currentNetCharge))}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default SummaryTab;
