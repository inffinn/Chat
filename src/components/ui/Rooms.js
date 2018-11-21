import React, {Component}
from 'react';
import { Link }
from 'react-router-dom'

        //компонент отображает список всех комнат, юзеров в них и их количество
        class Rooms extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() { //перехватывает событие кливи энтер и отправляет сообщение
        let fn = this.create_room;
        let this_ = this;
        this.refs.input.addEventListener("keyup", function (event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                fn.apply(this_);
            }
        })
    }
    create_room() { // с помощью chatApp создание комнаты
        let room = this.refs.input.value;
        this.props.chatApp.changeRoom(room, room);
        this.refs.input.value = '';
    }

    hide_rooms(e) { //сворачивает/разворачивает комнаты
        let val = e.target.innerText;
        let display;
        val == '-' ? display = 'none' : display = 'block';
        val == '-' ? e.target.innerText = '+' : e.target.innerText = '-';
        let users = document.getElementsByClassName('users');
        if (users && users.length != 0)
            for (let i = 0; i < users.length; i++)
                users[i].style.display = display;
    }

    render() {
        let all_rooms = null;
        if (this.props.all_rooms && Object.keys(this.props.all_rooms).lentgh != 0)
            all_rooms = this.props.all_rooms.map(row => { //отображение дерева комнат, функции подключения к комнатам и отправки инвайта по клику
                let className = 'room_row';
                return(<div className='row'>
                    <div className={className}>
                        <div className="room" title="Click to join chat" onClick={() => this.props.chatApp.openChatAndInvite({from: this.props.current_name, to: row.id_room, type: "room"})}>{row.name_room}</div> 
                        <div className="room_count"> ({row.users.length}) </div>                         
                
                        <div className="Button" title="Send link of current room to this room" onClick={() => this.props.chatApp.openChatAndInvite({from: this.props.current_name, to: row.id_room, type: "room", invite_to: this.props.current_room})}>{'\u2192'}</div>                    
                    </div> 
                    <div className='users'>
                        {//список юзеров в комнатах , функции создания комнат с пользователями и отправки инвайта по клику
                                                    row.users.map(name => {
                                                        if (name == this.props.current_name)
                                                            return(<div className="user_row">
                                                                <div className="current_user" title="Click to join chat" onClick={() => alert("you can't open a chat with yourself")}>{name}</div>
                                                                <div className="Button" title="Send link of current room to this user" onClick={() => alert("you can't invite yourself")}>{'\u2192'}</div>   
                                                            </div>)
                                                        else
                                                            return (<div className="user_row"> 
                                                                <div className="user" title="Click to join chat" onClick={() => this.props.chatApp.openChatAndInvite({from: this.props.current_name, to: name, type: "user"})}>{name}</div>
                                                                <div className="Button" title="Send link of current room to this user"  onClick={() => this.props.chatApp.openChatAndInvite({from: this.props.current_name, to: name, type: "user", invite_to: this.props.current_room})}>{'\u2192'}</div> 
                                                            </div>
                                                                            )
                        })
                        }
                    </div></div>)
                            })
                        return (
                                <div className="Rooms">
                                    <div className="Header">
                                        <div className='rooms'>Rooms</div>
                                        <div className='Button' onClick={(e) => this.hide_rooms(e)}>-</div>
                                    </div>
                                    <div className="Info">{all_rooms}</div>
                                    <div className="input_panel">
                                        <div><input  placeholder="Enter room name" ref="input"/>
                                        </div>
                                        <div><div className="Button" onClick={() => this.create_room()}>create room</div></div>
                                    </div>
                                </div>
                                )
                    }
                }

                export default Rooms;