import { applyMiddleware,createStore, combineReducers,compose } from 'redux';
import {current_room,current_name,messages,all_rooms,active_rooms,users} from './reducers';
import {composeWithDevTools} from 'redux-devtools-extension';


const logger = store => next => action => {//лог изменений хранилища
            let result
            console.groupCollapsed("dispatching", action.type)
            let prev_state = store.getState();
            console.log('prev state', prev_state)
            console.log('action', action)
            result = next(action)
            let next_state = store.getState();
            console.log('next state', next_state)
            console.groupEnd()
            return result
        }



const storeFactory = () => { //фабрика хранилища
        return  (
                createStore(
                combineReducers({current_room,current_name,messages,all_rooms,active_rooms,users})//,                       
                      //  window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : noop => noop //подключение редукс дев тула
                ))}

export default storeFactory;