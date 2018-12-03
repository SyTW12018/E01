import React from 'react';
import ReactDOM from 'react-dom';
import Message from './Message.js';


class ChatSection extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chats: [{
                username: "Derecha",
                content: <p>Hello World!</p>,
                img: "http://i.imgur.com/Tj5DGiO.jpg",
            }, {
                username: "Izquierda",
                content: <p>Prueba de chat</p>,
                img: "http://i.imgur.com/Tj5DGiO.jpg",
            }, {
                username: "Derecha",
                content: <p>Mensaje recibido gracias por todo</p>,
                img: "http://i.imgur.com/Tj5DGiO.jpg",
            }, {
                username: "Izquierda",
                content: <p>Lorem ipsum dolor sit amet, nibh ipsum. Cum class sem inceptos incidunt sed sed. Tempus wisi enim id, arcu sed lectus aliquam, nulla vitae est bibendum molestie elit risus.</p>,
                img: "http://i.imgur.com/ARbQZix.jpg",
            }, {
                username: "Derecha",
                content: <p>Esto es un placeholder como una casa</p>,
                img: "http://i.imgur.com/Tj5DGiO.jpg",
            }, {
                username: "Derecha",
                content: <p>Videocon es una aplicacion de videoconferencia para hablar con tus amigos</p>,
                img: "http://i.imgur.com/Tj5DGiO.jpg",
            }, {
                username: "Derecha",
                content: <p>Conectate ahora con nostros!</p>,
                img: "http://i.imgur.com/Tj5DGiO.jpg",
            }, {
                username: "Izquierda",
                content: <p>Magnifica Aplicación!</p>,
                img: "http://i.imgur.com/Tj5DGiO.jpg",
            }]
        };

        this.submitMessage = this.submitMessage.bind(this);
    }

    componentDidMount() {
        this.scrollToBot();
    }

    componentDidUpdate() {
        this.scrollToBot();
    }

    scrollToBot() {
        ReactDOM.findDOMNode(this.refs.chats).scrollTop = ReactDOM.findDOMNode(this.refs.chats).scrollHeight;
    }

    submitMessage(e) {
        e.preventDefault();

        this.setState({
            chats: this.state.chats.concat([{
                username: "Derecha",
                content: <p>{ReactDOM.findDOMNode(this.refs.msg).value}</p>,
                img: "http://i.imgur.com/Tj5DGiO.jpg",
            }])
        }, () => {
            ReactDOM.findDOMNode(this.refs.msg).value = "";
        });
    }

    render() {
        const username = "Derecha";
        const { chats } = this.state;

        return (
            <div className="Chatroom">
                <h3>Chat</h3>
                <div className="ui raised very padded text container segment">
                    <ul className="ui list" ref="chats">
                        {
                            chats.map((chat) =>
                                <Message chat={chat} user={username} />
                            )
                        }
                    </ul>
                    <form className="ui form" onSubmit={(e) => this.submitMessage(e)}>
                        <div className="two fields">
                            <input type="text" ref="msg" />
                            <button type='submit' className='ui compact orange button'>
                                Enviar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default ChatSection;