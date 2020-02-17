import React from 'react';

const DiscountPercentTable = (props: { benchmarks: any[] }) => (
    <section className="section">
        <h2 className="subtitle">Discount %</h2>
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
                {props.benchmarks && props.benchmarks.length && props.benchmarks.map(b => (
                    <tr key={`${b.method} ${b.weightBucket}`}>
                        <td>{b.method}</td>
                        <td>{b.weightBucket}</td>
                        <td>{b.graceDiscountPercent}</td>
                        <td>{b.discountPercent}</td>
                        <td>{b.earnedDiscountPercent}</td>
                        <td>{b.performancePricingPercent}</td>
                        <td>{b.automationDiscountPercent}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </section>
);

export default DiscountPercentTable;
