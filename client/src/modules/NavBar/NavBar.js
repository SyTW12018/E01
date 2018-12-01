import { Container, Menu } from 'semantic-ui-react';
import React from 'react';
import SignUpForm from './components/SignUpForm/SignUpForm';
import LogInForm from './components/LogInForm/LogInForm';

export default () => (
  <Container>
    <Menu
      size='large'
      inverted
      pointing
      secondary
    >

      <Menu.Item position='right'>
        <LogInForm />
      </Menu.Item>

      <Menu.Item>
        <SignUpForm />
      </Menu.Item>
    </Menu>
  </Container>
);
