import React, {Component} from 'react';
import { Link } from 'react-router-dom'

        //компонент отображает подключенные комнаты и сообщения
        class Messages extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        let fn = this.send; // перехватывает событие кливи энтер и отправляет сообщение
        let this_ = this;
        this.refs.input.addEventListener("keyup", function (event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                fn.apply(this_);
            }
        })
    }
    send() {
        let txt = this.refs.input.value;
        if (txt && txt != '')
            this.props.chatApp.sendMessage(this.props.current_room, txt)
        this.refs.input.value = '';
    }
    render() {
        let messages = null;
        let active_rooms = null;
        if (this.props.active_rooms && this.props.active_rooms.lentgh != 0)
            active_rooms = this.props.active_rooms.map(room => {
                let classname = "active_rooms";
                if (room.id_room == this.props.current_room)
                    classname = 'current_room';
                return(
                        <div className={classname} >
                            <div className="container">
                                <div className="active_room" onClick={() => {

                                this.props.chatApp.changeActiveRoom(room.id_room)
                                                                                 } }>
                                    <div className="name_room"> {room.name_room}</div>
                                    <div className="count"> ({room.count})</div>
                                </div>
                                <div className="close_room" onClick={() => {
                                    this.props.chatApp.leaveRoom(room.id_room)
                                    this.props.chatApp.changeActiveRoom(this.props.active_rooms[0].id_room)

                                                                                 }
                                     }>x</div>
                            </div>
                        </div>
                                )
            });
        if (this.props.messages && this.props.messages.length != 0)
            messages = this.props.messages.map(m => {
                if (m.type == 'invite')
                    return <div className="msg">{`${m.date} ${m.name}:`}
                        <div className="link" onClick={
                                            () => this.props.chatApp.changeRoom(m.link)
                                                                }>{m.text}</div></div>
                else
                    return (<div className="msg">{
                                                `${m.date} ${m.name}: ${m.text}`}
                </div>)
            })
        return (<div className="Messages">
            <div className="Header">Messages</div>
            <div className="active_rooms_panel">{active_rooms}</div>
            <div className="Info">{messages}</div>
            <div className="input_panel">
                <div><input placeholder="Enter message" ref="input"/></div>
                <div><div className="Button" onClick={() => this.send()}>send</div></div>
            </div>
        </div>)
    }
}


export default Messages;