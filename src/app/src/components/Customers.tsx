import React from 'react';
import useSWR from 'swr';
import fetcher from '../fetcher';
import { useHistory } from 'react-router-dom';

const Customers = () => {
    const { data: customers, isValidating } = useSWR<any[]>('/api/customers', fetcher);

    const history = useHistory();

    return (
        <div className={`select ${isValidating ? 'is-loading' : ''}`}>
            <select onChange={e => history.push(`/customers/{$e.target.value}`)}>
                {customers && customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
        </div>
    );
};

export default Customers;
