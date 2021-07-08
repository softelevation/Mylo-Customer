import {combineReducers} from 'redux';
import user from './auth/reducer';
import broker from './broker/reducer';
import request from './requests/reducer';
import socket from './socket/reducer';

const rootreducer = combineReducers({
  user,
  broker,
  request,
  socket,
});
export default rootreducer;
