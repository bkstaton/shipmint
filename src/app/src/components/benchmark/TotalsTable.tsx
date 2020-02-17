import React from 'react';

const TotalsTable = (props: { benchmarks: any[] }) => (
    <section className="section">
        <h2 className="subtitle">Totals</h2>
        <table className="table is-fullwidth is-striped is-hoverable">
            <thead>
                <tr>
                    <th>Method</th>
                    <th>Weight</th>
                    <th>Total Discount $</th>
                    <th>Total Discount %</th>
                    <th>Net Spend</th>
                </tr>
            </thead>
            <tbody>
                {props.benchmarks && props.benchmarks.length && props.benchmarks.map(b => (
                    <tr key={`${b.method} ${b.weight}`}>
                        <td>{b.method}</td>
                        <td>{b.weightBucket}</td>
                        <td>{b.totalDiscountMoney}</td>
                        <td>{b.totalDiscountPercent}</td>
                        <td>{b.netSpend}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </section>
);

export default TotalsTable;
