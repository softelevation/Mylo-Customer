import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {PostLoginScreen, PreLaunchScreen, PreLoginScreen} from './sub-routes';
import {Alert, SafeAreaView, StatusBar} from 'react-native';
import {light} from '../components/theme/colors';
import {navigationRef} from './NavigationService';
import BrokerDetails from '../common/dialog/broker_details';
import io from 'socket.io-client';
import {Alerts, strictValidObjectWithKeys} from '../utils/commonUtils';
const RootStack = createStackNavigator();
import messaging from '@react-native-firebase/messaging';

const Routes = () => {
  const [brokerDetails, setbrokerDetails] = React.useState({});

  React.useEffect(() => {
    const socket = io('http://104.131.39.110:3000');
    socket.on('broker_details', (msg) => {
      setbrokerDetails(msg);
    });
  }, []);

  React.useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      console.log(remoteMessage);
      Alerts(
        remoteMessage.notification.title,
        remoteMessage.notification.body,
        light.secondary,
      );
    });
    return unsubscribe;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar backgroundColor={light.secondary} barStyle="dark-content" />

      <SafeAreaView style={{flex: 1, backgroundColor: light.secondary}}>
        {strictValidObjectWithKeys(brokerDetails) && (
          <BrokerDetails
            brokerDetails={brokerDetails}
            setBrokerDetails={() => setbrokerDetails({})}
          />
        )}
        <RootStack.Navigator
          screenOptions={{
            cardStyleInterpolator:
              CardStyleInterpolators.forScaleFromCenterAndroid,
          }}
          initialRouteName="Splash"
          headerMode="none">
          <RootStack.Screen name="Splash" component={PreLaunchScreen} />
          <RootStack.Screen name="Auth" component={PreLoginScreen} />
          <RootStack.Screen name="Home" component={PostLoginScreen} />
        </RootStack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default Routes;
