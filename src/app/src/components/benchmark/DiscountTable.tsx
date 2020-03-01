import React from 'react';
import DiscountRow from './DiscountRow';

const DiscountTable = (props: { benchmark: any }) => {
    return (
        <table className="table is-fullwidth is-striped is-hoverable">
            <thead>
                <tr>
                    <th>Method</th>
                    <th>Weight</th>
                    <th>Grace Discount ($)</th>
                    <th>Grace Discount (%)</th>
                    <th>Discount ($)</th>
                    <th>Discount (%)</th>
                    <th>Earned Discount ($)</th>
                    <th>Earned Discount (%)</th>
                    <th>Performance Pricing ($)</th>
                    <th>Performance Pricing (%)</th>
                    <th>Automation Discount ($)</th>
                    <th>Automation Discount (%)</th>
                    <th>Total Discount ($)</th>
                    <th>Total Discount (%)</th>
                </tr>
            </thead>
            <tbody>
                {props.benchmark && props.benchmark.totals && props.benchmark.totals.length && props.benchmark.totals.map((total: any) => (
                    <DiscountRow total={total} />
                ))}
            </tbody>
        </table>
    );
};

export default DiscountTable;
