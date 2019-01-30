/* global it */
import React from 'react';
import ReactDOM from 'react-dom';
import Room from './Room';
import VideoConference from './components/VideoConference/VideoConference';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Room match={{ params: { roomName: 'test' } }} />, div);
  ReactDOM.unmountComponentAtNode(div);
  ReactDOM.render(<VideoConference cuid='sdsdgsdfsg' roomName='test' username='anon' />, div);
  ReactDOM.unmountComponentAtNode(div);
});
