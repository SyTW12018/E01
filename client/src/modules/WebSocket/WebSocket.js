import { Component } from 'react';
import PropTypes from 'prop-types';
import SockJS from 'sockjs-client';
import { withCookies } from 'react-cookie';

class WebSocket extends Component {
  static propTypes = {
    onData: PropTypes.func.isRequired,
    secure: PropTypes.bool,
    serverDomain: PropTypes.string,
    wsPath: PropTypes.string,
    onError: PropTypes.func,
    onConnected: PropTypes.func,
  };

  static defaultProps = {
    secure: false,
    serverDomain: window.location.host,
    wsPath: 'ws',
    onError: () => {},
    onConnected: () => {},
  };

  constructor(props) {
    super(props);

    this.cookies = props.cookies;
    this.socket = new SockJS(`http${props.secure ? 's' : ''}://${props.serverDomain}/${props.wsPath}`);
  }

  componentDidMount() {
    const { onConnected, onData, onError } = this.props;
    this.socket.onopen = () => onConnected();
    this.socket.onmessage = msg => onData(JSON.parse(msg.data));
    this.socket.error = onError;
  }

  send(data, channel) {
    let dataJson;
    if (typeof data === 'object') {
      dataJson = JSON.stringify(data);
    } else if (typeof data === 'string') {
      dataJson = data;
    } else {
      throw new Error('Invalid data format.');
    }

    const authToken = this.cookies.get('authToken', { doNotParse: true });
    this.socket.send(JSON.stringify({ authToken, channel, data: dataJson }));
  }

  render() {
    return null;
  }
}

export default withCookies(WebSocket);
