import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from '../fetcher';

const Customer = (props: RouteComponentProps<{id: string}>) => {
    const { data: customer } = useSWR<any>(`/api/customers/${props.match.params.id}`, fetcher);

    return (
        <section className="section">
            <h1 className="title">{customer && customer.name}</h1>
        </section>
    );
};

export default Customer;