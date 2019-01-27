/* global it */
import React from 'react';
import ReactDOM from 'react-dom';
import NavBar from './NavBar';
import LogOutButton from './components/LogOutButton/LogOutButton';
import UpdateForm from './components/UpdateForm/UpdateForm';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<NavBar />, div);
  ReactDOM.unmountComponentAtNode(div);
  ReactDOM.render(<LogOutButton refreshAuth={() => {}} />, div);
  ReactDOM.unmountComponentAtNode(div);
  ReactDOM.render(<UpdateForm
    refreshAuth={() => {}}
    userInfo={
    {
      cuid: 'dhbahgfb89bgfbdsagad',
      email: 'admin@videocon.io',
      name: 'admin',
    }}
  />, div);
  ReactDOM.unmountComponentAtNode(div);
});
