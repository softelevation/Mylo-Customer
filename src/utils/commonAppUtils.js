import {Alert, BackHandler, Linking, Platform} from 'react-native';
import React from 'react';
import {light} from '../components/theme/colors';
import {Alerts} from './commonUtils';

export const openMessage = (phone) => {
  const url =
    Platform.OS === 'android'
      ? `sms:${phone}?body=yourMessage`
      : `sms:${phone}`;

  Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        console.log('Unsupported url: ' + url);
      } else {
        return Linking.openURL(url);
      }
    })
    .catch((err) => console.error('An error occurred', err));
};

export const dialCall = (phone) => {
  let phoneNumber = '';

  if (Platform.OS === 'android') {
    phoneNumber = `tel:${phone}`;
  } else {
    phoneNumber = `telprompt:${phone}`;
  }

  Linking.openURL(phoneNumber);
};
export const handleBackPress = () => {
  Alert.alert('Exit Mylo', 'Do you want to exit the Mylo app?', [
    {
      text: 'Cancel',
    },
    {
      text: 'Exit',
      style: 'destructive',
      onPress: () => BackHandler.exitApp(),
    },
  ]);
  return true;
};
// export const handleBackPress = () => {
//   if (Platform.OS === 'ios') {
//     return;
//   }
//   const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
//     if (currentCount === 1) {
//       BackHandler.exitApp();
//       subscription.remove();
//       return true;
//     }
//     backPressHandler();
//     return true;
//   });
// };

// const backPressHandler = () => {
//   if (currentCount < 1) {
//     currentCount += 1;
//     Alerts('', 'Press again to close!', light.subtitleColor);
//   }
//   setTimeout(() => {
//     currentCount = 0;
//   }, 2000);
// };
