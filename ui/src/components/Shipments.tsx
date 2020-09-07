import React from 'react';
import useSWR from 'swr';
import fetcher from '../fetcher';
import { useParams } from 'react-router-dom';
import { formatDollar } from '../utility/format';

const Shipments = () => {
    const params = useParams<{customerId: string}>();

    const { data: shipments } = useSWR(`/api/customers/${params.customerId}/shipments`, fetcher);

    return (
        <table className="table is-fullwidth is-hoverable">
            <thead>
                <tr>
                    <th>Shipment Date</th>
                    <th>Invoice Date</th>
                    <th>Carrier</th>
                    <th>Tracking Number</th>
                    <th>Transportation Charge</th>
                    <th>Weight</th>
                </tr>
            </thead>
            <tbody>
                {shipments && shipments.length ? shipments.map((s: any) => (
                    <tr>
                        <td>{s.shipmentDate}</td>
                        <td>{s.invoiceDate}</td>
                        <td>{s.carrier}</td>
                        <td>{s.trackingNumber}</td>
                        <td className="has-text-right">{formatDollar(s.transportationCharge)}</td>
                        <td>{s.weight}</td>
                    </tr>
                )) : null}
            </tbody>
        </table>
    );
};

export default Shipments;
