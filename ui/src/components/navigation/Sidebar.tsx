import React, { useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import useSWR, { mutate } from 'swr';
import fetcher from '../../fetcher';
import logo from '../../images/logo.png';
import CustomerSelector from './CustomerSelector';
import InvoiceUploadModal from '../InvoiceUploadModal';

const Sidebar = () => {
    const { data: user } = useSWR(
        '/api/user',
        fetcher,
        {
            shouldRetryOnError: false,
            onError: () => mutate('/api/user', null, false)
        }
    );

    const history = useHistory();
    const params = useParams<{ customerId?: string }>();

    const [uploadModalActive, setUploadModalActive] = useState(false);

    const closeModal = () => {
        setUploadModalActive(false);

        history.push(`/customers/${params.customerId}/summary`);
    };

    return (
        <div className="has-background-dark" style={{ height: '100%', overflowY: 'auto' }}>
            <div>
                <div className="has-text-centered px-6 pt-2">
                    <Link to="/">
                        <img src={logo} alt="ShipMint" />
                    </Link>
                </div>
                <div className="has-text-centered has-text-light mt-2">
                    {!user
                        ? <Link className="is-size-5 has-text-light" to="/login">Login</Link>
                        : <><p>Hello, {user.name}!</p><a className="is-size-5 has-text-light" href="/auth/logout">Logout</a></>
                    }
                </div>
                {user ? (
                    <div className="mt-4">
                        <CustomerSelector selectedCustomerId={params.customerId} onSelect={(customer) => history.push(`/customers/${customer.id}/summary`)} />
                        <div className="menu mt-4">
                            {params.customerId ? (
                                <>
                                    <p className="menu-label">
                                        Shipments
                                    </p>
                                    <ul className="menu-list">
                                        <li><Link to={`/customers/${params.customerId}/summary`}>Summary</Link></li>
                                        <li><Link to={`/customers/${params.customerId}/discounts`}>Charges</Link></li>
                                        <li><Link to={`/customers/${params.customerId}/surcharges`}>Surcharges</Link></li>
                                        <li><a href="#" onClick={() => setUploadModalActive(true)}>Upload</a></li>
                                        <InvoiceUploadModal
                                            isActive={uploadModalActive}
                                            onClose={closeModal}
                                            customerId={params.customerId}
                                        />
                                    </ul>
                                </>
                            ) : null}
                            <p className="menu-label">
                                Admin
                            </p>
                            <ul className="menu-list">
                                <li><Link to="/methods/fedex">FedEx Shipping Methods</Link></li>
                            </ul>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default Sidebar;
