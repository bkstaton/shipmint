import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useSWR, { mutate } from 'swr';
import fetcher from '../../fetcher';
import logo from '../../images/logo.png';

const Navbar = () => {
    const [active, setActive] = useState(false);

    const params = useParams<{customerId?: string}>();

    const { data: user } = useSWR(
        '/api/user',
        fetcher,
        {
            shouldRetryOnError: false,
            onError: () => mutate('/api/user', null, false)
        }
    );

    return (
        <div className="navbar is-dark">
            <div className="navbar-brand">
                <Link className="navbar-item" to="/customers">
                    <img src={logo} alt="ShipMint" />
                </Link>
                <button type="button" className={`navbar-burger burger ${active ? 'is-active' : ''}`} onClick={() => setActive(!active)}>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </button>
            </div>
            <div className={`navbar-menu ${active ? 'is-active' : ''}`} onClick={() => setActive(!active)}>
                <div className="navbar-start">
                    {params.customerId ? (
                        <div className="navbar-item has-dropdown is-hoverable">
                            <button type="button" className="navbar-link">
                                Shipments
                            </button>
                            <div className="navbar-dropdown">
                                <Link className="navbar-item" to={`/customers/${params.customerId}/summary`}>Summary</Link>
                                <Link className="navbar-item" to={`/customers/${params.customerId}/summary`}>Charges</Link>
                                <Link className="navbar-item" to={`/customers/${params.customerId}/summary`}>Surcharges</Link>
                            </div>
                        </div>
                    ) : null}
                    <div className="navbar-item has-dropdown is-hoverable">
                        <button type="button" className="navbar-link">
                            Admin
                        </button>
                        <div className="navbar-dropdown">
                            <Link className="navbar-item" to="/methods/fedex">FedEx Methods</Link>
                        </div>
                    </div>
                </div>
                <div className="navbar-end">
                    {!user
                        ? <Link className="navbar-item" to="/login">Login</Link>
                        : <a className="navbar-item" href="/auth/logout">Logout</a>
                    }
                </div>
            </div>
        </div>
    );
};

export default Navbar;
