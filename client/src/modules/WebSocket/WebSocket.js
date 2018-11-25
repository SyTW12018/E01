import { Component } from 'react';
import PropTypes from 'prop-types';
import SockJS from 'sockjs-client';

const connect = () => {
  console.log('WebSocket open');
};

const setupWebSocket = () => {
  const { onMessage, onError } = this.props;
  this.socket.onopen = connect;
  this.socket.onmessage = onMessage;
  this.socket.error = onError;
};

class WebSocket extends Component {
  constructor(props) {
    super(props);

    this.socket = new SockJS('http://localhost:3001/ws');
    /*
    this.state = {
      socket: new SockJS('http://localhost:3001/ws'),
    };
    */
  }

  componentDidMount() {
    setupWebSocket.bind(this);
  }

  send(message) {
    this.socket.send(message);
  }

  render() {
    return null;
  }
}

WebSocket.propTypes = {
  wsPath: PropTypes.string.isRequired,
  channel: PropTypes.string.isRequired,
  onMessage: PropTypes.func.isRequired,
  onError: PropTypes.func,
};

WebSocket.defaultProps = {
  onError: () => {},
};

export default WebSocket;
