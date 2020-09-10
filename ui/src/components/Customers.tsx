import React from 'react';
import { useHistory } from 'react-router-dom';
import { Form } from 'informed';
import useSWR from 'swr';
import fetcher from '../fetcher';
import TextField from './form/TextField';
import SubmitButton from './form/SubmitButton';

const validateName = (value: string) => {
    if (!value || !value.length) {
        return 'Field is required';
    }

    if (value.length < 1) {
        return `Field must have at least 1 character`;
    }

    return undefined;
};

const Customers = () => {
    const { data: customers, isValidating } = useSWR<any[]>('/api/customers', fetcher);

    const history = useHistory();

    const addCustomer = (values: any) => {
        fetcher(
            `/api/customers`,
            {
                method: 'POST',
                headers: [
                    ['Content-Type', 'application/json'],
                ],
                body: JSON.stringify({
                    name: values.name,
                }),
            }
        ).then((data) => {
            history.push(`/customers/${data.id}`);
        });
    };

    return (
        <div>
            <h1 className="title">Customers</h1>

            <h2 className="subtitle">Select Customer</h2>
            <div className={`select ${isValidating ? 'is-loading' : ''}`}>
                <select onChange={e => history.push(`/customers/${e.target.value}`)}>
                    <option  value="">Select one...</option>
                    {customers && customers.length && customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            <h2>Create Customer</h2>
            <Form onSubmit={addCustomer}>
                <TextField label="Name" field="name" validate={validateName} />
                <SubmitButton>Add Customer</SubmitButton>
            </Form>
        </div>
    );
};

export default Customers;
