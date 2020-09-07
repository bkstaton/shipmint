import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import Login from './components/Login';
import Summary from './components/Summary';
import Shipments from './components/Shipments';
import FedexMethodManager from './components/fedex/MethodManager';
import RouteLayout from './components/routing/RouteLayout';
import Charges from './components/Charges';
import Surcharges from './components/Surcharges';
import Default from './components/Default';

function App() {
  return (
    <Router>
      <Switch>
        <RouteLayout path="/login" component={Login} />
        <RouteLayout path="/customers/:customerId/summary" component={Summary} />
        <RouteLayout path="/customers/:customerId/discounts" component={Charges} />
        <RouteLayout path="/customers/:customerId/surcharges" component={Surcharges} />
        <RouteLayout path="/customers/:customerId/shipments" component={Shipments} />
        <RouteLayout path="/methods/fedex" component={FedexMethodManager} />
        <RouteLayout path="*" component={Default} />
      </Switch>
    </Router>
  );
}

export default App;
