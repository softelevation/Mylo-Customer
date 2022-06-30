import {ActionConstants} from '../constants';

export const feedbackRequest = (payload) => {
  return {
    type: ActionConstants.FEEDBACK_REQUEST,
    payload,
    res: false,
  };
};
export const feedbacktSuccess = (data) => {
  return {
    type: ActionConstants.FEEDBACK_SUCCESS,
    data,
    res: true,
  };
};
export const feedbackError = (error) => {
  return {
    type: ActionConstants.FEEDBACK_ERROR,
    error,
    res: false,
  };
};
