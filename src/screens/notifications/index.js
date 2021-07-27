import React from 'react';
import {Block, ImageComponent, Text} from '../../components';
import Header from '../../common/header';
import {FlatList} from 'react-native';
import {t2, t1, w3, w5} from '../../components/theme/fontsize';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import useHardwareBack from '../../components/usehardwareBack';
import {useDispatch, useSelector} from 'react-redux';
import {notificationRequest} from '../../redux/notification/action';
import EmptyFile from '../../components/emptyFile';

const Notifications = () => {
  const navigation = useNavigation();
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
  const _renderItem = ({item}) => {
    return (
      <>
        {item.status === 'accepted' && (
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
                  Booking #{item.booking_id} accepted
                </Text>
                {/* <Text
                  margin={[heightPercentageToDP(0.5), 0, 0, 0]}
                  grey
                  caption>
                  10:44 • 29/07/2020
                </Text> */}
                <Text margin={[t1, 0, 0, 0]} grey body>
                  {item.message}
                </Text>
              </Block>
            </Block>
          </Block>
        )}
        {item.status !== 'accepted' && (
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
                  Booking #{item.booking_id} rejected
                </Text>
                <Text
                  margin={[heightPercentageToDP(0.5), 0, 0, 0]}
                  grey
                  caption>
                  10:44 • 29/07/2020
                </Text>
                <Text margin={[t1, 0, 0, 0]} grey body>
                  Addison Mccray rejected your request
                </Text>
              </Block>
            </Block>
          </Block>
        )}
      </>
    );
  };
  return (
    <Block white safearea>
      <Header centerText={'Notifications'} />
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: t2, flexGrow: 1}}
        data={data}
        renderItem={_renderItem}
        ListEmptyComponent={<EmptyFile text="No Notifications" />}
      />
    </Block>
  );
};

export default Notifications;
