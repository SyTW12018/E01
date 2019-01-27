import React, { Component } from 'react';
import { Container, Header, Button } from 'semantic-ui-react';
import * as SWRTC from '@andyet/simplewebrtc';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import Loader from '../../../Loader/Loader';
import MessageModal from '../../../MessageModal/MessageModal';
import UsersList from './components/UsersList/UsersList';

const API_KEY = '7d23837284fa02e360bfe43e';
const CONFIG_URL = `https://api.simplewebrtc.com/config/guest/${API_KEY}`;

class VideoConference extends Component {
  static propTypes = {
    cuid: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    roomName: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      goBack: false,
    };

    this.store = SWRTC.createStore();
    this.userData = JSON.stringify({ cuid: props.cuid, username: props.username });
    this.user = null;
    this.setDisplayName = null;
  }

  setUserInfo = () => {
    if (this.user && this.setDisplayName && this.user.displayName !== this.userData) {
      this.setDisplayName(this.userData);
    }
  };

  RoomInfo = ({ username, roomName }) => (
    <Container fluid>
      <Header>
        {`ROOM ${roomName} (username: ${username})`}
      </Header>
    </Container>
  );

  render() {
    const { username, roomName } = this.props;
    const { goBack } = this.state;

    if (goBack) {
      return <Redirect push to='/' />;
    }

    return (
      <Container fluid>
        <this.RoomInfo username={username} roomName={roomName} />
        <SWRTC.Provider store={this.store} configUrl={CONFIG_URL}>

          <SWRTC.RemoteAudioPlayer store={this.store} />

          <SWRTC.Connecting store={this.store} configUrl={CONFIG_URL}>
            <Loader text={`Connecting to ${roomName}...`} />
          </SWRTC.Connecting>

          <SWRTC.Disconnected store={this.store} configUrl={CONFIG_URL}>
            <Loader text='Lost connection, reattempting to join...' />
          </SWRTC.Disconnected>

          <SWRTC.Failed store={this.store} configUrl={CONFIG_URL}>
            <MessageModal
              open
              errors={
                [ 'There was an error initializing the client, the service might not be available, try again later' ]
              }
              onClose={() => { this.setState({ goBack: true }); }}
              headerText='Ups, something went wrong!'
              buttonText='Go back'
            />
          </SWRTC.Failed>

          <SWRTC.Connected store={this.store} configUrl={CONFIG_URL}>
            <SWRTC.RequestUserMedia audio video auto store={this.store} />

            <SWRTC.Room name={roomName} store={this.store}>
              {({
                room, peers, localMedia, remoteMedia,
              }) => {
                if (!room.joined) {
                  return <Loader text={`Joining room ${roomName}...`} />;
                }

                const remoteVideos = remoteMedia.filter(m => m.kind === 'video');
                const localVideos = localMedia.filter(m => m.kind === 'video' && m.shared);

                if (localVideos.length === 0) {
                  return (
                    <MessageModal
                      open
                      text='Please, allow the use of your camera and microphone to the application'
                      onClose={() => { this.setState({ goBack: true }); }}
                      headerText='We need some permissions'
                      buttonText={'I don\'t have a camera or microphone'}
                    />
                  );
                }

                return (
                  <Container fluid>
                    <h1>{room.providedName}</h1>
                    <div>
                      <UsersList users={peers} />
                    </div>

                    <div>
                      <SWRTC.Video key={localVideos[0].id} media={localVideos[0]} />

                      <SWRTC.UserControls
                        render={({
                          user, isMuted, mute, unmute, setDisplayName,
                        }) => {
                          this.user = user;
                          this.setDisplayName = setDisplayName;
                          window.setTimeout(this.setUserInfo, 1000);
                          return (
                            <div>
                              <Button onClick={() => (isMuted ? unmute() : mute())}>
                                {isMuted ? 'Unmute' : 'Mute'}
                              </Button>
                            </div>
                          );
                        }}
                        store={this.store}
                      />

                      {remoteVideos.map(video => <SWRTC.Video key={video.id} media={video} />)}
                    </div>

                  </Container>
                );
              }}
            </SWRTC.Room>
          </SWRTC.Connected>

        </SWRTC.Provider>
      </Container>
    );
  }
}

export default VideoConference;
