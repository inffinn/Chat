import React, {Component} from 'react';
import {
Main_page_container,
        Start_page_container,
        Users_container,
        Current_name_container,
        Messages_container,
        Rooms_container} from '../Containers';
//компонент проверяет заполнен ли ник и пускает в чат, позволяет подключиться к  комнате из адресной строки браузера
const queryString = require('query-string');
const Main_page = (props) => {
    if (!props.current_name) {
        return (<Start_page_container chatApp={props.chatApp} location={props.location} history={props.history}/>)
    } else {
        let rooms = queryString.parse(location.search).rooms;
        props.chatApp.changeRoom(rooms);

        return (<div className="Page">    
            <div className="Head"> Chat </div>
            <div className="Body">
                <div className="left_container">
                    <Current_name_container chatApp={props.chatApp}/>
                    <Users_container   chatApp={props.chatApp}/>
                    <Rooms_container   chatApp={props.chatApp}/>
                </div>
                <div className="right_container">
                    <Messages_container chatApp={props.chatApp}/>
                </div>
            </div>
        </div>
                )
    }
}
export default Main_page;


