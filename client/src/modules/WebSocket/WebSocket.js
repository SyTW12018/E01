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
    this.socket.error = props.onError;
    this.socket.onopen = () => {
      this.send(true, 'control');
      props.onConnected();
    };
  }

  componentDidMount() {
    const { onData } = this.props;
    this.socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      onData(data.data, data.channel);
    };
  }

  send(data, channel) {
    const authToken = this.cookies.get('authToken', { doNotParse: true });
    this.socket.send(JSON.stringify({ authToken, channel, data }));
  }

  render() {
    return null;
  }
}

export default withCookies(WebSocket);
