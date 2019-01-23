/* global it */
import React from 'react';
import ReactDOM from 'react-dom';
import NavBar from './NavBar';
import LogOutButton from './components/LogOutButton/LogOutButton';
import SettingsForm from './components/SettingsForm/SettingsForm';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<NavBar />, div);
  ReactDOM.unmountComponentAtNode(div);
  ReactDOM.render(<LogOutButton refreshAuth={() => {}} />, div);
  ReactDOM.unmountComponentAtNode(div);
  ReactDOM.render(<SettingsForm refreshAuth={() => {}} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
