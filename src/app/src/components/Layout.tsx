import *  as React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }: React.PropsWithChildren<{}>) => (
    <div>
        <Navbar />
        {children}
    </div>
);

export default Layout;
