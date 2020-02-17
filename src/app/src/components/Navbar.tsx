import * as React from 'react';
import useSWR, { mutate } from 'swr';
import fetcher from '../fetcher';
import { Link } from 'react-router-dom';

const Navbar = () => {
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
                <Link className="navbar-item" to="/">
                    <img src="https://goshipmint.com/wp-content/uploads/2019/02/goshipmint-logo.png" alt="ShipMint" />
                </Link>
            </div>
            <div className="navbar-menu">
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
