import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import Splash from '../screens/splash';
import Login from '../screens/auth/login';
import Register from '../screens/auth/register';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import DrawerScreen from '../common/drawer';
import Profile from '../screens/auth/profile';
import BecomeBroker from '../screens/become-broker';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Request from '../screens/request';
import UpcomingRequest from '../screens/request/upcoming';
import PastRequest from '../screens/request/past';
import Notifications from '../screens/notifications';
import BookBroker from '../screens/book-broker';
import RequestDetails from '../screens/request/details';
import SelectDateTime from '../screens/book-broker/select-date-time';
import Chat from '../screens/chat';
import ChatDetails from '../screens/chat/detail';
import Feedback from '../screens/feedback';
import Intro from '../screens/intro';
import TrackBroker from '../screens/track';

const Tab = createMaterialTopTabNavigator();
const PostLoginStack = createStackNavigator();
const Drawer = createDrawerNavigator();
const transition = {
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

export const PreLaunchScreen = () => (
  <PostLoginStack.Navigator
    headerMode="none"
    mode="card"
    initialRouteName="Splash">
    <PostLoginStack.Screen
      name="Splash"
      options={{
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
      }}
      component={Splash}
    />
  </PostLoginStack.Navigator>
);
export const PreLoginScreen = () => (
  <PostLoginStack.Navigator
    headerMode="none"
    mode="card"
    initialRouteName="Intro">
    <PostLoginStack.Screen
      name="Intro"
      options={transition}
      component={Intro}
    />
    <PostLoginStack.Screen
      name="Login"
      options={transition}
      component={Login}
    />
    <PostLoginStack.Screen
      options={transition}
      name="Register"
      component={Register}
    />
    <PostLoginStack.Screen name="BecomeBroker" component={BecomeBroker} />
  </PostLoginStack.Navigator>
);

const MyTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="UpcomingRequest"
      tabBar={(props) => <Request {...props} />}>
      <Tab.Screen name="UpcomingRequest" component={UpcomingRequest} />
      <Tab.Screen name="PastRequest" component={PastRequest} />
    </Tab.Navigator>
  );
};

const HomeStack = () => (
  <PostLoginStack.Navigator
    headerMode="none"
    mode="card"
    initialRouteName="BookBroker">
    {/* <PostLoginStack.Screen name="Maps" options={transition} component={Home} /> */}
    <PostLoginStack.Screen
      name="BookBroker"
      options={transition}
      component={BookBroker}
    />
    <PostLoginStack.Screen
      name="Profile"
      options={transition}
      component={Profile}
    />
    {/* <PostLoginStack.Screen
      name="SelectDateTime"
      options={transition}
      component={SelectDateTime}
    /> */}
    <PostLoginStack.Screen
      name="ChatDetails"
      options={transition}
      component={ChatDetails}
    />
    <PostLoginStack.Screen
      name="Feedback"
      options={transition}
      component={Feedback}
    />
    <PostLoginStack.Screen
      name="RequestDetails"
      options={transition}
      component={RequestDetails}
    />
  </PostLoginStack.Navigator>
);

const RequestStack = () => (
  <PostLoginStack.Navigator
    headerMode="none"
    mode="card"
    initialRouteName="Request">
    <PostLoginStack.Screen
      name="Request"
      options={transition}
      component={MyTabs}
    />
    <PostLoginStack.Screen
      name="RequestDetails"
      options={transition}
      component={RequestDetails}
    />
    <PostLoginStack.Screen
      name="ChatDetails"
      options={transition}
      component={ChatDetails}
    />
    <PostLoginStack.Screen
      name="TrackBroker"
      options={transition}
      component={TrackBroker}
    />
  </PostLoginStack.Navigator>
);
const ChatStack = () => (
  <PostLoginStack.Navigator
    headerMode="none"
    mode="card"
    initialRouteName="Chat">
    <PostLoginStack.Screen name="Chat" options={transition} component={Chat} />
    <PostLoginStack.Screen
      name="ChatDetails"
      options={transition}
      component={ChatDetails}
    />
  </PostLoginStack.Navigator>
);
function HomeDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Maps"
      drawerStyle={{width: widthPercentageToDP(70)}}
      drawerContent={(props) => <DrawerScreen {...props} />}>
      <Drawer.Screen name="Maps" options={transition} component={HomeStack} />
      <Drawer.Screen
        name="SelectDateTime"
        options={transition}
        component={SelectDateTime}
      />
      <Drawer.Screen name="Request" component={RequestStack} />
      <Drawer.Screen name="Notifications" component={Notifications} />
      <Drawer.Screen name="Profile" component={Profile} />
    </Drawer.Navigator>
  );
}
export const PostLoginScreen = () => {
  return (
    <PostLoginStack.Navigator
      headerMode="none"
      mode="card"
      initialRouteName="Home">
      <PostLoginStack.Screen
        name="Home"
        options={transition}
        component={HomeDrawer}
      />
    </PostLoginStack.Navigator>
  );
};
