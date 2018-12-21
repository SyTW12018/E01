import React, { Component } from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { withCookies } from 'react-cookie';
import PropTypes from 'prop-types';

class LogOutButton extends Component {
  static propTypes = {
    refreshAuth: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.cookies = props.cookies;
    this.refreshAuth = props.refreshAuth;
  }

  logOut = async () => {
    await this.cookies.remove('authToken');
    this.refreshAuth();
  };

  render() {
    return (
      <Button mini icon onClick={() => this.logOut()}>
        <Icon name='sign out' />
      </Button>
    );
  }
}

export default withCookies(LogOutButton);
