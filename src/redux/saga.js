import {all} from 'redux-saga/effects';
import {loginWatcher} from './auth/login/saga';
import {registerWatcher} from './auth/register/saga';
import {brokerWatcher} from './broker/saga';
import {notificationWatcher} from './notification/saga';
import {customerWatcher} from './requests/saga';
import {profileWatcher} from './auth/profile/saga';
import {feedbackWatcher} from './feedback/saga';

export default function* rootSaga() {
  yield all([
    loginWatcher(),
    brokerWatcher(),
    registerWatcher(),
    customerWatcher(),
    profileWatcher(),
    notificationWatcher(),
    feedbackWatcher(),
  ]);
}
