import React, { Component } from 'react';
import {
  Container, Header, Input,
} from 'semantic-ui-react';
import WebSocket from '../WebSocket/WebSocket';

class Room extends Component {
  constructor(props) {
    super(props);

    this.state = {
      connected: false,
      messages: [],
    };

    this.roomName = props.match.params.roomName;
  }

  onMessage = (message) => {
    this.setState(state => ({ messages: [ ...state.messages, message ] }));
  };

  onConnected = () => {
    this.setState(() => ({ connected: true }));
  };

  sendMessage = () => {
    const { connected } = this.state;
    if (connected) {
      this.ws.send({
        roomName: this.roomName,
        text: this.messageInput.value,
      }, 'chats');
    }
  };

  render() {
    const { messages, connected } = this.state;
    return (
      <Container>
        <WebSocket
          onConnected={this.onConnected}
          onData={this.onMessage}
          ref={(ws) => { this.ws = ws; }}
        />
        <Header>
          ROOM
        </Header>
        <Input
          ref={(input) => { if (input) this.messageInput = input.inputRef; }}
          placeholder='Message...'
          action={{
            loading: !connected, content: 'Send', onClick: this.sendMessage, primary: true,
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
