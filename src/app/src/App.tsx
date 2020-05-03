import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Layout from './components/Layout';
import Login from './components/Login';
import Benchmark from './components/Benchmark';
import Customers from './components/Customers';
import Customer from './components/Customer';
import FedexMethodManager from './components/fedex/MethodManager';

function App() {
  return (
    <Router>
      <Layout>
        <Route path="/login" component={Login} />
        <Route exact path="/customers" component={Customers} />
        <Route exact path="/customers/:id" component={Customer} />
        <Route exact path="/customers/:customerId/benchmarks/:benchmarkId" component={Benchmark} />
        <Route exact path="/methods/fedex" component={FedexMethodManager} />
      </Layout>
    </Router>
  );
}

export default App;
