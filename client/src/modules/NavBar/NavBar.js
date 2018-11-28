import { Container, Menu } from 'semantic-ui-react';
import React from 'react';
import LogUp from './components/SignupForm/SignupForm'
import LogIn from './components/SigninForm/SigninForm'

export default () => (
  <Menu
    size='large'
    inverted
    pointing
    secondary
  >
    <Container>
      <Menu.Item position='right'>
        
        <LogIn />
        
        <LogUp />

      </Menu.Item>
    </Container>
  </Menu>
);
