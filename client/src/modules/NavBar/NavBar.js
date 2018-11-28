import { Button, Container, Menu } from 'semantic-ui-react';
import React from 'react';

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
        <Button as='a' inverted style={{ marginLeft: '0.5em' }}>
          Sign Up
        </Button>
      </Menu.Item>
    </Container>
  </Menu>
);
