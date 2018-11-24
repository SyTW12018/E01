import React, { Redirect, Component } from 'react';
import { Form, Modal, Button, Menu, Message } from 'semantic-ui-react';

class SignupForm extends Component {
  state = {
    modalOpen: false,
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    nameError: false,
    emailError: false,
    passwordError: false,
    confirmPasswordError: false,
    passwordMatchError: false,
    formError: false,
    createUserError: false
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let error = false;

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

    if (this.state.confirmPassword.length < 8) {
      this.setState({ confirmPasswordError: true });
      error = true;
    } else {
      this.setState({ confirmPasswordError: false });
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
    }

    this.setState({ formError: false });

    //comprueba si el usuario ya existe en la base de datos

    /*const user = { //contiene los valores de las variables para hacer la comprobacion
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password_confirmation: this.state.confirmPassword
    };

    this.props.createUser(user) //comprueba si el campo payload de la respuesta del servidor a la solicitud POST es un error, en lugar del objeto JSON esperado (user)
      .then((res) => {
        if (!res.payload) {
          this.setState({
            createUserError: true
          });
        }
      });*/

    if (this.state.loggedIn) {
      this.setState({ modalOpen: false });
    }
  }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  render() {
    return !this.props.loggedIn ? (
      <Modal
        trigger={this.props.element === 'menuItem' ?
          <Menu.Item onClick={this.handleOpen}>
            Sign Up
          </Menu.Item>
          :
          <Button fluid color="green" className="item" onClick={this.handleOpen}>
            Sign Up
          </Button>
        }
        open={this.state.modalOpen}
        onClose={this.handleClose}
        closeIcon
      >
        <Modal.Header>
          Sign Up
        </Modal.Header>
        <Modal.Content>
          <Form
            onSubmit={(event) => { this.handleSubmit(event); }}
            error={this.state.createUserError || this.state.formError}
          >
            {this.state.createUserError ?
              <Message
                error
                header="Account Already Exists"
                content="An account already exists for this email address, please log in or confirm your email address is correct"
              /> : null
            }
            <Form.Input
              label="User name:"
              name="name"
              value={this.state.name}
              onChange={this.handleInputChange}
              error={this.state.nameError}
            />
            <Form.Input
              label="Email:"
              name="email"
              value={this.state.email}
              onChange={this.handleInputChange}
              error={this.state.emailError}
            />
            <Form.Input
              label="Password:"
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleInputChange}
              error={this.state.passwordError || this.state.passwordMatchError}
            />
            {this.state.passwordError ?
              <Message
                error
                header="Invalid password"
                content="The size must be greater than or equal to 8."
            /> : null
            }
            <Form.Input
              label="Confirm Password:"
              type="password"
              name="confirmPassword"
              value={this.state.confirmPassword}
              onChange={this.handleInputChange}
              error={this.state.confirmPasswordError || this.state.passwordMatchError}
            />
            {this.state.passwordMatchError ?
              <Message
                error
                header="Invalid password"
                content="Passwords no match."
            /> : null
            }
            
            <Form.Button fluid color="green" type="submit" disabled={!this.state.email || !this.state.name || !this.state.password || !this.state.confirmPassword}>
              Create Account
            </Form.Button>
          </Form>
        </Modal.Content>
      </Modal>
    ) : <Redirect to="/" />;
  }
}

export default SignupForm