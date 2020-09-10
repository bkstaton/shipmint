import React from 'react';
import DiscountRow from './DiscountRow';
import { formatPercentage, formatDollar } from '../../utility/format';

const DiscountTable = (props: { method: string, totals: any[], saveTargetDiscount: (totalId: number, targetDiscount: number) => void }) => {
    let totals = {
        transportationCharge: 0,
        count: 0,
        graceDiscount: 0,
        discount: 0,
        earnedDiscount: 0,
        performancePricing: 0,
        automationDiscount: 0,
        automationBonusDiscount: 0,
        totalDiscount: 0,
        targetDiscount: 0,
    };

    const getDiscountValue = (discounts: any[], type: string) => {
        if (!discounts.length) {
            return 0;
        }

        const discount = discounts.find((d: any) => d.type === type);

        if (discount) {
            return discount.amount;
        }

        return 0;
    }

    if (props.totals && props.totals.length) {
        totals = props.totals.reduce(
            (agg, total) => {
                agg.transportationCharge += total.transportationCharge;
                agg.count += total.count;
                agg.graceDiscount += getDiscountValue(total.discounts, 'Grace Discount');
                agg.discount += getDiscountValue(total.discounts, 'Discount');
                agg.earnedDiscount += getDiscountValue(total.discounts, 'Earned Discount');
                agg.performancePricing += getDiscountValue(total.discounts, 'Performance Pricing');
                agg.automationDiscount += getDiscountValue(total.discounts, 'Automation Discount');
                agg.automationBonusDiscount += getDiscountValue(total.discounts, 'Automation Bonus Discount');
                agg.targetDiscount += -1 * (total.targetDiscount || 0) / 100 * total.transportationCharge;

                return agg;
            },
            totals
        );

        totals.totalDiscount = totals.graceDiscount + totals.discount + totals.earnedDiscount + totals.performancePricing + totals.automationDiscount;
    }

    return (
        <div className="panel">
            <div className="panel-heading">
                {props.method}
            </div>
            <div className="panel-block">
                <div className="table-container">
                    <table className="table is-striped is-hoverable">
                        <thead>
                            <tr>
                                <th className="has-text-centered">Weight</th>
                                <th className="has-text-centered">Count</th>
                                <th className="has-text-centered">Transportation Charge</th>
                                <th className="has-text-centered" colSpan={2}>Grace Discount</th>
                                <th className="has-text-centered" colSpan={2}>Discount</th>
                                <th className="has-text-centered" colSpan={2}>Earned Discount</th>
                                <th className="has-text-centered" colSpan={2}>Performance Pricing</th>
                                <th className="has-text-centered" colSpan={2}>Automation Discount</th>
                                <th className="has-text-centered" colSpan={2}>Automation Bonus Discount</th>
                                <th className="has-text-centered" colSpan={2}>Total Discount</th>
                                <th className="has-text-centered">Net Spend</th>
                                <th className="has-text-centered">Net Discount</th>
                                <th className="has-text-centered">Proposed Discount</th>
                                <th className="has-text-centered">Proposed Net Spend</th>
                                <th className="has-text-centered">Net-Net Comparison</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.totals && props.totals.length && props.totals.sort((a: any, b: any) => a.bucketOrder - b.bucketOrder).map((total: any) => (
                                <DiscountRow total={total} saveTargetDiscount={props.saveTargetDiscount} />
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>Total</th>
                                <th>{totals.count}</th>
                                <th className="has-text-right">{formatDollar(totals.transportationCharge)}</th>
                                <th className="has-text-right">{formatDollar(totals.graceDiscount)}</th>
                                <th>{formatPercentage(totals.graceDiscount / totals.transportationCharge)}</th>
                                <th className="has-text-right">{formatDollar(totals.discount)}</th>
                                <th>{formatPercentage(totals.discount / totals.transportationCharge)}</th>
                                <th className="has-text-right">{formatDollar(totals.earnedDiscount)}</th>
                                <th>{formatPercentage(totals.earnedDiscount / totals.transportationCharge)}</th>
                                <th className="has-text-right">{formatDollar(totals.performancePricing)}</th>
                                <th>{formatPercentage(totals.performancePricing / totals.transportationCharge)}</th>
                                <th className="has-text-right">{formatDollar(totals.automationDiscount)}</th>
                                <th>{formatPercentage(totals.automationDiscount / totals.transportationCharge)}</th>
                                <th className="has-text-right">{formatDollar(totals.automationBonusDiscount)}</th>
                                <th>{formatPercentage(totals.automationBonusDiscount / totals.transportationCharge)}</th>
                                <th className="has-text-right">{formatDollar(totals.totalDiscount)}</th>
                                <th>{formatPercentage(totals.totalDiscount / totals.transportationCharge)}</th>
                                <th className="has-text-right">{formatDollar(totals.transportationCharge + totals.totalDiscount)}</th>
                                <th>{formatPercentage(1 - (totals.transportationCharge + totals.totalDiscount) / totals.transportationCharge)}</th>
                                <th className="has-text-right">{formatDollar(totals.targetDiscount)}</th>
                                <th className="has-text-right">{formatDollar(totals.targetDiscount + totals.transportationCharge)}</th>
                                <th className="has-text-right">{formatDollar((totals.targetDiscount + totals.transportationCharge) - (totals.totalDiscount + totals.transportationCharge))}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DiscountTable;
