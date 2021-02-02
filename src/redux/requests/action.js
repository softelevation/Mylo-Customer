import {ActionConstants} from '../constants';

export const brokerRequest = () => {
  return {
    type: ActionConstants.BROKER_REQUEST,
  };
};
export const brokerSuccess = (data) => {
  return {
    type: ActionConstants.BROKER_SUCCESS,
    data,
  };
};
export const brokerError = (error) => {
  return {
    type: ActionConstants.BROKER_ERROR,
    error,
  };
};
export const statusChangeRequest = (payload) => {
  return {
    type: ActionConstants.STATUS_CHANGE_REQUEST,
    payload,
    res: false,
  };
};
export const statusChangeSuccess = (data) => {
  return {
    type: ActionConstants.STATUS_CHANGE_SUCCESS,
    data,
    res: true,
  };
};
export const statusChangeError = (error) => {
  return {
    type: ActionConstants.STATUS_CHANGE_ERROR,
    error,
    res: false,
  };
};
