import React from 'react';

const TotalsTable = (props: { benchmarks: any[], setTargetNetCharge: (id: number, val: number) => void }) => (
    <div>
        <h2 className="subtitle">Totals</h2>
        <table className="table is-fullwidth is-striped is-hoverable">
            <thead>
                <tr>
                    <th>Method</th>
                    <th>Weight</th>
                    <th>Total Discount $</th>
                    <th>Total Discount %</th>
                    <th>Net Spend</th>
                    <th>Target Discount $</th>
                    <th>Target Discount %</th>
                    <th>Target Net Spend</th>
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
                        <td>
                            <input
                                className="input"
                                type="number"
                                min={0}
                                step={0.01}
                                value={b.targetNetCharge}
                                onChange={e => props.setTargetNetCharge(b.id, parseFloat(e.target.value))}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default TotalsTable;
