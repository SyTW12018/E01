import React from 'react';
import ReactDOM from 'react-dom';
import Message from './Message.js';
import './Vision.css';

import { Container } from 'semantic-ui-react'

class Vision extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chats: [{
                img: "http://i.imgur.com/Tj5DGiO.jpg",
            }, {
                img: "http://i.imgur.com/Tj5DGiO.jpg",
            }, {
                img: "http://i.imgur.com/Tj5DGiO.jpg",
            }, {
                img: "http://i.imgur.com/ARbQZix.jpg",
            }]
        };

    //Componente responsive y componente grid
    //
    }

    render() {
        const { chats } = this.state;

        return (
            //Cuerpo en Semantic React
            <Container >
            	{chats.map(chat => (
            		<Container fluid> <img src={chat.img}><Container/>
            	))}
            <Container/>
        );
    }
}

export default Vision;