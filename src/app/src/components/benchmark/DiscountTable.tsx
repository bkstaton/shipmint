import React from 'react';
import DiscountRow from './DiscountRow';

const DiscountTable = (props: { method: string, totals: any[], saveTargetDiscount: (totalId: number, targetDiscount: number) => void }) => {
    return (
        <div className="panel">
            <div className="panel-heading">
                {props.method}
            </div>
            <div className="panel-block">
                <table className="table is-fullwidth is-striped is-hoverable">
                    <thead>
                        <tr>
                            <th className="has-text-centered">Weight</th>
                            <th className="has-text-centered">Count</th>
                            <th className="has-text-centered" colSpan={2}>Grace Discount</th>
                            <th className="has-text-centered" colSpan={2}>Discount</th>
                            <th className="has-text-centered" colSpan={2}>Earned Discount</th>
                            <th className="has-text-centered" colSpan={2}>Performance Pricing</th>
                            <th className="has-text-centered" colSpan={2}>Automation Discount</th>
                            <th className="has-text-centered" colSpan={2}>Total Discount</th>
                            <th className="has-text-centered">Net Spend</th>
                            <th className="has-text-centered">Net Discount</th>
                            <th className="has-text-centered">Proposed Discount</th>
                            <th className="has-text-centered">Proposed Net Spend</th>
                            <th className="has-text-centered">Net-Net Comparison</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.totals && props.totals.length && props.totals.map((total: any) => (
                            <DiscountRow total={total} saveTargetDiscount={props.saveTargetDiscount} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DiscountTable;
