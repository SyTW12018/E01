import React, { Component } from 'react';
import { Form } from 'formsy-semantic-ui-react';
import { Redirect } from 'react-router';
import styles from './RoomNameInput.css';
import { formatName } from '../../../../../../utils';

export default class RoomNameInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      roomName: '',
      redirect: false,
    };

    this.form = null;
  }

  handleChange = (e, { value }) => {
    const formattedNameRoom = formatName(value);
    this.setState({ roomName: formattedNameRoom });
  };

  joinRoom = async () => {
    const { roomName } = this.state;
    if (roomName.length > 0) this.setState({ redirect: true });
  };

  render() {
    const {
      roomName, redirect,
    } = this.state;

    if (redirect) {
      return (
        <Redirect push to={`/room/${roomName}`} />
      );
    }

    return (
      <Form
        onValidSubmit={this.joinRoom}
        ref={(ref) => { this.form = ref; }}
      >
        <Form.Input
          placeholder='Name of the room'
          action={{ icon: 'video camera', color: 'orange', className: styles.roomNameInputButton }}
          className={styles.roomNameInput}
          size='huge'
          color='orange'
          name='roomName'
          value={roomName}
          onChange={this.handleChange}
        />
      </Form>
    );
  }
}
