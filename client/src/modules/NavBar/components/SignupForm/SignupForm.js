import React, { Component } from "react";
import { Form, Modal, Button, Message } from 'semantic-ui-react';


export default class SignupForm extends Component {
  state = {
    modalOpen: false, //booleano que comprueba si el Modal esta abierto o no
    name: '',
    email: '',
    password: '',
    confirm_Password: '',
    nameError: false,
    emailError: false,
    passwordError: false,
    confirmPasswordError: false,
    passwordMatchError: false,
    formError: false
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  handleSubmit = (e) => {
    e.preventDefault();
    let error = false;

    if (this.state.name === '') {
      this.setState({ nameError: true });
      error = true;
    } else {
      this.setState({ nameError: false });
    }

    if (this.state.email === '') {
      this.setState({ emailError: true });
      error = true;
    } else {
      this.setState({ emailError: false });
    }

    if (this.state.password.length < 8) {
      this.setState({ passwordError: true });
      error = true;
    } else {
      this.setState({ passwordError: false });
    }

    if (this.state.password !== this.state.confirmPassword) {
      this.setState({ passwordMatchError: true });
      error = true;
    } else {
      this.setState({ passwordMatchError: false });
    }

    if (error) {
      this.setState({ formError: true });
      return;
    } else {
      this.setState({ formError: false });
    }

  }

  render() {
    return(
      <Modal
        trigger={<Button onClick={this.handleOpen} inverted style={{ marginLeft: '0.5em' }}>Sign Up</Button>}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        closeIcon={true}
      >
        <Modal.Header>Log Up</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Form error={this.state.formError}>
              <Form.Field >
                <Form.Input required
                  label="User name:"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleChange}
                  error={this.state.nameError}
                />
              </Form.Field>
              <Form.Field >
                <Form.Input required
                  label="Email:"
                  name="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                  error={this.state.emailError}
                />
              </Form.Field>
              <Form.Field >
                <Form.Input required
                  label="Password:"
                  type="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  error={this.state.passwordError || this.state.passwordMatchError}
                />
                {this.state.passwordError ?
                  <Message
                    error
                    header="Invalid password"
                    content="The size must be greater than or equal to 8."
                  /> : null
                }
              </Form.Field>
              <Form.Field >
                <Form.Input required
                  label="Confirm Password:"
                  type="password"
                  name="confirmPassword"
                  value={this.state.confirmPassword}
                  onChange={this.handleChange}
                  error={this.state.confirmPasswordError || this.state.passwordMatchError}
                />
                {this.state.passwordMatchError ?
                  <Message
                    error
                    header="Invalid password"
                    content="Passwords no match."
                /> : null
                }
              </Form.Field>
            </Form>
          </Modal.Description>
        </Modal.Content>

        <Modal.Actions>
          <Button color="green" type="submit" disabled={!this.state.email || !this.state.name || !this.state.password || !this.state.confirmPassword} onClick={this.handleSubmit}>
            Create Account
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

