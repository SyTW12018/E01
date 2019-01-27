import React from 'react';
import {
  Container, Menu, Header, Icon, Dropdown,
} from 'semantic-ui-react';
import { AuthConsumer } from 'react-check-auth';
import Loader from '../Loader/Loader';
import SignUpForm from './components/SignUpForm/SignUpForm';
import LogInForm from './components/LogInForm/LogInForm';
import LogOutButton from './components/LogOutButton/LogOutButton';
import UpdateForm from './components/UpdateForm/UpdateForm';
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
              <UpdateForm refreshAuth={refreshAuth} userInfo={userInfo} />
              <LogOutButton dropdown refreshAuth={refreshAuth} />
            </Dropdown.Menu>
          </Dropdown>
        </Header.Content>
      </Header>
    </Menu.Item>
  </Menu>
);

const render = (props) => {
  const {
    userInfo, isLoading, refreshAuth,
  } = props;

  if (isLoading) {
    return <Loader />;
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
