import React, { Component } from 'react';
import { AuthConsumer } from 'react-check-auth';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Redirect } from 'react-router';
import Loader from '../Loader/Loader';
import MessageModal from '../MessageModal/MessageModal';
import VideoConference from './components/VideoConference/VideoConference';
import { formatName, getAxiosErrors } from '../../utils';

class Room extends Component {
  constructor(props) {
    super(props);

    this.state = {
      joined: false,
      errors: [],
      goBack: false,
    };

    this.roomName = formatName(props.match.params.roomName);
  }

  componentDidMount() {
    this.setupBeforeUnloadListener();
    (async () => {
      await this.joinRoom();
    })();
  }

  componentWillUnmount() {
    this.onLeave();
  }

  onLeave = () => {
    (async () => {
      await this.leaveRoom();
    })();
  };

  setupBeforeUnloadListener = () => {
    window.addEventListener('beforeunload', (ev) => {
      ev.preventDefault();
      return this.onLeave();
    });
  };

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
  };

  render() {
    const { joined, errors, goBack } = this.state;

    if (goBack) {
      return <Redirect push to='/' />;
    }

    return (
      <Container fluid style={{ height: '100vh' }}>
        <AuthConsumer>
          {({ userInfo }) => {
            if (userInfo && joined && errors.length === 0) {
              return <VideoConference cuid={userInfo.cuid} username={userInfo.name} roomName={this.roomName} />;
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
