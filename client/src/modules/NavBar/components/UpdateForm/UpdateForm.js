import React, { Component } from 'react';
import axios from 'axios';
import {
  Modal, Button, Message, Grid, Header, Icon, Container, Divider, Dropdown,
} from 'semantic-ui-react';
import { Form } from 'formsy-semantic-ui-react';
import '../Form.css';
import PropTypes from 'prop-types';
import { getAxiosErrors } from '../../../../utils';

class UpdateForm extends Component {
  static propTypes = {
    userInfo: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
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
  }

  update = async (formData) => {
    this.setState({ isLoading: true });
    const { refreshAuth } = this.props;

    let errors = [];
    try {
      const result = await axios.post('/auth/update', {
        user: {
          email: formData.email,
          name: formData.username,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
      });
      if (result.status === 200) {
        refreshAuth();
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
      isModalOpen, errors, isValid, isLoading,
    } = this.state;
    const { userInfo } = this.props;

    return (
      <Modal
        trigger={<Dropdown.Item text='Account' icon='cog' onClick={() => this.setState({ isModalOpen: true })} />}
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
                Your profile
              </Header>

              <Divider />

              <Form
                warning
                size='large'
                loading={isLoading}
                onValidSubmit={this.update}
                onValid={() => this.setState({ isValid: true })}
                onInvalid={() => this.setState({ isValid: false })}
                ref={(ref) => { this.form = ref; }}
              >
                <Form.Input
                  className='hiddenLabel'
                  name='email'
                  value={userInfo.email}
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
                  value={userInfo.name}
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
                  name='currentPassword'
                  fluid
                  required
                  icon='lock'
                  iconPosition='left'
                  placeholder='Current password'
                  type='password'
                />

                <Form.Input
                  className='hiddenLabel'
                  name='newPassword'
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='New password'
                  type='password'
                  validations={{
                    minLength: 5,
                    maxLength: 40,
                  }}
                  errorLabel={<Message warning />}
                  validationErrors={{
                    minLength: 'The password must have a length between 5 and 40',
                    maxLength: 'The password must have a length between 5 and 40',
                  }}
                />

                { errors.length > 0 ? (
                  <Message
                    negative
                    header="Can't update your profile!"
                    list={errors}
                  />
                ) : (null)}

                <Divider />

                <Container fluid>
                  <Button
                    fluid
                    size='large'
                    color='orange'
                    content='Update profile'
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

export default UpdateForm;
