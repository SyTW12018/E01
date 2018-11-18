import React from 'react';
import { Input } from 'semantic-ui-react';
import styles from './RoomNameInput.css';

const RoomNameInput = () => (
  <Input
    placeholder='Name of the room'
    action={{ icon: 'video camera', color: 'orange', className: styles.roomNameInputButton }}
    className={styles.roomNameInput}
    size='huge'
    color='orange'
  />
);

export default RoomNameInput;
