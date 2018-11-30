import { Component } from 'react';
import PropTypes from 'prop-types';
import SockJS from 'sockjs-client';

class WebSocket extends Component {
  constructor(props) {
    super(props);

    this.socket = new SockJS(`http${props.secure ? 's' : ''}://${props.serverDomain}/${props.wsPath}`);
  }

  componentDidMount() {
    const { onConnected, onData, onError } = this.props;
    this.socket.onopen = () => onConnected();
    this.socket.onmessage = msg => onData(JSON.parse(msg.data));
    this.socket.error = onError;
  }

  send(data) {
    let dataJson;
    if (typeof data === 'object') {
      dataJson = JSON.stringify(data);
    } else if (typeof data === 'string') {
      dataJson = data;
    } else {
      throw new Error('Invalid data format.');
    }

    this.socket.send(dataJson);
  }

  render() {
    return null;
  }
}

WebSocket.propTypes = {
  channel: PropTypes.string.isRequired,
  onData: PropTypes.func.isRequired,
  secure: PropTypes.bool,
  serverDomain: PropTypes.string,
  wsPath: PropTypes.string,
  onError: PropTypes.func,
  onConnected: PropTypes.func,
};

WebSocket.defaultProps = {
  secure: false,
  serverDomain: window.location.host,
  wsPath: 'ws',
  onError: () => {},
  onConnected: () => {},
};

export default WebSocket;
