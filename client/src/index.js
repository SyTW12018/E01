import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AuthProvider } from 'react-check-auth';
import './index.css';
import './semantic/dist/semantic.min.css';
import LandingPage from './modules/LandingPage/LandingPage';
import Room from './modules/Room/Room';
// import * as serviceWorker from './serviceWorker';

// ReactDOM.render(<LandingPage />, document.getElementById('root'));
ReactDOM.render(
  <AuthProvider authUrl='/auth/user'>
    <BrowserRouter>
      <Switch>
        <Route path='/room/:roomName' component={Room} />
        <Route component={LandingPage} />
      </Switch>
    </BrowserRouter>
  </AuthProvider>,
  document.getElementById('root'),
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
