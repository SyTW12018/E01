import React, { Component } from 'react';
import axios from 'axios';
import { Form } from 'formsy-semantic-ui-react';
import { Message } from 'semantic-ui-react';
import removeAccents from 'remove-accents';
import { Redirect } from 'react-router';
import { StripChar } from 'stripchar';
import styles from './RoomNameInput.css';

export default class RoomNameInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      roomName: '',
      redirect: false,
      isLoading: false,
      errors: [],
    };

    this.form = null;
  }

  formatName = (str) => {
    let name = str;
    name = name.toLowerCase();
    name = name.replace(/ /g, '_');
    name = removeAccents(name);
    name = StripChar.RSExceptUnsAlpNum(name, '_');
    return name;
  };

  handleChange = (e, { value }) => {
    const formattedNameRoom = this.formatName(value);
    this.setState({ roomName: formattedNameRoom });
  };

  joinRoom = async (formData) => {
    this.setState({ isLoading: true });

    let errors = [];
    try {
      const result = await axios.post(`/rooms/${formData.roomName}`);
      if (result.status === 201 || result.status === 200) {
        this.setState({ redirect: true });
        return;
      }
    } catch (e) {
      const responseErrors = e.response.data.errors;
      if (responseErrors && Array.isArray(responseErrors)) {
        errors = responseErrors.map((error) => {
          if (typeof error === 'object') return (error.msg ? error.msg : 'Unknown error');
          return error;
        });
      } else {
        errors = [ e.message ];
      }
    }

    this.setState({
      isLoading: false,
      errors,
    });
  };

  render() {
    const {
      roomName, isLoading, errors, redirect,
    } = this.state;

    if (redirect) {
      return (
        <Redirect to={`/room/${roomName}`} />
      );
    }

    return (
      <Form
        warning
        loading={isLoading}
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
          errorLabel={<Message warning />}
          validationErrors={{
            isAlphanumeric: 'Enter a valid Room Name, without special characters, accent and spaces',
            isDefaultRequiredValue: 'Room Name is required',
          }}
        />

        { errors.length > 0 ? (
          <Message
            negative
            header="Can't create a new room!"
            list={errors}
          />
        ) : (null)}

      </Form>
    );
  }
}
