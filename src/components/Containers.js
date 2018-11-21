import {connect} from 'react-redux';
import Messages from './ui/Messages';
import Current_name from './ui/Current_name';
import Rooms from './ui/Rooms';
import Users from './ui/Users';
import Actions  from './Actions';
import Start_page  from './ui/Start_page';
import Main_page  from './ui/Main_page';

        //контейнеры для подключения компонентов к хранилищу
const messageToProps = (state) => {
    let msg = state.messages.filter(m => m.id_room == state.current_room);
    return{
        active_rooms: state.active_rooms,
        current_room: state.current_room,
        messages: msg
    }
}


export const Rooms_container = connect((state) => ({ //контейнер компонента списка всех комнат
        active_rooms: state.active_rooms,
        current_name: state.current_name,
        all_rooms: state.all_rooms,
        users: state.users,
        current_room: state.current_room
    }))(Rooms);
export const Current_name_container = connect((state) => ({current_name: state.current_name}))(Current_name);//контейнер компонента имени юзера
export const Start_page_container = connect((state) => ({current_name: state.current_name}))(Start_page);//контейнер компонента стартовой страницы с вводом имени
export const Users_container = connect((state) => ({ //контейнер компонента списка пользоваталей
        current_name: state.current_name,
        current_room: state.current_room,
        users: state.users}))(Users);
export const Messages_container = connect(//контейнер компонента сообщений
        messageToProps)(Messages);
export const Main_page_container = connect((state) => ({ //контейнер компонента главной страницы
        current_name: state.current_name,
    }))(Main_page);

