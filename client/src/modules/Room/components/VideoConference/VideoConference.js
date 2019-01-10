import React, { Component } from 'react';
import { Container, Header } from 'semantic-ui-react';
import * as SWRTC from '@andyet/simplewebrtc';
import PropTypes from 'prop-types';

const API_KEY = '7d23837284fa02e360bfe43e';
const CONFIG_URL = `https://api.simplewebrtc.com/config/guest/${API_KEY}`;

class VideoConference extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    roomName: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

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

    return (
      <Container fluid>
        <this.RoomInfo username={username} roomName={roomName} />

        <SWRTC.Connecting store={this.store} configUrl={CONFIG_URL}>
          <h1>Connecting...</h1>
        </SWRTC.Connecting>

        <SWRTC.Disconnected store={this.store} configUrl={CONFIG_URL}>
          <h1>Lost connection. Reattempting to join...</h1>
        </SWRTC.Disconnected>

        <SWRTC.Failed store={this.store} configUrl={CONFIG_URL}>
          <p>
            There was an error initializing the client. The service might not be available.
          </p>
        </SWRTC.Failed>

        <SWRTC.Connected store={this.store} configUrl={CONFIG_URL}>
          <h1>Connected!</h1>
          {/* Request the user's media */}
          <SWRTC.RequestUserMedia audio video auto store={this.store} />

          {/* Connect to a room with a name and optional password */}
          <SWRTC.Room name={roomName} store={this.store}>
            {({
              room, peers, localMedia, remoteMedia,
            }) => {
              /* Use the rest of the SWRTC React Components to render your UI */
              if (!room.joined) {
                return <h1>Joining room...</h1>;
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
                    <SWRTC.PeerList
                      store={this.store}
                      room={room.address}
                      speaking
                      render={({ peers }) => {
                        if (peers.length === 0) {
                          return null;
                        }

                        return (
                          <span>
                            {peers.length}
                          </span>
                        );
                      }}
                    />
                  </div>

                  <SWRTC.GridLayout
                    store={this.store}
                    items={[ ...localVideos, ...remoteVideos ]}
                    renderCell={item => (<SWRTC.Video media={item} />)}
                  />

                </Container>);
            }}
          </SWRTC.Room>
        </SWRTC.Connected>

      </Container>
    );
  }
}

export default VideoConference;
