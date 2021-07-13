/* eslint-disable react-hooks/exhaustive-deps */
import AsyncStorage from '@react-native-community/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {Block, ImageComponent, Text} from '../../components';
import {loginSuccess, socketConnection} from '../../redux/action';
import {strictValidString} from '../../utils/commonUtils';
import io from 'socket.io-client';
import messaging from '@react-native-firebase/messaging';
import {BackHandler, PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const Splash = () => {
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const callAuthApi = async () => {
    const token = await AsyncStorage.getItem('token');
    if (strictValidString(token)) {
      dispatch(loginSuccess(token));
      setTimeout(() => {
        navigation.reset({
          routes: [{name: 'Home'}],
        });
      }, 3000);
    } else {
      setTimeout(() => {
        navigation.reset({
          routes: [{name: 'Auth'}],
        });
      }, 3000);
    }
  };
  useEffect(() => {
    callAuthApi();
    const socket = io('http://104.131.39.110:3000');
    socket.on('connect', (a) => {
      dispatch(socketConnection(socket));
    });
    // initiateSocket();
  }, []);

  useEffect(() => {
    requestUserPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();

    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      getFcmToken();
    }
  };
  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('Your Firebase Token is:', fcmToken);
    } else {
      console.log('Failed', 'No token received');
    }
  };
  const getLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
      },
      (error) => {},
      {
        enableHighAccuracy: false,
        timeout: 15000,
      },
    );
  };
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'MyloPro App Location Permission',
          message:
            'MyloPro App App needs access to your location ' +
            'so you can access the geolocation service.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
        getLocation();
      } else {
        if (Platform.OS === 'android') {
          BackHandler.exitApp();
        }
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'ios') {
      getLocation();
    } else {
      requestCameraPermission();
    }
  }, []);
  return (
    <Block safearea center middle secondary>
      <Block flex={false} borderWidth={3} borderRadius={10}>
        <ImageComponent name="logo" height={150} width={150} />
      </Block>
    </Block>
  );
};
export default Splash;
