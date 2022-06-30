import {combineReducers} from 'redux';
import {ActionConstants} from '../constants';
const initialState = {
  loading: false,
  data: {},
  error: '',
};
export function feedback(state = initialState, action) {
  switch (action.type) {
    case ActionConstants.FEEDBACK_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ActionConstants.FEEDBACK_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.data,
      };
    case ActionConstants.FEEDBACK_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    default:
      return state;
  }
}
export default feedback;
