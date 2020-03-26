import React, { useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from '../fetcher';
import BenchmarkUploadModal from './BenchmarkUploadModal';
import Breadcrumb from './Breadcrumb';

const Customer = (props: RouteComponentProps<{id: string}>) => {
    const { data: customer } = useSWR<any>(`/api/customers/${props.match.params.id}`, fetcher);
    const { data: benchmarks } = useSWR(`/api/customers/${props.match.params.id}/benchmarks`, fetcher);

    const [ uploadModalActive, setUploadModalActive ] = useState(false);

    const history = useHistory();

    const breadcrumbs = [
        { path: '/customers', name: 'Customers' },
        { path: `/customers/${props.match.params.id}`, name: props.match.params.id },
    ];

    return (
        <div>
            <Breadcrumb breadcrumbs={breadcrumbs} />
            <h1 className="title">{customer && customer.name}</h1>
            <h2 className="subtitle">Reports</h2>
            <table className="table is-fullwidth is-hoverable">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>File</th>
                        <th>
                            <button type="button" className="button is-primary" onClick={() => setUploadModalActive(true)}>Upload...</button>
                            <BenchmarkUploadModal customerId={props.match.params.id} isActive={uploadModalActive} onClose={() => setUploadModalActive(false)} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {benchmarks && benchmarks.length && benchmarks.map((b: any) => (
                        <tr onClick={() => history.push(`/customers/${customer.id}/benchmarks/${b.id}`)}>
                            <td>{b.createdAt}</td>
                            <td>
                                <a
                                    href={`/api/customers/${customer.id}/benchmarks/${b.id}/file`}
                                    target="_blank"
                                    onClick={e => e.preventDefault()}
                                >
                                    {b.file}
                                </a>
                            </td>
                            <td>&nbsp;</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Customer;
