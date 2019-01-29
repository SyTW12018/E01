import React from 'react';
import {
  Image, List, Message, Container, Segment,
} from 'semantic-ui-react';
import Avatar from 'react-avatar';
import PropTypes from 'prop-types';
import styles from '../../VideoConference.css';

function UsersList(props) {
  const { users } = props;

  return (
    <Container className={`${styles.flexStatic} ${styles.noMinHeight} ${styles.verticalMargin}`}>
      {(() => {
        if (users.length === 0) {
          return (
            <Message info>
              <Message.Header>{'You\'re alone in the room'}</Message.Header>
              <p>Invite more people by giving them the link to the room</p>
            </Message>
          );
        }

        return (
          <Segment>
            <List divided relaxed>
              {users.map((user, i) => {
                let loading;
                let userData;

                try {
                  userData = JSON.parse(user.displayName);
                  loading = false;
                } catch (e) {
                  loading = true;
                }

                return (
                  <List.Item key={i}>
                    <Image avatar>
                      <Avatar name={(loading ? '?' : userData.username)} round size='2.5em' />
                    </Image>
                    <List.Content>
                      <List.Header>
                        {(loading ? '?' : userData.username)}
                      </List.Header>
                      <List.Description>
                        {(() => {
                          if (loading) {
                            return 'Connecting...';
                          }
                          return (user.speaking ? 'Speaking' : 'Connected');
                        })()}
                      </List.Description>
                    </List.Content>
                  </List.Item>
                );
              })}
            </List>
          </Segment>
        );
      })()}
    </Container>
  );
}

UsersList.propTypes = {
  users: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default UsersList;
