/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {Block, ImageComponent, Text} from '../../components';
import Header from '../../common/header';
import {Alert, FlatList, RefreshControl} from 'react-native';
import {t2, t1, w3, w5} from '../../components/theme/fontsize';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import useHardwareBack from '../../components/usehardwareBack';
import {useDispatch, useSelector} from 'react-redux';
import {notificationRequest} from '../../redux/notification/action';
import EmptyFile from '../../components/emptyFile';
import {light} from '../../components/theme/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';
import {strictValidArrayWithLength} from '../../utils/commonUtils';
import ActivityLoader from '../../components/activityLoader';
import {config} from '../../utils/config';

const Notifications = () => {
  const navigation = useNavigation();
  const userId = useSelector((state) => state.user.profile.user.id);
  const [refreshing, setrefreshing] = useState(false);
  const [data, loading] = useSelector((v) => [
    v.notification.data,
    v.notification.loading,
  ]);
  const dispatch = useDispatch();
  const handleBack = () => {
    navigation.navigate('Maps');
    return true;
  };
  console.log(data, loading, 'data, loading');
  useFocusEffect(
    React.useCallback(() => {
      dispatch(notificationRequest());
    }, []),
  );
  useHardwareBack(handleBack);

  const onhandleDelete = async (id, status) => {
    setrefreshing(true);
    const socket = io(config.Api_Url);
    const token = await AsyncStorage.getItem('token');
    socket.emit('notification_badge', {token: token, id: id});
    setrefreshing(false);
  };
  useEffect(() => {
    const socket = io(config.Api_Url);
    socket.on(`refresh_feed_${userId}`, (msg) => {
      console.log(msg, 'check notificaton');
      if (msg.type === 'notification') {
        dispatch(notificationRequest());
      }
    });
  }, []);
  const cancelRequest = (item) => {
    Alert.alert(
      'Are you sure?',
      'You want to clear this notification',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Yes, do it',
          onPress: () => onhandleDelete(item.id),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  const clearRequest = () => {
    Alert.alert(
      'Are you sure?',
      'You want to clear all notification',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Yes, do it',
          onPress: () => onhandleDelete('all'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };
  const renderCloseIcon = (item) => {
    return (
      <TouchableOpacity onPress={() => cancelRequest(item)}>
        <ImageComponent
          name="close_icon"
          height={14}
          width={14}
          color={light.warning}
        />
      </TouchableOpacity>
    );
  };

  const statushandle = (type) => {
    switch (type) {
      case 'accepted':
        return 'Accepted';
      case 'pending':
        return 'Pending';
      case 'in_progress':
        return 'In Progress';
      case 'rejected':
        return 'Rejected';
      case 'cancelled':
        return 'Cancelled';
      default:
        return '';
    }
  };
  const _renderItem = ({item}) => {
    return (
      <>
        {(item.status === 'accepted' ||
          item.status === 'pending' ||
          item.status === 'in_progress') && (
          <Block
            borderRadius={10}
            shadow
            white
            flex={false}
            margin={[t1, w5]}
            padding={[t2]}>
            <Block flex={false} row>
              <Block flex={false} margin={[heightPercentageToDP(0.5), 0]}>
                <ImageComponent name="accepted_icon" height="10" width="10" />
              </Block>
              <Block margin={[0, w3, 0, w3]}>
                <Text secondary body semibold>
                  Booking #{item.booking_id} {statushandle(item.status)}
                </Text>
                <Text margin={[t1, 0, 0, 0]} grey body>
                  {item.message}
                </Text>
              </Block>
              {renderCloseIcon(item)}
            </Block>
          </Block>
        )}
        {(item.status === 'rejected' || item.status === 'cancelled') && (
          <Block
            borderRadius={10}
            shadow
            white
            flex={false}
            margin={[t1, w5]}
            padding={[t2]}>
            <Block baseline flex={false} row>
              <ImageComponent name="rejected_icon" height="13" width="13" />
              <Block margin={[0, w3, 0, w3]}>
                <Text accent body semibold>
                  Booking #{item.booking_id} {statushandle(item.status)}
                </Text>
                <Text margin={[t1, 0, 0, 0]} grey body>
                  {item.message}
                </Text>
              </Block>
              {renderCloseIcon()}
            </Block>
          </Block>
        )}
      </>
    );
  };
  const onRefresh = () => {
    setrefreshing(true);
    setTimeout(() => {
      setrefreshing(false);
    }, 2000);
    dispatch(notificationRequest());
  };
  return (
    <Block white safearea>
      {!refreshing && loading && <ActivityLoader />}
      <Header
        rightPress={() => clearRequest()}
        rightText={strictValidArrayWithLength(data) ? 'Clear All' : ''}
        centerText={'Notifications'}
      />
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={containerStyle}
        data={data}
        renderItem={_renderItem}
        ListEmptyComponent={<EmptyFile text="No Notifications" />}
      />
    </Block>
  );
};
const containerStyle = {paddingBottom: t2, flexGrow: 1};

export default Notifications;
