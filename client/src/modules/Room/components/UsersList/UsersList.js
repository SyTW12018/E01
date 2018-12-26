import React, { Component } from 'react';
import { List, Segment, Image, Grid } from 'semantic-ui-react'

export default class UsersList extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
            jaja: true,
            users: [
                {
                    avatar: 'https://react.semantic-ui.com/images/avatar/small/daniel.jpg', //imagen de la retransmision de la webcam
                    connState: 'Connecting...',
                    name: 'Juan'
                },
                {
                    avatar: 'https://react.semantic-ui.com/images/avatar/small/christian.jpg', //imagen de la retransmision de la webcam
                    connState: 'Connected',
                    name: 'Pepe'
                },
                {
                    avatar: 'https://react.semantic-ui.com/images/avatar/small/matt.jpg', //imagen de la retransmision de la webcam
                    connState: 'Disconnected',
                    name: 'Lucas'
                }
            ],
        };
    }

    render() {
        return (
            <Grid stackable inverted columns='three' container verticalAlign='middle'>
                <Grid.Column floated='left'>
                    <Segment inverted>
                        <List divided inverted relaxed='very'>
                            {
                                this.state.users.map(user => {
                                    return(
                                        <List.Item>
                                            <Image avatar src={`${user.avatar}`} />
                                        <List.Content>
                                            <List.Header>
                                                {user.name}
                                            </List.Header>
                                            <List.Description>
                                                {user.connState}
                                            </List.Description>
                                        </List.Content>
                                        </List.Item>   
                                    )
                                })
                            }
                        </List>
                    </Segment>
                </Grid.Column>
            </Grid>
        );
    }
}