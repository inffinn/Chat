        import consts from '../constants.js'



    export const      current_room = (state = '', action) => //редюсер текущий комнаты
        {
            if (action.type == consts.type.current_room) {
                return   action.current_room
            }
            return state
        }

  export const current_name = (state = '', action) => //редюсер имени юзера
        {
            if (action.type == consts.type.current_name) {
             return  action.current_name;
            }
            return state
        }
export const messages= (state = [], action) => //редюсер сообщений
        {
            if (action.type == consts.type.messages) {
             return   Object.assign([],[action.message,...state])
            }
            return state
        }
export const all_rooms=(state = [], action) => //редюсер всех комнат
        {
            if (action.type == consts.type.all_rooms) {
             return   Object.assign([], action.rooms)
            }
            return state
        }
export const users=(state = [], action) => //редюсер всех юзеров
        {
            if (action.type == consts.type.users) {
             return   Object.assign([], action.users)
            }
            return state
        }
export const active_rooms=(state = [], action) => //редюсер всех комнат, к которым подключен юзер
        {
            if (action.type == consts.type.active_rooms) {
             return   Object.assign([], action.active_rooms)
            }
             if (action.type == consts.type.increment_message_count) { // редюсеринкремент кол-ва сообщений в комнате
                 let active_rooms=state.map(room=>{
                     if (room.id_room==action.id_room)
                         room.count++;
                     return room
                 })  
             return   Object.assign([], active_rooms)
         }
                  if (action.type == consts.type.reset_message_count) { // редюсер сброс кол-во сообщений в комнате
                 let active_rooms=state.map(room=>{
                     if (room.id_room==action.id_room)
                         room.count=0;
                     return room
                 });
             return   Object.assign([], active_rooms)
            }
            return state
        }
