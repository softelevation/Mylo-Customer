import {ActionConstants} from '../../constants';
import {loginError, loginSuccess} from '../../action';
import {put, call, all, takeLatest} from 'redux-saga/effects';
import {Api} from './api';
import * as navigation from '../../../routes/NavigationService';
import {Alert} from 'react-native';
import {Alerts} from '../../../utils/commonUtils';
import {light} from '../../../components/theme/colors';

export function* loginRequest(action) {
  try {
    const response = yield call(Api, action.payload);
    if (response.data.status === 1 && response.data.data.roll_id === 1) {
      yield put(loginSuccess(response.data));
      navigation.navigate('Register', {
        phone_no: action.payload,
      });
      Alerts('Success', response.data.message, light.secondary);
    } else if (response.data.data.roll_id === 2) {
      alert('Please login with registered user number ');
      yield put(loginError(response));
    } else {
      yield put(loginError(response));
    }
  } catch (err) {
    yield put(loginError(err));
  }
}

export function* loginWatcher() {
  yield all([takeLatest(ActionConstants.LOGIN_REQUEST, loginRequest)]);
}
export default loginWatcher;
