import React, {Component} from 'react';

//компонент для отображения списка пользователей
class Users extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let users = null;
        if (this.props.users && this.props.users.lentgh != 0)
            users = this.props.users.map(user => { //вывод списка пользователей, функции создания комнаты с поль-ми и инвайта по клику
                if (user.name == this.props.current_name)
                    return(<div className="user_row">
                 <div className="current_user" title="Click to join chat" onClick={() => alert("you can't open a chat with yourself")}>{user.name}</div>
    <div className="Button" title="Send link of current room to this user" onClick={() =>alert("you can't invite yourself")}>{'\u2192'}</div>   
               </div>)
                else 
                return(<div className="user_row">
    <div className="user" title="Click to join chat" onClick={() => this.props.chatApp.openChatAndInvite({from: this.props.current_name, to: user.name, type: "user"})}>{user.name}</div>
    <div className="Button" title="Send link of current room to this user" onClick={() => this.props.chatApp.openChatAndInvite({from: this.props.current_name, to: user.name, type: "user", invite_to: this.props.current_room})}>{'\u2192'}</div> 
</div>)
                    })
                return (
                        <div className="Users">
                            <div className="Header">Users</div>
                            <div className="Info">{users}</div>
                        </div>
                        )
            }
        }

        export default Users;