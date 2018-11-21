import consts from '../constants';
const Actions = { //экшены
    roomsUpdate: (data) => ({type: consts.type.all_rooms, rooms: data}), //обновления всех комнат
    usersUpdate: (data) => ({type: consts.type.users, users: data}), //обновления всех юезров
    active_rooms: (data) => ({type: consts.type.active_rooms, active_rooms: data}), //обновление комнат, к которым подключен поль-ль
    current_room: (data) => ({type: consts.type.current_room, current_room: data}),//изменение текущей комнаты
    current_name: (data) => ({type: consts.type.current_name, current_name: data}),//изменение текущего имени
    messages: (data) => ({type: consts.type.messages, message: data}),//добавление сообщения
    increment_message_count: (id_room) => ({type: consts.type.increment_message_count, id_room}),//икремент кол-во сообщений у подключенных комнатах
    reset_message_count: (id_room) => ({type: consts.type.reset_message_count, id_room}) //обнуление кол-во сообщений у подключенных комнатах
}

export default Actions;
