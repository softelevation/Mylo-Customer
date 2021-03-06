import {ActionConstants} from '../../constants';
const initialState = {
  loading: false,
  user: '',
  error: '',
};
export function profileReducer(state = initialState, action) {
  switch (action.type) {
    case ActionConstants.PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ActionConstants.PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.data,
      };
    case ActionConstants.PROFILE_ERROR:
      return {
        ...state,
        loading: false,
      };
    case ActionConstants.PROFILE_UPDATE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ActionConstants.PROFILE_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.data,
      };
    case ActionConstants.PROFILE_UPDATE_ERROR:
      return {
        ...state,
        loading: false,
      };
    case ActionConstants.PROFILE_FLUSH:
      return {
        ...initialState,
      };

    default:
      return state;
  }
}
export default profileReducer;
