import React from 'react';
import {Alert, BackHandler, FlatList, TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Block, CustomButton, ImageComponent, Text} from '../components';
import {useNavigation} from '@react-navigation/native';
import {DrawerData} from '../utils/static-data';
import AsyncStorage from '@react-native-community/async-storage';
import {loginSuccess} from '../redux/action';
import {useDispatch, useSelector} from 'react-redux';
import {
  strictValidObjectWithKeys,
  strictValidString,
} from '../utils/commonUtils';
import {handleBackPress} from '../utils/commonAppUtils';
import {config} from '../utils/config';
import messaging from '@react-native-firebase/messaging';

const DrawerScreen = ({state}) => {
  const nav = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((v) => v.user.profile.user);

  const renderHeight = (icon) => {
    switch (icon) {
      case 'become_broker_icon':
        return 19;
      case 'terms_icon':
        return 19;
      case 'logout_icon':
        return 14.5;
      default:
        return 19.5;
    }
  };
  const renderWidth = (icon) => {
    switch (icon) {
      case 'become_broker_icon':
        return 19;
      case 'terms_icon':
        return 14;
      case 'logout_icon':
        return 19.5;
      case 'noti_icon':
        return 19.5;
      case 'chat_icon':
        return 19.5;
      default:
        return 17.5;
    }
  };

  const onLogout = async () => {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);
    await messaging().deleteToken(undefined, '*');
    dispatch(loginSuccess(''));
    nav.reset({
      routes: [{name: 'Auth'}],
    });
  };

  const navigateHelpers = async (val) => {
    if (val === 'Login') {
      try {
        Alert.alert(
          '',
          'Are you sure you want to log out ?',
          [
            {
              text: 'No',
            },
            {
              text: 'Yes',
              onPress: () => onLogout(),
              style: 'cancel',
            },
          ],
          {cancelable: false},
        );
      } catch (error) {}
    } else {
      nav.reset({
        routes: [{name: val}],
      });
    }
  };
  const navigateToRoute = () => {
    nav.goBack('BookBroker');
  };
  React.useEffect(() => {
    if (state.index === 0) {
      const BackButton = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );
      return () => BackButton.remove();
    }
  }, [state.index]);
  React.useEffect(() => {
    if (state.index === 4) {
      const BackButton = BackHandler.addEventListener(
        'hardwareBackPress',
        navigateToRoute,
      );
      return () => BackButton.remove();
    }
  }, [state.index]);

  const _renderItem = ({item, index}) => {
    return (
      <CustomButton
        onPress={() => navigateHelpers(item.nav)}
        row
        center
        flex={false}
        color="transparent"
        padding={[hp(1.5), wp(5), hp(1.5), wp(5)]}>
        <Block flex={false} style={{width: wp(7)}}>
          <ImageComponent
            name={item.icon}
            height={renderHeight(item.icon)}
            width={renderWidth(item.icon)}
          />
        </Block>
        <Text size={16} semibold margin={[0, wp(8), 0, wp(5)]}>
          {item.name}
        </Text>
        {/* {index === state.index && (
          <Block
            flex={false}
            secondary
            borderRadius={10}
            style={{height: 10, width: 10}}
          />
        )} */}
      </CustomButton>
    );
  };
  return (
    <>
      <Block safearea>
        <Block
          secondary
          padding={[hp(4), wp(3), hp(4), wp(3)]}
          row
          center
          flex={false}>
          <Block
            flex={false}
            borderWidth={1}
            borderColor="#fff"
            borderRadius={60}>
            {strictValidObjectWithKeys(user) &&
            strictValidString(user.image) ? (
              <ImageComponent
                isURL
                name={`${config.Api_Url}/${user.image}`}
                height="80"
                width="80"
                radius={80}
              />
            ) : (
              <ImageComponent
                name="avatar"
                height="80"
                width="80"
                radius={80}
              />
            )}
          </Block>
          <Block margin={[0, wp(4), 0, wp(4)]} flex={false}>
            <Text white bold>
              {strictValidObjectWithKeys(user) && user.name}
            </Text>
            <TouchableOpacity onPress={() => nav.navigate('Profile')}>
              <Text
                margin={[hp(1), 0, 0, 0]}
                bold
                color="rgba(255,255,255,0.7)"
                body>
                View Profile
              </Text>
            </TouchableOpacity>
          </Block>
        </Block>

        <Block padding={[0, wp(2)]} flex={false}>
          <FlatList data={DrawerData} renderItem={_renderItem} />
        </Block>
      </Block>
    </>
  );
};
export default DrawerScreen;
