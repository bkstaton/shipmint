import React from 'react';

const DiscountPercentTable = (props: { benchmarks: any[] }) => (
    <section className="section">
        <h2 className="subtitle">Discount %</h2>
        <table className="table is-fullwidth is-striped is-hoverable">
            <thead>
                <tr>
                    <td>Method</td>
                    <td>Weight</td>
                    <td>Grace Discount</td>
                    <td>Discount</td>
                    <td>Earned Discount</td>
                    <td>Performance Pricing</td>
                    <td>Automation Discount</td>
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
