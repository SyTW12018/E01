import { ParallaxBanner, ParallaxProvider } from 'react-scroll-parallax';
import {
  Header, Segment, Grid, Label, Icon,
} from 'semantic-ui-react';
import React from 'react';
import NavBar from '../../../NavBar/NavBar';
import RoomNameInput from './components/RoomNameInput/RoomNameInput';
import BgImage from './header.jpg';
import styles from './HeaderSection.css';

export default () => (
  <ParallaxProvider>

    <ParallaxBanner
      layers={[
        {
          image: BgImage,
          amount: 0.1,
          slowerScrollRate: false,
        },
      ]}
      className={styles.fullWidth}
    >

      <Segment
        vertical
        transparent='true'
        style={{
          height: '100%',
        }}
      >

        <NavBar />

        <Grid
          centered
          verticalAlign='middle'
          style={{
            height: '100%',
          }}
        >

          <Grid.Row className={styles.headerContainer}>
            <Grid.Column textAlign='center'>

              <Grid
                centered
              >
                <Grid.Row className={styles.header}>
                  <Header
                    color='orange'
                  >
                    <Icon name='weixin' />
                    videocon.io
                  </Header>
                </Grid.Row>

                <Grid.Row>
                  <Label color='orange' size='large' className={styles.subHeader}>
                    Really simple video chat for groups
                  </Label>
                </Grid.Row>

                <Grid.Row>
                  <RoomNameInput />
                </Grid.Row>

              </Grid>

            </Grid.Column>
          </Grid.Row>
        </Grid>

      </Segment>
    </ParallaxBanner>
  </ParallaxProvider>
);
