import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Layout from './components/Layout';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <Layout>
        <Route path="/hello" render={() => <p>Hello, World!</p>} />
        <Route path="/login" component={Login} />
      </Layout>
    </Router>
  );
}

export default App;
