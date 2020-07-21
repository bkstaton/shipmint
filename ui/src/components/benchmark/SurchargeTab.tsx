import React from 'react';
import SurchargeTable from './SurchargeTable';

interface Props {
    benchmark: any;
    savePublishedCharge: (surchargeId: number, publishedCharge: number | null, targetDiscount: number | null) => void;
}

const SurchargeTab = (props: Props) => {
    if (!props.benchmark) {
        return null;
    }

    return (
        <SurchargeTable surcharges={props.benchmark.surcharges} savePublishedCharge={props.savePublishedCharge} />
    );
};

export default SurchargeTab;