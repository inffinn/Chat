'use strict';
import css from '../../css/app.scss';
import React from 'react';
import {BrowserRouter} from 'react-router-dom'
import ReactDOM from 'react-dom';
import { render } from 'react-dom';
import { Redirect,Route, Switch } from 'react-router-dom';
import consts from '../constants';
import Chat from './Chat';
import storeFactory from '../store/storeFactory';


import {
    Main_page_container,
    Start_page_container,
    Users_container,
    Current_name_container,
    Messages_container,
    Rooms_container} from './Containers';
import { Provider } from 'react-redux';
const queryString = require('query-string');

//корневой компонент приложения, создание хранилища, экземпляра сокета,экземпляра класса чата, передача их дочерним компонентам и роутинг
const store = storeFactory()
const socket = io.connect();
    const chatApp = new Chat(socket,store,window);
 

    
    const ErrorPage=()=><div>Error 404</div>;
const main_page=({location,history})=>
     <Main_page_container chatApp={chatApp} location={location} history={history}/>

render(
<Provider store={store}>

<BrowserRouter>    
    <div className="App">
    <Switch>
   <Redirect exact from="/" to="Chat?rooms=Lobby"/>
   <Route  path="/Chat" component={main_page}/>
  <Route component={ErrorPage} /> 
 </Switch>
 </div>
 </BrowserRouter>

 </Provider>,

  document.getElementById('app')
 )

        // Route  подзволяет маршрутизировать строки запроса ?rooms= позволяет загрузить любую комнату по ссылке
        // всегда хранит текущую открытую комнату