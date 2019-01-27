/* global it */
import React from 'react';
import ReactDOM from 'react-dom';
import WebSocket from './WebSocket';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<WebSocket />, div);
  ReactDOM.unmountComponentAtNode(div);
});
