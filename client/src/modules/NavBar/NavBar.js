import {
  Container, Menu, Header, Loader, Dimmer, Icon, Dropdown,
} from 'semantic-ui-react';
import React from 'react';
import { AuthConsumer } from 'react-check-auth';
import SignUpForm from './components/SignUpForm/SignUpForm';
import LogInForm from './components/LogInForm/LogInForm';
import LogOutButton from './components/LogOutButton/LogOutButton';
import SettingsForm from './components/SettingsForm/SettingsForm';
import './NavBar.css';


const NotLogged = refreshAuth => (
  <Menu
    size='large'
    secondary
  >
    <Menu.Item position='right'>
      <LogInForm refreshAuth={refreshAuth} />
    </Menu.Item>

    <Menu.Item>
      <SignUpForm refreshAuth={refreshAuth} />
    </Menu.Item>
  </Menu>
);

const Logged = (userInfo, refreshAuth) => (
  <Menu
    size='large'
    secondary
    inverted
  >

    <Menu.Item position='right'>
      <Header inverted size='small'>
        <Icon name='user circle' />
        <Header.Content>
          <Dropdown simple text={userInfo.name}>
            <Dropdown.Menu>
              <SettingsForm refreshAuth={refreshAuth} />
              <LogOutButton dropdown refreshAuth={refreshAuth} />
            </Dropdown.Menu>
          </Dropdown>
        </Header.Content>
      </Header>
    </Menu.Item>
  </Menu>
);

const Loading = () => (
  <Dimmer active>
    <Loader size='massive' />
  </Dimmer>
);

const render = (props) => {
  const {
    userInfo, isLoading, refreshAuth,
  } = props;

  if (isLoading) {
    return Loading();
  }

  if (userInfo && userInfo.role && userInfo.role !== 'temporalUser') {
    return Logged(userInfo, refreshAuth);
  }

  return NotLogged(refreshAuth);
};

export default () => (
  <Container>
    <AuthConsumer>
      {render}
    </AuthConsumer>
  </Container>
);
