import React from 'react';
import ReactDOM from 'react-dom';

import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';

import HomePage from './HomePage';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path='/:author' component={HomePage} />
      <Redirect from='/' to='/alice' />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);
