/* eslint-disable react-hooks/exhaustive-deps */
import AsyncStorage from '@react-native-community/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {Block, ImageComponent} from '../../components';
import {locationRequest, loginSuccess} from '../../redux/action';
import {Alerts, strictValidString} from '../../utils/commonUtils';
import messaging from '@react-native-firebase/messaging';
import {Linking, PermissionsAndroid, Platform} from 'react-native';
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
          routes: [{name: 'Intro'}],
        });
      }, 3000);
    }
  };
  useEffect(() => {
    callAuthApi();
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
        dispatch(locationRequest(position.coords));
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
        getLocation();
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        console.log('never ask again');
        // if (Platform.OS === 'android') {
        //   BackHandler.exitApp();
        // }
        Alerts(
          "You can't acess the Geolocation Service",
          'Please give access to Location service from the app settings',
        );
        setTimeout(() => {
          Linking.openSettings();
        }, 2000);
        // requestCameraPermission();
      } else {
        console.log('never ask again 2');
        Alerts(
          "You can't acess the Geolocation Service",
          'Please give access to Location service',
        );
        requestCameraPermission();
        // if (Platform.OS === 'android') {
        //   BackHandler.exitApp();
        // }
        console.log('Location permission denied');
      }
    } catch (err) {
      console.log('never ask again 3', err);
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
