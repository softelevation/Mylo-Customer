import {all} from 'redux-saga/effects';
import {loginWatcher} from './auth/login/saga';
import {registerWatcher} from './auth/register/saga';
import {brokerWatcher} from './broker/saga';
import {customerWatcher} from './requests/saga';
import {profileWatcher} from './auth/profile/saga';

export default function* rootSaga() {
  yield all([
    loginWatcher(),
    brokerWatcher(),
    registerWatcher(),
    customerWatcher(),
    profileWatcher(),
  ]);
}
