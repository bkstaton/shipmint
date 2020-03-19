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
    ));

    return (
        <div>
            {tables}
        </div>
    );
};

export default DiscountTab;
