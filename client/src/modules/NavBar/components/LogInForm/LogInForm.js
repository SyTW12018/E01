import React, { Component } from 'react';
import axios from 'axios';
import { Form } from 'formsy-semantic-ui-react';
import {
  Modal, Button, Message, Grid, Header, Icon, Container, Divider,
} from 'semantic-ui-react';
import '../Form.css';

export default class LogInForm extends Component {
  form = null;

  state = {
    isModalOpen: false,
    isValid: false,
    isLoading: false,
    errors: [],
  };

  login = async (formData) => {
    this.setState({ isLoading: true });

    let errors = [];
    try {
      const result = await axios.post('/login', {
        email: formData.email,
        password: formData.password,
      });
      if (result.status === 200) {
        window.location.reload();
      } else {
        errors = result.data.errors ? result.data.errors : [ 'Unknown error' ];
      }
    } catch (e) {
      errors.push(e.message);
    }

    this.setState({
      isLoading: false,
      errors,
    });
  };

  submit = () => { this.form.submit(); };

  render() {
    const {
      isModalOpen, isValid, isLoading, errors,
    } = this.state;

    return (
      <Modal
        trigger={<Button onClick={() => this.setState({ isModalOpen: true })} inverted>Log in</Button>}
        open={isModalOpen}
        onClose={() => this.setState({ isModalOpen: false, errors: [] })}
        size='tiny'
        closeIcon
      >
        <Modal.Content>
          <Grid verticalAlign='middle'>
            <Grid.Column>
              <Header textAlign='center' size='large'>
                <Icon name='weixin' />
                  Log In
              </Header>

              <Divider />

              <Form
                warning
                size='large'
                loading={isLoading}
                onValidSubmit={this.login}
                onValid={() => this.setState({ isValid: true })}
                onInvalid={() => this.setState({ isValid: false })}
                ref={(ref) => { this.form = ref; }}
              >
                <Form.Input
                  className='hiddenLabel'
                  name='email'
                  fluid
                  required
                  icon='at'
                  iconPosition='left'
                  placeholder='E-mail address'
                  validations='isEmail'
                  errorLabel={<Message warning />}
                  validationErrors={{
                    isEmail: 'Enter a valid e-mail',
                    isDefaultRequiredValue: 'E-mail is required',
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
                  errorLabel={<Message warning />}
                  validationErrors={{
                    isDefaultRequiredValue: 'Password is required',
                  }}
                />

                { errors.length > 0 ? (
                  <Message
                    negative
                    header="Can't log in!"
                    list={errors}
                  />
                ) : (null)}

                <Divider />

                <Container fluid>
                  <Button
                    fluid
                    size='large'
                    color='orange'
                    content='Login'
                    onClick={this.submit}
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