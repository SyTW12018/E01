import React, { Component } from 'react';
import axios from 'axios';
import { Form } from 'formsy-semantic-ui-react';
import { Message, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import styles from './RoomNameInput.css';
import removeAccents from  'remove-accents'
import { Redirect } from 'react-router'
import { StripChar } from 'stripchar'

export default class RoomNameInput extends Component {
  static propTypes = {
    refreshAuth: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      roomName: '',
      redirect: false,
      isLoading: false,
      errors: [],
    };

    this.form = null;
    this.refreshAuth = props.refreshAuth;
  }
  
  formateo = (str) => {
    str = str.toLowerCase();
    str = str.replace(/ /g,"_");
    str = removeAccents(str);
    str = StripChar.RSExceptUnsAlpNum(str, '_');
    return str;
  }

  handleChange = (e, { name, value }) => {
    let formatedNameRoom = this.formateo(value); 
    this.setState({ roomName: formatedNameRoom })
  }
  
  register = async (formData) => {
    this.setState({ isLoading: true });

    let errors = [];
    try {
      const result = await axios.post(`/rooms/${formData.roomName}`);
      if (result.status === 201 || result.status === 200) {
          this.setState({ redirect: true })
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
      roomName, isLoading, errors,
    } = this.state;

    if(this.state.redirect){
      return (
        <Redirect to={`/room/${this.state.roomName}`} />
      )
    } else {

      return (

        <Grid verticalAlign='middle'>
          <Grid.Column>
            <Form
              warning
              loading={isLoading}
              onValidSubmit={this.register}
              onValid={() => this.setState({ isValid: true })}
              onInvalid={() => this.setState({ isValid: false })}
              ref={(ref) => { this.form = ref; }}
            >
              <Form.Input
                className='hiddenLabel'
                name='roomName'
                size='huge'
                icon='video camera'
                iconPosition='left'
                placeholder='Room Name'
                value={roomName}
                action={{ icon: 'video camera', color: 'orange', className: styles.roomNameInputButton }}
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
          </Grid.Column>
        </Grid>
      );
    }
  }
}