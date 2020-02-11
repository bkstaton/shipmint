import * as React from 'react';
import useSWR, { mutate } from 'swr';
import fetcher from '../fetcher';

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
                <a className="navbar-item" href="/">
                    <img src="https://goshipmint.com/wp-content/uploads/2019/02/goshipmint-logo.png" />
                </a>
            </div>
            <div className="navbar-menu">
                <div className="navbar-end">
                    {!user
                        ? <a className="navbar-item" href="/login">Login</a>
                        : <a className="navbar-item" href="/auth/logout">Logout</a>
                    }
                </div>
            </div>
        </div>
    );
};

export default Navbar;
