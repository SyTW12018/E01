import React, { Component } from 'react';
import { AuthConsumer } from 'react-check-auth';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import Loader from '../Loader/Loader';
import WebSocket from '../WebSocket/WebSocket';
import VideoConference from './components/VideoConference/VideoConference';
import { formatName, getAxiosErrors } from '../../utils';

class Room extends Component {
  constructor(props) {
    super(props);

    this.state = {
      joined: false,
      wsConnected: false,
      errors: [],
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
      errors = getAxiosErrors(e);
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

  onData = (data, channel) => {
    if (channel === 'rooms' && data.ok) {
      this.setState(() => ({ wsConnected: true }));
    }
  };

  onConnected = () => {
    this.sendData({ roomName: this.roomName }, 'rooms');
  };

  sendData = (data, channel) => {
    this.ws.send(data, channel);
  };

  render() {
    const { wsConnected, joined, errors } = this.state;

    return (
      <Container>
        <WebSocket
          onConnected={this.onConnected}
          onData={this.onData}
          ref={(ws) => { this.ws = ws; }}
        />
        <AuthConsumer>
          {({ userInfo }) => {
            if (userInfo && wsConnected && joined && errors.length === 0) {
              return <VideoConference username={userInfo.cuid} roomName={this.roomName} />;
            }

            if (errors.length > 0) {
              // TODO show errors
              return <Loader />;
            }

            return <Loader text='Connecting...' />;
          }}
        </AuthConsumer>
      </Container>
    );
  }
}

export default Room;
