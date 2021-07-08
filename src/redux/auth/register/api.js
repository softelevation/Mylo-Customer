import axios from 'axios';
import {config} from '../../../utils/config';
export const Api = async (data) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  return axios({
    method: 'post',
    url: `${config.Api_Url}/user/verify-otp`,
    headers,
    data: data,
  });
};
