import React from 'react';
import ReactDOM from 'react-dom';
import Message from './Message.js';
import './Vision.css';

import { Container } from 'semantic-ui-react'
import { Grid, Divider, Image } from 'semantic-ui-react'

class Vision extends React.Component {
    constructor(props) {
        super(props);

        this.sizes =['tiny','small','medium','large'];

        this.state = {
            chats: [{
                img: "http://i.imgur.com/Tj5DGiO.jpg",
            }, {
                img: "http://i.imgur.com/Tj5DGiO.jpg",
            }, {
                img: "http://i.imgur.com/Tj5DGiO.jpg",
            }, {
                img: "http://i.imgur.com/Tj5DGiO.jpg",
            }],

            mine: [{
                img:"https://i.imgur.com/cjjO9Kt.jpg"
            }],
            size: 0

        };

    //Componente responsive y componente grid
    //
    }

    changeUserCamSize = (e) => {
        console.log("EYYY1")
        let { size } = this.state;
        let newSize = size+1;
        newSize=newSize%this.sizes.length;

        this.setState({ size: newSize });
        console.log("EYYYY")
    }





    render() {
        const { chats, mine, size } = this.state;


        return (
            <Container>
                {mine.map((min) => (<Image id="mine_cam" src={min.img} size={this.sizes[size]} onClick={this.changeUserCamSize} />))}
                <Grid divided>
                    <Grid.Row>
                        <Grid.Column>
                	       {chats.map((chat) => (<img src={chat.img} />))}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        );
    }
}

export default Vision;