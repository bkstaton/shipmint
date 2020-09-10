import React from 'react';
import { groupBy } from 'lodash';
import DiscountTable from './DiscountTable';

interface Props {
    benchmark: any;
    saveTargetDiscount: (totalId: number, targetDiscount: number) => void;
}

const DiscountTab = (props: Props) => {
    const groups = groupBy(props.benchmark ? props.benchmark.totals : [], t => t.method);

    const tables = Object.keys(groups).map(method => (
        <DiscountTable method={method} totals={groups[method]} saveTargetDiscount={props.saveTargetDiscount} />
    )).sort((a, b) => {
        const aOrder = a.props.totals[0].order;
        const bOrder = b.props.totals[0].order;

        if (aOrder === null) {
            if (bOrder !== null) {
                return 1;
            }
            return 0;
        }

        if (bOrder === null) {
            if (aOrder !== null) {
                return -1;
            }
            return 0;
        }

        return aOrder - bOrder;
    });

    return (
        <div>
            {tables}
        </div>
    );
};

export default DiscountTab;
