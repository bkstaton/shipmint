import React from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from '../fetcher';

const Customer = (props: RouteComponentProps<{id: string}>) => {
    const { data: customer } = useSWR<any>(`/api/customers/${props.match.params.id}`, fetcher);

    const history = useHistory();

    return (
        <section className="section">
            <h1 className="title">{customer && customer.name}</h1>
            <h2 className="subtitle">Reports</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>File</th>
                        <th>
                            <button type="button" className="button is-primary">Upload...</button>
                            <input className="input is-hidden" type="file" />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr onClick={() => history.push(`/customers/${props.match.params.id}/benchmarks/1`)}>
                        <td>02/16/2020</td>
                        <td>Benchmark</td>
                        <td><button type="button" className="button is-link">some-file.csv</button></td>
                    </tr>
                </tbody>
            </table>
        </section>
    );
};

export default Customer;
