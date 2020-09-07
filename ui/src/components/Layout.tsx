import React from 'react';
import Navbar from './navigation/Navbar';
import Sidebar from './navigation/Sidebar';

const Layout = ({ children }: React.PropsWithChildren<{}>) => (
    <div>
        <div className="is-hidden-desktop">
            <Navbar />
        </div>
        <div className="columns is-view-height">
            <div className="column is-full-height is-hidden-touch is-4-desktop is-3-widescreen is-2-fullhd">
                <Sidebar />
            </div>
            <section className="column is-12-touch is-8-desktop is-9-widescreen is-10-fullhd" style={{ overflowY: 'auto' }}>
                <div className="section">
                    {children}
                </div>
            </section>
        </div>
    </div>
);

export default Layout;
