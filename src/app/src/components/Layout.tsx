import *  as React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }: React.PropsWithChildren<{}>) => (
    <div>
        <Navbar />
        <section>
            {children}
        </section>
    </div>
);

export default Layout;
