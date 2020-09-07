import React, { useState } from 'react';
import fetcher from '../../fetcher';
import useSWR from 'swr';
import CustomerModal from './CustomerModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface Props {
    selectedCustomerId?: string;
    onSelect: (customer: any) => void;
}

const CustomerSelector = (props: Props) => {
    const { data: customers } = useSWR<any[]>('/api/customers', fetcher);

    const [modalActive, setModalActive] = useState(false);

    const activeCustomer = customers && props.selectedCustomerId ? customers.find(c => c.id == props.selectedCustomerId) : null;

    return (
        <div className="is-centered">
            <div className="dropdown is-hoverable">
                <div className="dropdown-trigger">
                    <button className="button">
                        {activeCustomer ? activeCustomer.name : 'Select Customer...'} <span className="icon ml-2"><FontAwesomeIcon icon={faChevronDown} /></span>
                    </button>
                </div>
                <div className="dropdown-menu">
                    <div className="dropdown-content">
                        {customers && customers.length ? customers.map(c => (
                            <a
                                key={c.id}
                                onClick={() => props.onSelect(c)}
                                className={`dropdown-item ${c.id == props.selectedCustomerId ? 'is-active' : ''}`}
                            >
                                {c.name}
                            </a>
                        )) : null}
                        <hr className="dropdown-divider" />
                        <a className="dropdown-item" onClick={() => setModalActive(true)}>
                            New Customer
                        </a>
                    </div>
                </div>
            </div>
            <CustomerModal
                isActive={modalActive}
                customer={{name: ''}}
                onClose={(customer) => {
                    setModalActive(false);

                    if (customer.id) {
                        props.onSelect(customer);
                    }
                }}
            />
        </div>
    );
};

export default CustomerSelector;
