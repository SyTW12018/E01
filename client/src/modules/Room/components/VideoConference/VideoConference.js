import React, { Component } from 'react';
import { Container, Header } from 'semantic-ui-react';
import * as SWRTC from '@andyet/simplewebrtc';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import Loader from '../../../Loader/Loader';
import MessageModal from '../../Room';

const API_KEY = '7d23837284fa02e360bfe43e';
const CONFIG_URL = `https://api.simplewebrtc.com/config/guest/${API_KEY}`;

class VideoConference extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    roomName: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      goBack: false,
    };

    this.store = SWRTC.createStore();
  }

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

          <SWRTC.Connecting store={this.store} configUrl={CONFIG_URL}>
            <Loader text={`Connecting to ${roomName}...`} />
          </SWRTC.Connecting>

          <SWRTC.Disconnected store={this.store} configUrl={CONFIG_URL}>
            <Loader text='Lost connection, reattempting to join...' />
          </SWRTC.Disconnected>

          <SWRTC.Failed store={this.store} configUrl={CONFIG_URL}>
            <MessageModal
              open
              text='There was an error initializing the client, the service might not be available. Try again later'
              onClose={() => { this.setState({ goBack: true }); }}
              headerText='Ups, something went wrong!'
              buttonText='Go back'
            />
          </SWRTC.Failed>

          <SWRTC.Connected store={this.store} configUrl={CONFIG_URL}>
            {/* Request the user's media */}
            <SWRTC.RequestUserMedia audio video auto store={this.store} />

            {/* Connect to a room with a name and optional password */}
            <SWRTC.Room name={roomName} store={this.store}>
              {({
                room, peers, localMedia, remoteMedia,
              }) => {
                if (!room.joined) {
                  return <Loader text={`Joining room ${roomName}...`} />;
                }

                const remoteVideos = remoteMedia.filter(m => m.kind === 'video');
                const localVideos = localMedia.filter(m => m.kind === 'video' && m.shared);

                return (
                  <Container fluid>
                    <h1>{room.providedName}</h1>
                    <div>
                      <span>
                        {peers.length}
                      </span>
                    </div>

                    <div>
                      {localVideos.map((video, i) => <SWRTC.Video key={i} media={video} />)}

                      {remoteVideos.map((video, i) => <SWRTC.Video key={i + 10} media={video} />)}
                    </div>

                  </Container>);
              }}
            </SWRTC.Room>
          </SWRTC.Connected>

        </SWRTC.Provider>
      </Container>
    );
  }
}

export default VideoConference;
