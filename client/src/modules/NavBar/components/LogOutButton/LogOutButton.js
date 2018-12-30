import React, { Component } from 'react';
import { Button, Icon, Dropdown } from 'semantic-ui-react';
import { withCookies } from 'react-cookie';
import PropTypes from 'prop-types';

class LogOutButton extends Component {
  static propTypes = {
    refreshAuth: PropTypes.func.isRequired,
    dropdown: PropTypes.bool,
  };

  static defaultProps = {
    dropdown: false,
  };

  constructor(props) {
    super(props);

    this.cookies = props.cookies;
    this.refreshAuth = props.refreshAuth;

    this.state = {
      dropdown: props.dropdown,
    };
  }

  logOut = async () => {
    await this.cookies.remove('authToken');
    this.refreshAuth();
  };

  render() {
    const { dropdown } = this.state;

    if (dropdown) {
      return (
        <Dropdown.Item icon='sign out' text='Sign out' onClick={() => this.logOut()} />
      );
    }

    return (
      <Button icon labelPosition='right' onClick={() => this.logOut()}>
        Sign out
        <Icon name='sign out' />
      </Button>
    );
  }
}

export default withCookies(LogOutButton);
