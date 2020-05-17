import React from 'react';
import SurchargeTable from './SurchargeTable';

interface Props {
    benchmark: any;
}

const SurchargeTab = (props: Props) => {
    if (!props.benchmark) {
        return null;
    }

    return (
        <SurchargeTable surcharges={props.benchmark.surcharges} />
    );
};

export default SurchargeTab;