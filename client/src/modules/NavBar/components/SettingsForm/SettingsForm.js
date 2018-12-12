import React, { Component } from 'react';
import axios from 'axios';
import { Form } from 'formsy-semantic-ui-react';
import {
  Modal, Button, Message, Grid, Header, Icon, Container, Divider,
} from 'semantic-ui-react';
import '../Form.css';
import PropTypes from 'prop-types';

export default class SettingsForm extends Component {
  static propTypes = {
    refreshAuth: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      isValid: false,
      isLoading: false,
      errors: [],
    };

    this.form = null;
    this.refreshAuth = props.refreshAuth;
  }
///Esta es a la función que se llamará cuando se le de a submit
  update = async (formData) => {
    this.setState({ isLoading: true });

    let errors = [];
    try {
   ///   const result = await axios.get(///petición a la base de datos o al backend'/signup', {
        ///Auí formaría la estructura del dato recibido para luego mostrarlo
        const result = await axios.post('/signup', {
            user: {
              email: formData.email,
              name: formData.username,
              password: formData.password,
            },
          });
          if (result.status === 201) {
            this.refreshAuth();
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
      isModalOpen, isValid, isLoading, errors,
    } = this.state;

    return (
      <Modal
        trigger={<Button onClick={() => this.setState({ isModalOpen: true })} inverted>Settings</Button>}
        open={isModalOpen}
        onClose={() => this.setState({ isModalOpen: false, errors: [] })}
        size='tiny'
        closeIcon
      >

        <Modal.Content>
          <Grid verticalAlign='middle'>
            <Grid.Column>
              <Header textAlign='center' size='large'>
                <Icon name='user icon' />
                My Profile
              </Header>

              <Divider />

              <Form
                warning
                size='large'
                loading={isLoading}
                ///siguiente línea a meditarla probablemente cambiar .register a .update
                onValidSubmit={this.update}
                onValid={() => this.setState({ isValid: true })}
                onInvalid={() => this.setState({ isValid: false })}
                ref={(ref) => { this.form = ref; }}
              >
                <Form.Input disabled
                  className='hiddenLabel'
                  name='email'
                  fluid
                  required
                  icon='at'
                  iconPosition='left'
                  placeholder='Aquí iría el email recibido de algún lado'

                />

                <Form.Input
                  className='hiddenLabel'
                  name='username'
                  fluid
                  required
                  icon='user'
                  iconPosition='left'
                  placeholder='Username'
                  validations={{
                    isAlphanumeric: true,
                    minLength: 3,
                    maxLength: 25,
                  }}
                  errorLabel={<Message warning />}
                  validationErrors={{
                    isAlphanumeric: 'Enter a valid username',
                    minLength: 'The username must have a length between 3 and 25',
                    maxLength: 'The username must have a length between 3 and 25',
                    isDefaultRequiredValue: 'Username is required',
                  }}
                />

                <Form.Input
                  className='hiddenLabel'
                  name='password'
                  fluid
                  required
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  type='password'
                  validations={{
                    minLength: 5,
                    maxLength: 40,
                  }}
                  errorLabel={<Message warning />}
                  validationErrors={{
                    minLength: 'The password must have a length between 5 and 40',
                    maxLength: 'The password must have a length between 5 and 40',
                    isDefaultRequiredValue: 'Password is required',
                  }}
                />

                <Form.Input
                  className='hiddenLabel'
                  name='passwordRepeat'
                  fluid
                  required
                  icon='lock'
                  iconPosition='left'
                  placeholder='Repeat password'
                  type='password'
                  validations='equalsField:password'
                  errorLabel={<Message warning />}
                  validationErrors={{
                    isDefaultRequiredValue: 'Password is required',
                    equalsField: 'Passwords doesn\'t match',
                  }}
                />

                { errors.length > 0 ? (
                  <Message
                    negative
                    header="Can't create a new account!"
                    list={errors}
                  />
                ) : (null)}

                <Divider />

                <Container fluid>
                  <Button
                    fluid
                    size='large'
                    color='orange'
                    content='Register'
                    disabled={!isValid || isLoading}
                  />
                </Container>

              </Form>

            </Grid.Column>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}