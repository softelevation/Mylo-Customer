import {combineReducers} from 'redux';
import {ActionConstants} from '../constants';
const initialState = {
  loading: false,
  data: {},
  error: '',
};
export function list(state = initialState, action) {
  switch (action.type) {
    case ActionConstants.BROKER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ActionConstants.BROKER_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.data,
      };
    case ActionConstants.BROKER_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    default:
      return state;
  }
}
const initailStatus = {
  loading: false,
  data: [],
  error: '',
};
export function status(state = initailStatus, action) {
  switch (action.type) {
    case ActionConstants.STATUS_CHANGE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ActionConstants.STATUS_CHANGE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.data,
      };
    case ActionConstants.STATUS_CHANGE_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    default:
      return state;
  }
}

const request = combineReducers({
  list,
  status,
});
export default request;
