import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {config} from '../../utils/config';
export const Api = async ({data}) => {
  console.log(data,"gggg")
  const token = await AsyncStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `${token}`,
  };
  return axios({
    method: 'post',
    url: `${config.Api_Url}/user/feedback`,
    headers,
    data: data,
  });
};
