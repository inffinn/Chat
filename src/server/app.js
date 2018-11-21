var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var favicon = require('serve-favicon');

const fileAssets = express.static(path.join(__dirname, '../../dist/assets')) //прдоставляет стат. файлы по пути




const buildHTMLPage = () => `<!doctype html> 
<html lang='en'>
<div id='app'></div>
<script src='/socket.io/socket.io.js' type='text/javascript'></script>
<script src='./bundle.js' type='text/javascript'></script>
</html>
`
//создание пустой html странички и js скриптов


const respond = (req, res, next) => { //отдача странички запросу
    console.log('buildHTMLPage')
    return (res.status(200).send(buildHTMLPage()))
}

const logger = (req, res, next) => { //логи запросов
    console.log(`${req.method} request for '${req.url}'`)
    next()
}





var app = express()
        .use(bodyParser.json())
        .use(logger)
        .use(favicon(path.join(__dirname, '../../dist/assets/chat.jpg')))
        .use(fileAssets)
        .use(respond)
var http = require('http').Server(app).listen(3000, function () {
    console.log('listening on *:3000');
});

var chatServer = require('./chat_server'); //передача сервера функции чата
chatServer(http);
