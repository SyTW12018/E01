/* global it */
import React from 'react';
import ReactDOM from 'react-dom';
import MessageModal from './MessageModal';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MessageModal />, div);
  ReactDOM.unmountComponentAtNode(div);
});
