import React from 'react';
import useSWR from 'swr';
import { useParams } from 'react-router-dom';
import fetcher from '../fetcher';
import SurchargeRow from './surcharges/SurchargeRow';

const Surcharges = () => {
    const params = useParams<{ customerId: string, benchmarkId: string }>();

    const customerId = params.customerId;

    const { data: charges, revalidate } = useSWR(`/api/customers/${customerId}/charges`, fetcher);

    const saveSurchargeDiscount = (type: string, currentDiscount: number | null, targetDiscount: number | null) => {
        fetcher(
            `/api/customers/${customerId}/surcharge-discounts`,
            {
                method: 'PUT',
                headers: [
                    ['Content-Type', 'application/json'],
                ],
                body: JSON.stringify({
                    type,
                    actual: currentDiscount,
                    projected: targetDiscount,
                }),
            }
        ).then(revalidate);
    };

    return (
        <div>
            <h1 className="title">Surcharges</h1>
            <div className="table-container">
                <table className="table is-striped is-hoverable">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Count</th>
                            <th>Published Charge</th>
                            <th>Total Published Charge</th>
                            <th>Total Net Charge</th>
                            <th>Discount ($)</th>
                            <th>Discount (%)</th>
                            <th>Proposed Discount (%)</th>
                            <th>Proposed Net Spend</th>
                            <th>Net-Net Comparison</th>
                        </tr>
                    </thead>
                    <tbody>
                        {charges ? charges.surcharges.sort((a: any, b: any) => a.type < b.type ? -1 : 1).map((surcharge: any) => (
                            <SurchargeRow
                                key={surcharge.type}
                                surcharge={surcharge}
                                saveSurchargeDiscount={saveSurchargeDiscount}
                            />
                        )) : null}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Surcharges;
