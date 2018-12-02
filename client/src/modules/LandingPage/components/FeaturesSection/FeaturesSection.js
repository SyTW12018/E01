import {
  Header, Segment, Grid, Icon,
} from 'semantic-ui-react';
import React from 'react';

export default () => (
  <Segment
    inverted
    vertical
    style={{ padding: '5em 0em' }}
  >

    <Grid
      container
      divided='vertically'
      inverted
      stackable
      columns={3}
      textAlign='center'
    >
      <Grid.Row>
        <Header inverted size='huge'>
            Features
        </Header>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Icon size='huge' color='orange' name='shield' />
          <Header inverted size='large' content='SECURE' />
          <p style={{ fontSize: '1.2em' }}>
            {"videocon.io encrypts all connections and doesn't record any information"}
          </p>
        </Grid.Column>
        <Grid.Column>
          <Icon size='huge' color='orange' name='code' />
          <Header inverted size='large' content='OPEN SOURCE' />
          <p style={{ fontSize: '1.2em' }}>
            It is open source and therefore it is very transparent and in continuous improvement
          </p>
        </Grid.Column>
        <Grid.Column>
          <Icon size='huge' color='orange' name='thumbs up' />
          <Header inverted size='large' content='SIMPLE' />
          <p style={{ fontSize: '1.2em' }}>
            Start or join a video conference without registration, in a matter of seconds
          </p>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Segment>
);
