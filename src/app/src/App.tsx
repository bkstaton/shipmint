import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Layout from './components/Layout';
import Login from './components/Login';
import Customers from './components/Customers';
import Customer from './components/Customer';

function App() {
  return (
    <Router>
      <Layout>
        <Route path="/hello" render={() => <p>Hello, World!</p>} />
        <Route path="/login" component={Login} />
        <Route exact path="/customers" component={Customers} />
        <Route exact path="/customers/:id" component={Customer} />
      </Layout>
    </Router>
  );
}

export default App;
