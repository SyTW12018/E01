import React, { Component } from 'react';
import { AuthConsumer } from 'react-check-auth';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Redirect } from 'react-router';
import Loader from '../Loader/Loader';
import MessageModal from '../MessageModal/MessageModal';
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
      goBack: false,
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
    const {
      wsConnected, joined, errors, goBack,
    } = this.state;

    if (goBack) {
      return <Redirect push to='/' />;
    }

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
              return <VideoConference username={userInfo.name} roomName={this.roomName} />;
            }

            if (errors.length > 0) {
              return (
                <MessageModal
                  open={errors.length > 0}
                  errors={errors}
                  onClose={() => { this.setState({ goBack: true }); }}
                  headerText='Ups, something went wrong!'
                  buttonText='Go back'
                />
              );
            }

            return <Loader text='Connecting...' />;
          }}
        </AuthConsumer>
      </Container>
    );
  }
}

export default Room;
