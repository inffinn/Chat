var socketio = require('socket.io');
var v4=require('uuid/v4');
 var chat_server=function(server) {
var io = socketio.listen(server);
var nickNames = {}; //список ников по ключу socket.id
var namesUsed = []; //список использованных имен
var currentRoom = {}; //текущие комнаты по ключу socket.id
var roomNames={Lobby:"Lobby"}; //список комнат по ключу ид комнаты
var messages=[]; // массив сохраняет собщения

function change_rooms(socket){ //возвращает актуальные массивы комнат и юзеров после событий смены ников и входа в комнаты, отключений и дисконектов
    let rooms={};
    let users=[];
    
    users=Object.keys(nickNames).map(n=>({name:nickNames[n],id:n})); //список юзеров

//из сокет адаптера на сервере можно получать актуальный список комнат и подключенных сокетов
    rooms=Object.keys(socket.adapter.rooms).map(room_row=>{ //формируем массив комнат и подкл. сокетов
        let room={};
        let clinets=socket.adapter.rooms[room_row].sockets;
        room['users']=Object.keys(clinets); 
    room['id_room']=room_row;
      room['name_room']=roomNames[room_row];
      return room;
  })
 
     rooms.map((room,index)=>room.users.map(user=>{ //удаление из массива ненужных автоматически созданных комнат, где имя комнаты=сокет ид
         if(room.id_room==user)
            delete rooms[index]
         }))
  rooms=rooms.filter(room=>true); //удаление пустых ячеек из массива
  rooms.map((room,r)=>{
      let room_users=room['users'].map((user)=>nickNames[user]) //подставление ников вместо сокет ид
      rooms[r].users=room_users;
  })
    io.emit('roomsUpdate',{rooms,users}); //отправляем всем клиентом актуальный массив комнат и поль-лей
}  

function joinRoom(socket,id_room, name_room) {
// Вход пользователя в комнату чата
if (name_room) //если имя комнаты известно, то за запись в массив комнат
roomNames[id_room]=name_room;
else name_room=roomNames[id_room]; //иначе берем имя из массива комнат
if (nickNames[socket.id]){//если есть ник, то разрешаем подключение к комнате
socket.join(id_room);//подключение к комнате
currentRoom[socket.id] = id_room; // массив текущих комнат сокетов
socket.emit('changeRoom', {id_room,name_room});//оповещение юзера о успешом подключении
sendMessage({socket_id:socket.id,id_room,name:nickNames[socket.id],text: nickNames[socket.id] + ' has joined ' + name_room + '.'});
//оповещение юзера о успешом полноценным сообщением
change_rooms(socket);// возвращает актуальный список комнат и юзеров
}else socket.emit('alert', {text: 'Unknown nickname'});//уведомляет юзера об ошибке
}

function handleNameChangeAttempts(socket, nickNames, namesUsed) { //обработчик событий для смены имен юзеров

socket.on('changeName', function(name) { //отслеживание события смены имени
if (namesUsed.indexOf(name) == -1) { //если имя свободно
var previousName = nickNames[socket.id];
var previousNameIndex = namesUsed.indexOf(previousName); //сохранение предыдущего имени
namesUsed.push(name);//добавление в список занятых имен
nickNames[socket.id] = name; //добавление в массив имен
// Удаление ранее выбранного имени, которое
// освобождается для других клиентов
namesUsed.splice(previousNameIndex,previousNameIndex);
socket.emit('changeName', { //уведомление юзера о успешном смене ника
success: true,
name: name
});

if (previousName) //если был предыдущий ник, то отправляется сообщение об этом
sendMessage({socket_id:socket.id,id_room:currentRoom[socket.id],name,text: previousName + ' is now known as ' + name + '.'});            
change_rooms(socket);
} else {
socket.emit('alert',{text:'That name is already in use.'});  //предупреждение юзера о ошибке
}
})
}
function handleRoomJoining(socket) {//обработчик присоединения к комнате
socket.on('join', function(room) {//прослушивание события join
joinRoom(socket, room.id_room,room.name_room);//функция подключения к комнате
});
}

function handleInvite(socket) {//обработчик приглашений к диалогу между юзерами и отправка ссылок на комнаты
socket.on('invite', function(msg) {//прослушивание события invite
   let id_room= msg.from+'VS'+msg.to; //генерация ид комнаты из ников 2 юзеров, т.к. ники уникальны, ид комнаты тоже
    joinRoom(socket, id_room,msg.from+' VS '+msg.to); //имя комнаты
socket.emit('invite',{id_room,name:msg.to,invite_to:msg.invite_to});//уведомление юзера о создании комнаты
io.emit('joinInvite',{id_room,name:msg.to});//отправка всем уведомления для подключения искомого пользователя
})
}



function handleRoomLeaving(socket) { //обработчик выхода из комнаты
socket.on('leave', function(data) {
socket.leave(data.id_room); //выход из комнаты
change_rooms(socket); //обновление списка комнат
});
}
function handleClientDisconnection(socket) { //обработчик дисконнекта
socket.on('disconnect', function() {
var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
namesUsed=namesUsed.splice(nameIndex,nameIndex); //удаление занимаемого ника
delete nickNames[socket.id]; //удаление ника
});
}
function getDate(){ //получние даты времени с сервера
    let date=new Date();
            let year = String(date.getFullYear());
            let month = String(date.getMonth() + 1);
            if (month.length == 1)
                month = '0' + month;
            let day = String(date.getDate());
            if (day.length == 1)
                day = '0' + day;
            let hour = String(date.getHours());
            if (hour.length == 1)
                hour = '0' + hour;
            let min = String(date.getMinutes());
            if (min.length == 1)
                min = '0' + min;
            let sec = String(date.getSeconds());
            if (sec.length == 1)
                sec = '0' + sec;
            date = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
     return date;       
}
function handleMessageBroadcasting(socket) {//обработчик отправки сообщений
socket.on('message', function (message) { //прослушивание события message
sendMessage({socket_id:socket.id,id_room:message.id_room,name:nickNames[socket.id],text:message.text,type:message.type,link:message.link});//отправка сообщения
});
}
function sendMessage({socket_id,id_room,name,text,type,link}){//ф-я отпрвки сооб-и, примает ид сокета, ид комнаты, имя юзера, текст сооб-я, тип сооб-я, возможную ссылку на комнату
let date = getDate();            
messages.push({id:v4(),date,socket_id,id_room,name,text,type,link});
io.to(id_room).emit('message', //отправка сооб-я в указанную комнату
{id:v4(),date,id_room,name,text,type,link}
);
}

io.sockets.on('connection', function (socket) { //при событии подключения

handleMessageBroadcasting(socket, nickNames); //навешивание обработчиков
handleNameChangeAttempts(socket, nickNames, namesUsed);
handleInvite(socket);
handleRoomJoining(socket);
handleRoomLeaving(socket);
handleClientDisconnection(socket, nickNames, namesUsed);
});
 }
 
module.exports = chat_server;