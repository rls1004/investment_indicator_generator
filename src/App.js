import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import Home from './routes/Home';
import Gen from './routes/Gen';
import Detail from './routes/Detail';
import Navigation from './components/Navigation';

function App() {
  return (
    <HashRouter>
      <Navigation />
      <Route path="/" exact={true} component={Home} />
      <Route path="/gen" component={Gen} />
      <Route path="/detail" component={Detail} />
    </HashRouter>
  );
}

export default App;
