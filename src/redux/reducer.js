import {combineReducers} from 'redux';
import user from './auth/reducer';
import broker from './broker/reducer';
import request from './requests/reducer';
import socket from './socket/reducer';
import location from './location/reducer';

const rootreducer = combineReducers({
  user,
  broker,
  request,
  socket,
  location,
});
export default rootreducer;
