import React from 'react';

const AnnualizationTable = (props: { benchmarks: any[] }) => (
    <section className="section">
        <h2 className="subtitle">Annualization</h2>
        <table className="table is-fullwidth is-striped is-hoverable">
            <thead>
                <tr>
                    <th>Total Discount $</th>
                    <th>Total Discount %</th>
                    <th>Net Spend</th>
                </tr>
            </thead>
            <tbody>

            </tbody>
        </table>
    </section>
);

export default AnnualizationTable;
