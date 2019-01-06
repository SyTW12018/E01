import React, { Component } from 'react';
import { AuthConsumer } from 'react-check-auth';
import axios from 'axios';
import {
  Container, Header, Input,
} from 'semantic-ui-react';
import WebSocket from '../WebSocket/WebSocket';
import { formatName } from '../../utils';

class Room extends Component {
  constructor(props) {
    super(props);

    this.state = {
      joined: false,
      wsConnected: false,
      errors: [],
      messages: [],
    };

    this.roomName = formatName(props.match.params.roomName);
  }

  componentDidMount() {
    (async () => {
      await this.joinRoom();
    })();
  }

  componentWillUnmount() {
    (async () => {
      await this.leaveRoom();
    })();
  }

  joinRoom = async () => {
    let errors = [];
    try {
      const result = await axios.post(`/rooms/${this.roomName}`);
      if (result.status === 201 || result.status === 200) {
        this.setState({ joined: true });
        return;
      }
    } catch (e) {
      const responseErrors = e.response.data.errors;
      if (responseErrors && Array.isArray(responseErrors)) {
        errors = responseErrors.map((error) => {
          if (typeof error === 'object') return (error.msg ? error.msg : 'Unknown error');
          return error;
        });
      } else {
        errors = [ e.message ];
      }
    }

    this.setState({
      joined: false,
      errors,
    });
  };

  leaveRoom = async () => {
    await axios.patch(`/rooms/${this.roomName}`);
    this.setState({ joined: false });
  };

  onMessage = (message, channel) => {
    if (channel === 'chats' && message.roomName === this.roomName) {
      this.setState(state => ({ messages: [ ...state.messages, message ] }));
    } else if (channel === 'rooms') {
      if (message.ok) {
        this.setState(() => ({ wsConnected: true }));
      }
    }
  };

  onConnected = () => {
    this.sendData({ roomName: this.roomName }, 'rooms');
  };

  sendData = (data, channel) => {
    this.ws.send(data, channel);
  };

  sendMessage = () => {
    this.sendData({
      roomName: this.roomName,
      text: this.messageInput.value,
    }, 'chats');
  };

  RoomInfo = (userInfo, joined) => (
    <Container fluid>
      <Header>
        {`ROOM ${this.roomName}: ${joined ? 'connected' : 'not connected'}`}
      </Header>
      <Header>
        {`cuid: ${userInfo.cuid}`}
      </Header>
    </Container>
  );

  render() {
    const { messages, wsConnected, joined } = this.state;
    return (
      <Container>
        <WebSocket
          onConnected={this.onConnected}
          onData={this.onMessage}
          ref={(ws) => { this.ws = ws; }}
        />
        <AuthConsumer>
          {({ userInfo }) => (userInfo ? this.RoomInfo(userInfo, joined) : null)}
        </AuthConsumer>
        <Input
          ref={(input) => { if (input) this.messageInput = input.inputRef; }}
          placeholder='Message...'
          action={{
            loading: !wsConnected, content: 'Send', onClick: this.sendMessage, primary: true,
          }}
        />
        <div>
          <ul>
            {messages.map((msg, i) => (
              <li key={i}>{msg.text}</li>
            ))}
          </ul>
        </div>

      </Container>
    );
  }
}

export default Room;
