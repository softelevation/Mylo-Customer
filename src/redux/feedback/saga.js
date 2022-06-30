import {ActionConstants} from '../constants';
import {put, call, all, takeLatest} from 'redux-saga/effects';
import {Api} from './api';
import {feedbackError, feedbacktSuccess} from './action';
import * as navigation from '../../routes/NavigationService';
import { Alert } from 'react-native';

export function* request(action) {
  try {
    const response = yield call(Api, action.payload);
    console.log(response, 'response');
    if (response.data.status === 1) {
      yield put(feedbacktSuccess(response.data.data));
       navigation.navigate('UpcomingRequest');
        Alert.alert('Success', 'Feedback Submitted.');
    } else {
      yield put(feedbackError(response));
    }
  } catch (err) {
    yield put(feedbackError());
  }
}

export function* feedbackWatcher() {
  yield all([takeLatest(ActionConstants.FEEDBACK_REQUEST, request)]);
}
export default feedbackWatcher;
