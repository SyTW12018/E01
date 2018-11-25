import React, { Component } from 'react';
import { Container, Header, Button } from 'semantic-ui-react';
import WebSocket from '../WebSocket/WebSocket';

class Room extends Component {
  ws = null;

  constructor(props) {
    super(props);

    this.state = {
      messages: [],
    };
  }

  onMessage = (message) => {
    this.setState(state => ({ messages: [ ...state.messages, message ] }));
  };

  sendMessage = (message) => {
    this.onMessage('Button clicked');
    if (this.ws) {
      this.onMessage('Send message');
      this.ws.send(message);
    }
  };

  render() {
    const { messages } = this.state;
    return (
      <Container fluid>
        <WebSocket onMessage={this.onMessage} wsPath='ws' channel='room' ref={(ws) => { this.ws = ws; }} />
        <Header>
          ROOM
        </Header>
        <Button onClick={this.sendMessage('Hello')}>
          Send message
        </Button>
        <div>
          <ul>
            {messages.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>

      </Container>
    );
  }
}

export default Room;
