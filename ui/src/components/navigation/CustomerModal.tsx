import React from 'react';
import fetcher from '../../fetcher';
import { Form } from 'informed';
import TextField from '../form/TextField';
import SubmitButton from '../form/SubmitButton';

interface Customer {
    id?: number;
    name: string;
}

interface Props {
    isActive: boolean;
    customer: Customer;
    onClose: (customer: Customer) => void;
}

const CustomerModal = (props: Props) => {
    const saveCustomer = (customer: Customer) => {
        fetcher(
            props.customer.id ? `/api/customers/${props.customer.id}` : '/api/customers',
            {
                method: props.customer.id ? 'PUT' : 'POST',
                headers: [
                    ['Content-Type', 'application/json'],
                ],
                body: JSON.stringify({
                    name: customer.name,
                }),
            }
        ).then((data: Customer) => {
            props.onClose(data);
        });
    };

    const validateName = (value: string) => {
        if (!value || !value.length) {
            return 'Field is required';
        }
    
        if (value.length < 1) {
            return `Field must have at least 1 character`;
        }
    
        return undefined;
    };

    return (
        <div className={`modal ${props.isActive ? 'is-active' : ''}`}>
            <div className="modal-background" onClick={() => props.onClose(props.customer)}></div>
            <div className="modal-content">
                <div className="box">
                    <Form onSubmit={saveCustomer}>
                        <TextField label="Name" field="name" initialValue={props.customer.name} validate={validateName} />
                        <SubmitButton>Save</SubmitButton>
                    </Form>
                </div>
            </div>
            <button className="modal-close" aria-label="close" onClick={() => props.onClose(props.customer)} />
        </div>
    );
};

export default CustomerModal;
