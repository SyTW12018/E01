import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { Form } from 'formsy-semantic-ui-react';
import {
  Modal, Button, Message, Grid, Header, Icon, Container, Divider,
} from 'semantic-ui-react';
import '../Form.css';

class SignUpForm extends Component {
  form = null;

  state = {
    isModalOpen: false,
    isValid: false,
    isLoading: false,
    errors: [],
  };

  register = async (formData) => {
    this.setState({ isLoading: true });
    const { history } = this.props;

    let errors = [];
    try {
      const result = await axios.post('/signup', {
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });
      if (result.status === 200) {
        history.push('/welcome');
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
        trigger={<Button onClick={() => this.setState({ isModalOpen: true })} inverted>Sign up</Button>}
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
                Create a new account
              </Header>

              <Divider />

              <Form
                warning
                size='large'
                loading={isLoading}
                onValidSubmit={this.register}
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
export default withRouter(SignUpForm);