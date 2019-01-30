import React, { Component } from 'react';
import { Video } from '@andyet/simplewebrtc';
import { Container } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import styles from '../../../VideoConference.css';

class VideoContainer extends Component {
  static propTypes = {
    media: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    local: PropTypes.bool,
  };

  static defaultProps = {
    local: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      localVideoSize: 1,
    };

    this.sizes = [ '10%', '20%', '30%', '40%' ];
  }

  changeLocalVideoSize = () => {
    const { local } = this.props;
    if (local) {
      const { localVideoSize } = this.state;
      let newSize = localVideoSize + 1;
      newSize %= this.sizes.length;
      this.setState({ localVideoSize: newSize });
    }
  };

  renderVideo = () => {
    const { media } = this.props;

    return (
      <Video
        key={media.id}
        media={media}
      />
    );
  };

  render() {
    const { local } = this.props;
    const { localVideoSize } = this.state;

    if (local) {
      return (
        <div
          onClick={this.changeLocalVideoSize}
          onKeyPress={() => {}}
          style={{ height: this.sizes[localVideoSize] }}
          className={`${styles.localVideo} ${styles.fullWidth}`}
        >
          {this.renderVideo()}
        </div>
      );
    }

    return (
      <Container fluid className={styles.fullHeight}>
        {this.renderVideo()}
      </Container>
    );
  }
}

export default VideoContainer;
