import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Route path="/hello" render={() => <p>Hello, World!</p>} />
      </Layout>
    </Router>
  );
}

export default App;
