import React, { Component } from 'react';
import { UserControls as SWRTCUserControls } from '@andyet/simplewebrtc';
import PropTypes from 'prop-types';
import { Header, Button, Segment } from 'semantic-ui-react';
import { Redirect } from 'react-router';
import styles from '../../VideoConference.css';

class UserControls extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    cuid: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    invisible: PropTypes.bool,
  };

  static defaultProps = {
    invisible: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      goBack: false,
    };

    this.userData = JSON.stringify({ cuid: props.cuid, username: props.username });
  }

  setUserInfo = () => {
    if (this.user && this.setDisplayName && this.user.displayName !== this.userData) {
      this.setDisplayName(this.userData);
    }
  };

  render() {
    const { store, username, invisible } = this.props;
    const { goBack } = this.state;

    if (goBack) {
      return (
        <Redirect to='/' />
      );
    }

    if (invisible) {
      return (
        <SWRTCUserControls
          render={({
            user, setDisplayName,
          }) => {
            this.user = user;
            this.setDisplayName = setDisplayName;
            window.setTimeout(this.setUserInfo, 1000);
            return null;
          }}
          store={store}
        />
      );
    }

    return (
      <Segment.Group className={styles.userControls}>
        <Segment inverted color='orange' textAlign='center'>
          <Header inverted size='medium'>
            <Header.Content>
              {'Logged as:'}
              <Header.Subheader>{username}</Header.Subheader>
            </Header.Content>
          </Header>
        </Segment>
        <Segment textAlign='center'>

          <SWRTCUserControls
            render={({
              user, isMuted, mute, unmute, setDisplayName,
            }) => {
              this.user = user;
              this.setDisplayName = setDisplayName;
              window.setTimeout(this.setUserInfo, 1000);
              return (
                <Button.Group color='orange' fluid>
                  <Button
                    onClick={() => (isMuted ? unmute() : mute())}
                    icon={isMuted ? 'microphone slash' : 'microphone'}
                  />
                  <Button
                    onClick={() => { window.location.reload(false); }}
                    icon='redo'
                  />
                  <Button
                    onClick={() => { this.setState({ goBack: true }); }}
                    icon='sign-out'
                  />
                </Button.Group>
              );
            }}
            store={store}
          />
        </Segment>
      </Segment.Group>
    );
  }
}

export default UserControls;
