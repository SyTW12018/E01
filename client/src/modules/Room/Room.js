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

    (async () => {
      await this.joinRoom();
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

  onMessage = (message, channel) => {
    if (channel === 'chats') {
      this.setState(state => ({ messages: [ ...state.messages, message ] }));
    }
  };

  onConnected = () => {
    this.setState(() => ({ wsConnected: true }));
  };

  sendMessage = () => {
    const { wsConnected } = this.state;
    if (wsConnected) {
      this.ws.send({
        roomName: this.roomName,
        text: this.messageInput.value,
      }, 'chats');
    }
  };

  RoomInfo = userInfo => (
    <Container fluid>
      <Header>
        {`ROOM ${this.roomName}`}
      </Header>
      <Header>
        {`cuid: ${userInfo.cuid}`}
      </Header>
    </Container>
  );

  render() {
    const { messages, wsConnected } = this.state;
    return (
      <Container>
        <WebSocket
          onConnected={this.onConnected}
          onData={this.onMessage}
          ref={(ws) => { this.ws = ws; }}
        />
        <AuthConsumer>
          {({ userInfo }) => (userInfo ? this.RoomInfo(userInfo) : null)}
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
