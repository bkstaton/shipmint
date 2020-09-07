import React from 'react';
import { Route } from 'react-router-dom';
import Layout from '../Layout';

const RouteLayout = (props: any) => {
    const {
        component: Component,
        ...rest
    } = props;

    return (
        <Route {...rest} render={() => (<Layout {...props}><Component {...props} /></Layout>)} />
    );
};

export default RouteLayout;
