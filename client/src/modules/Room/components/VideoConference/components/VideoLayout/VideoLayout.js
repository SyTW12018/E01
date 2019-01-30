import React from 'react';
import { Container, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import VideoContainer from './components/VideoContainer';
import styles from '../../VideoConference.css';

function VideoLayout(props) {
  const { localVideos, remoteVideos } = props;

  return (
    <Container fluid className={styles.fullHeight}>
      {localVideos.length > 0 ? (<VideoContainer key={localVideos[0].id} media={localVideos[0]} local />) : null}

      {remoteVideos.length > 0 ? (
        <Grid
          centered
          columns={Math.min(remoteVideos.length, 3)}
          className={`${styles.fullHeight} ${styles.noMargin} ${styles.fullWidth}`}
        >
          {remoteVideos.map(remoteVideo => (
            <Grid.Column key={remoteVideo.id} className={`${styles.centerContent} ${styles.videoLayoutColumn}`}>
              <VideoContainer media={remoteVideo} />
            </Grid.Column>
          ))}
        </Grid>
      ) : null}
    </Container>
  );
}

VideoLayout.propTypes = {
  localVideos: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  remoteVideos: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default VideoLayout;
