import * as React from 'react';

const Navbar = () => (
    <div className="navbar is-dark">
        <div className="navbar-brand">
            <a className="navbar-item" href="index.html">
                <img src="https://goshipmint.com/wp-content/uploads/2019/02/goshipmint-logo.png" />
            </a>
        </div>
        <div className="navbar-menu">
            <div className="navbar-end">
                <a className="navbar-item" href="#">Logout</a>
            </div>
        </div>
    </div>
);

export default Navbar;
