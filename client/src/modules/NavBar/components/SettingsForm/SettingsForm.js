import React, { Component } from 'react';
import axios from 'axios';
import { AuthConsumer } from 'react-check-auth';
import {
  Modal, Button, Grid, Header, Icon, Container, Dropdown, List,
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

  update = async (formData) => {
    this.setState({ isLoading: true });

    let errors = [];
    try {
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

  UserInfo = userInfo => (
    <Container fluid>
      <Header>
        <List divided verticalAlign='middle'>
          <List.Item>
            <List.Content floated='right'>
              <Button color='orange'>
                <Icon size='small' name='pencil' />
                edit
              </Button>
            </List.Content>
            <Icon size='large' name='user' />
            <List.Content>{` ${userInfo.name}`}</List.Content>
          </List.Item>

          <List.Item>
            <List.Content floated='right'>
              <Button color='orange'>
                <Icon size='small' name='pencil' />
                edit
              </Button>
            </List.Content>
            <Icon size='large' name='mail' />
            <List.Content>{` ${userInfo.email}`}</List.Content>
          </List.Item>
      
          <List.Item>
            <List.Content floated='right'>
              <Button color='orange'>
                <Icon size='small' name='pencil' />
                edit
              </Button>
            </List.Content>
            <Icon size='large' name='lock' />
            <List.Content>Password</List.Content>
          </List.Item>
        </List>
      </Header>
      <Header>
        <Button color='orange' fluid>
          <Icon size='large' name='trash alternate' />
            Delete Account
          </Button>
      </Header>
    </Container>
  );

  render() {
    const {
      isModalOpen,
    } = this.state;


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
                My Profile
              </Header>
                <AuthConsumer>
                  {({ userInfo }) => (userInfo ? this.UserInfo(userInfo) : null)}
                </AuthConsumer>
            </Grid.Column>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}