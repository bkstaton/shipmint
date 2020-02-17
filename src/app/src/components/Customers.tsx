import React, { useState, MouseEvent } from 'react';
import useSWR from 'swr';
import fetcher from '../fetcher';
import { useHistory } from 'react-router-dom';

const Customers = () => {
    const [ newCustomerName, setNewCustomerName ] = useState('');

    const { data: customers, isValidating } = useSWR<any[]>('/api/customers', fetcher);

    const history = useHistory();

    const addCustomer = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        fetcher(
            `/api/customers`,
            {
                method: 'POST',
                headers: [
                    ['Content-Type', 'application/json'],
                ],
                body: JSON.stringify({
                    name: newCustomerName,
                }),
            }
        ).then((data) => {
            history.push(`/customers/${data.id}`);
        });
    };

    return (
        <section className="section">
            <h1 className="title">Customers</h1>

            <h2 className="subtitle">Select Customer</h2>
            <div className={`select ${isValidating ? 'is-loading' : ''}`}>
                <select onChange={e => history.push(`/customers/${e.target.value}`)}>
                    <option  value="">Select one...</option>
                    {customers && customers.length && customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            <h2>Create Customer</h2>
            <form>
                <div className="field">
                    <label className="label">Name</label>
                    <div className="control">
                        <input className="input" type="text" value={newCustomerName} onChange={e => setNewCustomerName(e.target.value)} />
                    </div>
                </div>
                <button className="button is-primary" onClick={addCustomer}>Add Customer</button>
            </form>
        </section>
    );
};

export default Customers;
