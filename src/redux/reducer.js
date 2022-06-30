import {combineReducers} from 'redux';
import user from './auth/reducer';
import broker from './broker/reducer';
import request from './requests/reducer';
import socket from './socket/reducer';
import location from './location/reducer';
import notification from './notification/reducer';
import feedback from './feedback/reducer';

const rootreducer = combineReducers({
  user,
  broker,
  request,
  socket,
  location,
  notification,
  feedback,
});
export default rootreducer;
