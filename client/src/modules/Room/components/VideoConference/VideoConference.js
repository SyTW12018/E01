import React, { Component } from 'react';
import {
  Container, Header, Segment, Grid, Responsive,
} from 'semantic-ui-react';
import * as SWRTC from '@andyet/simplewebrtc';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import Loader from '../../../Loader/Loader';
import MessageModal from '../../../MessageModal/MessageModal';
import UsersList from './components/UsersList/UsersList';
import Chat from './components/Chat/Chat';
import styles from './VideoConference.css';
import VideoLayout from './components/VideoLayout/VideoLayout';
import UserControls from './components/UserControls/UserControls';

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
  }

  addUsernameToMedia = (peers, media) => {
    let newMedia = media;
    peers.forEach((peer) => {
      if (peer.id === media.owner.split('/').pop()) {
        let username;
        try {
          ({ username } = JSON.parse(peer.displayName));
        } catch (e) {
          username = 'Loading...';
        }
        newMedia = { ...media, username };
      }
    });

    return newMedia;
  };

  RoomInfo = ({ roomName }) => (
    <Segment
      inverted
      vertical
      padded
      textAlign='center'
      color='orange'
      className={styles.flexStatic}
    >
      <Header inverted size='medium'>
        <Header.Content>
          {`Room: ${roomName}`}
          <Header.Subheader>{`Link to join: ${window.location}`}</Header.Subheader>
        </Header.Content>
      </Header>
    </Segment>
  );

  Room = ({ peers, localVideos, remoteVideos }) => {
    const { roomName, cuid, username } = this.props;
    const newRemoteVideos = remoteVideos.map(media => this.addUsernameToMedia(peers, media));

    return (
      <Container fluid className={`${styles.flexGrowVertical} ${styles.darkBackground}`}>
        <Grid className={`${styles.fullHeight} ${styles.noMargin}`}>

          <Responsive as={Grid.Row} minWidth={1300} className={`${styles.fullHeight} ${styles.noPadding}`}>
            <Grid.Column width={13} className={styles.noPadding}>
              <Container fluid className={styles.fullHeight}>
                <VideoLayout localVideos={localVideos} remoteVideos={newRemoteVideos} />
              </Container>
            </Grid.Column>
            <Grid.Column width={3} className={styles.flexContainer}>
              <UsersList users={peers} />
              <Chat roomName={roomName} />
              <UserControls store={this.store} cuid={cuid} username={username} />
            </Grid.Column>
          </Responsive>

          <Responsive as={Grid.Row} maxWidth={1300} className={`${styles.fullHeight} ${styles.noPadding}`}>
            <Grid.Column className={styles.noPadding}>
              <Container fluid className={styles.fullHeight}>
                <UserControls store={this.store} cuid={cuid} username={username} invisible />
                <VideoLayout localVideos={localVideos} remoteVideos={newRemoteVideos} />
              </Container>
            </Grid.Column>
          </Responsive>

        </Grid>
      </Container>
    );
  };

  render() {
    const { roomName } = this.props;
    const { goBack } = this.state;

    if (goBack) {
      return <Redirect push to='/' />;
    }

    return (
      <Container fluid className={`${styles.flexContainer} ${styles.darkBackground}`}>
        <this.RoomInfo roomName={roomName} />
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

                return <this.Room peers={peers} remoteVideos={remoteVideos} localVideos={localVideos} />;
              }}
            </SWRTC.Room>
          </SWRTC.Connected>

        </SWRTC.Provider>
      </Container>
    );
  }
}

export default VideoConference;
