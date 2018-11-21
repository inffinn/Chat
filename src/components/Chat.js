import Actions from './Actions';
const queryString = require('query-string');

//ядро чата
class Chat {
    constructor(socket, store, window) {
        this.socket = socket;//присвоение сокета
        this.store = store;//хранилища
        this.history = window.history;// для изменения адресной строки во время смена текущей комнаты
        this.current_name = "Guest"; //имя текущего пользователя
        this.current_room = "Lobby";//ид текущей комнаты
        this.wait_invited_user = null;//переменная, служащая в качестве фильтра сообщений для ожидания присоединения пользователя
        socket.on('roomsUpdate', (msg) => { //обработчик события обновления все комнат и юзеров, добавление данных в хранилище
            store.dispatch(Actions.roomsUpdate(msg.rooms));
            store.dispatch(Actions.usersUpdate(msg.users));
            this.active_rooms(msg.rooms, store);
        });
        socket.on('joinInvite', (msg) => { //получение уведомленя о том, что пользователя зовут на диалог
            if (this.current_name == msg.name)
                this.changeRoom(msg.id_room) //присоединение в указанную комнату
        });
        socket.on('alert', (msg) => { //вывод сообщений о ошибках
            alert(msg.text)
        });
        //получение уведомления о создании комнаты для диалога с юзером и использование 
        //wait_invited_user переменной для фильтра сообщений, для отслеживание сообщения о входе юзера в комнату, для дальнейшего размещения сообщения со ссылкой на другую комнату
        socket.on('invite', (msg) => { 
            if (msg.invite_to)//
                this.wait_invited_user = {name: msg.name, id_room: msg.id_room, invite_to: msg.invite_to};

        });
        
        
        socket.on('message', (msg) => {//обработчик сообщений,
            if (this.wait_invited_user)
                 // фильтр сообщения на присоедние пользователя к чату
                if ((msg.name == this.wait_invited_user.name) && (msg.id_room == this.wait_invited_user.id_room))
                {//если юзер зашел в комнату, то отправка сообщения со ссылкой на инвайт
                    this.sendMessage(
                            this.wait_invited_user.id_room,
                            '/Chat?rooms=' + this.wait_invited_user.invite_to,
                            'invite', this.wait_invited_user.invite_to
                            );
                    this.wait_invited_user = null;
                }
            store.dispatch(Actions.messages(msg)) //добавление сообщений в хранилище
            if (this.current_room != msg.id_room)
                this.increment_message_count(msg.id_room);
        });
        socket.on('changeRoom', (msg) => {//обработчик события смены комнаты
            this.current_room = msg.id_room; //задание текущей комнаты
            store.dispatch(Actions.current_room(msg.id_room))//изменение в хранилище
            this.history.pushState({}, '', '/Chat?rooms=' + msg.id_room)//изменение адресной строки 
        });
        socket.on('changeName', (msg) => { //обработчик события смены имени
            this.current_name = msg.name;
            store.dispatch(Actions.current_name(msg.name));
        });

    }
    openChatAndInvite(data)//присоединение к комнате или открытие диалога с юизером
    {
        if (data.type == 'room') {
            this.changeRoom(data.to); //присоединение к комнате
            if (data.invite_to) //если выбрано размещение ссылки
                this.sendMessage(data.to, '/Chat?rooms=' + data.invite_to, 'invite', data.invite_to); //размещение ссылки на комнату
        } else {
            this.socket.emit('invite', data); //создание комнаты диалога с юзером, дальнешее размещение ссылки
        }
    }
    sendMessage(room, text, type, link) {// отправка сообщения
        var message = {
            id_room: room,
            text: text,
            type,
            link
        };
        this.socket.emit('message', message);
    }

    changeActiveRoom(id_room) { //смена текущий комнаты
        this.current_room = id_room; //смена текущий комнаты
        this.store.dispatch(Actions.current_room(id_room)) // изм. хранилища
        this.reset_message_count(id_room);//сброс счетчки сообщений
        this.history.pushState({}, '', '/Chat?rooms=' + id_room);//изм. адр. строки
    }
    leaveRoom(id_room) {//отключение от комнаты
        var message = {
            id_room
        };
        this.socket.emit('leave', message);
    }
    ;
            changeRoom(id_room, name_room) {//смена комнаты
        this.socket.emit('join', {
            id_room, name_room
        });
    }
    ;
            changeName(name) {//смена имени юзера
        this.socket.emit('changeName', name);
    }
    active_rooms(all_rooms) {//поиск и добавление в хранилище комнат, кодключенных у юзера
        let rooms = all_rooms.filter(key =>
            key.users.some(row => row == this.current_name)
        )
        rooms = rooms.map(room => ({
                id_room: room.id_room,
                name_room: room.name_room,
                count: 0}))
        this.store.dispatch(Actions.active_rooms(rooms))
    }

    increment_message_count(id_room) { //инкремент счетчика сообщение у подключенных комнат
        this.store.dispatch(Actions.increment_message_count(id_room))
    }
    reset_message_count(id_room) { //сброс счетчика сообщение у подключенных комнат
        this.store.dispatch(Actions.reset_message_count(id_room))
    }
}
export default Chat;