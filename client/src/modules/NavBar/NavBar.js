import { Button, Container, Menu } from 'semantic-ui-react';
import React from 'react';
import LogUp from './SignupForm/SignupForm'

export default () => (
  <Menu
    size='large'
    inverted
    pointing
    secondary
  >
    <Container>
      <Menu.Item position='right'>
        <Button as='a' inverted>
          Log in
        </Button>
        
        <LogUp />
        
      </Menu.Item>
    </Container>
  </Menu>
);
