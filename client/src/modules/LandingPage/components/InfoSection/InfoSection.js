import {
  Header, Icon, Segment, Grid,
} from 'semantic-ui-react';
import React from 'react';

const goToGithub = () => {
  window.location = 'https://github.com/SyTW12018/E01-videocon';
};

export default () => (
  <Segment
    inverted
    style={{ padding: '8em 0em' }}
    vertical
    color='orange'
  >
    <Grid container stackable verticalAlign='middle'>
      <Grid.Column floated='left' width={9}>
        <Header size='huge' inverted>
          What is videocon.io?
        </Header>
        <p style={{ fontSize: '1.33em' }}>
          videocon.io is an open source proyect made by a group of students from the university of La Laguna.
        </p>
        <p style={{ fontSize: '1.33em' }}>
          The main purpose of this application is to make videoconferencing easier and safer, without having to
          install any software or plugin, only with a compatible browser and a webcam.
        </p>
      </Grid.Column>
      <Grid.Column floated='right' width={5} textAlign='right'>
        <Icon link name='github' size='huge' onClick={goToGithub} />
      </Grid.Column>

    </Grid>
  </Segment>
);
