import React, { Component } from 'react';
import { Form, Modal, Button, Message } from 'semantic-ui-react';

export default class SigninForm extends Component {
    state = {
        name: '',
        password: '',
        loginError: false,
        nameError: false,
        passwordError: false,
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
    
        if (this.state.password === '') {
            this.setState({ passwordError: true });
            error = true;
        } else {
            this.setState({ passwordError: false });
        }
    
        if (error) {
            this.setState({ formError: true });
            return;
        }else {
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
            <Modal.Header>Log In</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Form error={this.state.formError}>
                  <Form.Field >
                    <Form.Input
                      label="User name:"
                      name="name"
                      value={this.state.name}
                      onChange={this.handleChange}
                      error={this.state.nameError}
                    />
                    {this.state.nameError ?
                      <Message
                        error
                        header="Invalid User name"
                        content="****comprobar que el usuario este en la bbdd****."
                      /> : null
                    }
                  </Form.Field>
                  <Form.Field >
                    <Form.Input
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
                        content="****comprobar que la contraseña sea la misma que la de la bbdd****."
                      /> : null
                    }
                  </Form.Field>
                </Form>
              </Modal.Description>
            </Modal.Content>
    
            <Modal.Actions>
              <Button color="blue" type="submit" disabled={!this.state.name || !this.state.password} onClick={this.handleSubmit}>
                Log In
              </Button>
            </Modal.Actions>
          </Modal>
        )
    }
}