import React from 'react';

const AnnualizationTable = (props: { benchmarks: any[] }) => (
    <section className="section">
        <h2 className="subtitle">Annualization</h2>
        <table className="table is-fullwidth is-striped is-hoverable">
            <thead>
                <tr>
                    <td>Total Discount $</td>
                    <td>Total Discount %</td>
                    <td>Net Spend</td>
                </tr>
            </thead>
            <tbody>

            </tbody>
        </table>
    </section>
);

export default AnnualizationTable;
