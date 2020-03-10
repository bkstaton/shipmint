import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useSWR, { mutate } from 'swr';
import fetcher from '../fetcher';
import logo from '../images/logo.png';

const Navbar = () => {
    const [ active, setActive ] = useState(false);

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
                <a role="button" className={`navbar-burger burger ${active ? 'is-active' : ''}`} aria-label="menu" aria-expanded="false"  onClick={() => setActive(!active)}>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>
            <div className={`navbar-menu ${active ? 'is-active' : ''}`} onClick={() => setActive(!active)}>
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
