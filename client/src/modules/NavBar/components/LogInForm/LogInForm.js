import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Form } from 'formsy-semantic-ui-react';
import {
  Modal, Button, Message, Grid, Header, Icon, Container, Divider,
} from 'semantic-ui-react';
import '../Form.css';
import { getAxiosErrors } from '../../../../utils';

export default class LogInForm extends Component {
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

  login = async (formData) => {
    this.setState({ isLoading: true });

    let errors = [];
    try {
      const result = await axios.post('/auth/login', {
        user: {
          email: formData.email,
          password: formData.password,
        },
      });
      if (result.status === 200) {
        this.refreshAuth();
        return;
      }
    } catch (e) {
      errors = getAxiosErrors(e);
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
