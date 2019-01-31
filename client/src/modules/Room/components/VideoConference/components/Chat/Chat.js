import React, { Component } from 'react';
import {
  Container, Comment, Input, Dimmer, Loader, Button, Form, Segment, Header,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Avatar from 'react-avatar';
import WebSocket from '../../../../../WebSocket/WebSocket';
import styles from '../../VideoConference.css';

class Chat extends Component {
  static propTypes = {
    roomName: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      wsConnected: false,
      message: '',
      messages: [],
    };
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    if (this.messagesEnd) this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
  };

  onData = (data, channel) => {
    const { roomName } = this.props;
    const { messages } = this.state;

    if (channel === 'rooms' && data.ok) {
      this.setState(() => ({ wsConnected: true }));
    } else if (channel === 'chats' && data.roomName === roomName) {
      const lastMessage = messages.slice(-1)[0];

      if (lastMessage && lastMessage.sender.cuid === data.sender.cuid) {
        lastMessage.content = `${lastMessage.content}\n${data.content}`;
        this.setState({ messages });
      } else {
        const newMessage = {
          sender: data.sender,
          content: data.content,
          time: data.time,
        };
        this.setState({ messages: [ ...messages, newMessage ] });
      }
    }
  };

  onConnected = () => {
    const { roomName } = this.props;
    this.sendData({ roomName }, 'rooms');
  };

  sendData = (data, channel) => {
    if (this.ws) this.ws.send(data, channel);
  };

  sendMessage = () => {
    const { roomName } = this.props;
    const { message } = this.state;

    this.sendData({
      roomName,
      content: message,
    }, 'chats');

    this.setState({ message: '' });
  };

  Loading = () => (
    <Container fluid className={styles.flexGrowVertical}>
      <Dimmer inverted active>
        <Loader />
      </Dimmer>
    </Container>
  );

  Loaded = () => {
    const { messages } = this.state;

    return (
      <Comment.Group className={`${styles.messagesContainer} ${styles.noMargin}`}>
        <Container fluid className={styles.messages}>
          {messages.map((message, i) => (
            <Comment key={`${message.sender.cuid}@@${i}`}>
              <Avatar name={message.sender.name} round size='2.5em' className='avatar' />
              <Comment.Content>
                <Comment.Author as='span'>{message.sender.name}</Comment.Author>
                <Comment.Metadata>
                  <div>{message.time}</div>
                </Comment.Metadata>
                <Comment.Text style={{ whiteSpace: 'pre-line' }}>{`${message.content}`}</Comment.Text>
              </Comment.Content>
            </Comment>
          ))}
          <div
            style={{ float: 'left', clear: 'both' }}
            ref={(el) => { this.messagesEnd = el; }}
          />
        </Container>
      </Comment.Group>
    );
  };

  SendButton = () => (
    <Button
      color='orange'
      icon='location arrow'
      content='Send'
      onClick={this.sendMessage}
      type='submit'
    />
  );

  render() {
    const { wsConnected, message } = this.state;

    return (
      <Segment.Group className={`${styles.flexGrowVertical} ${styles.flexContainer} ${styles.chat}`}>
        <Segment inverted color='orange' textAlign='center' className={styles.flexStatic}>
          <Header size='medium'>Chat</Header>
        </Segment>
        <Segment className={`${styles.flexGrowVertical} ${styles.flexContainer} ${styles.noTopPadding}`}>
          <WebSocket
            onConnected={this.onConnected}
            onData={this.onData}
            ref={(ws) => { this.ws = ws; }}
          />

          {wsConnected ? <this.Loaded /> : <this.Loading />}

          <Form className={styles.flexStatic}>
            <Input
              action={<this.SendButton />}
              placeholder='Message...'
              fluid
              value={message}
              loading={!wsConnected}
              onChange={(e) => { this.setState({ message: e.target.value }); }}
            />
          </Form>

        </Segment>
      </Segment.Group>
    );
  }
}

export default Chat;
