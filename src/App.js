import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import ListPage from './Pages/ListPage/ListPage';
import MenuPage from './Pages/MenuPage/MenuPage';

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/">
        <MenuPage />
      </Route>
      <Route path="/:listID">
        <ListPage />
      </Route>
    </Switch>
  </Router>
);

export default App;
