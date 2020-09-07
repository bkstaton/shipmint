import React from 'react';
import DiscountTable from './charges/DiscountTable';
import { groupBy } from 'lodash';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from '../fetcher';

const Charges = () => {
    const params = useParams<{ customerId: string }>();

    const customerId = params.customerId;

    const { data: charges, revalidate } = useSWR(`/api/customers/${customerId}/charges`, fetcher);

    const saveTargetDiscount = (method: string, bucket: string, targetDiscount: number) => {
        fetcher(
            `/api/customers/${customerId}/discounts`,
            {
                method: 'PUT',
                headers: [
                    ['Content-Type', 'application/json'],
                ],
                body: JSON.stringify({
                    method,
                    bucket,
                    discount: targetDiscount,
                }),
            }
        ).then(revalidate);
    };

    const groups = groupBy(charges ? charges.totals : [], d => d.method);

    const tables = Object.keys(groups).map(method => (
        <DiscountTable method={method} totals={groups[method]} saveTargetDiscount={saveTargetDiscount} />
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
            <h1 className="title">Transportation Charges</h1>
            {tables}
        </div>
    );
};

export default Charges;
