import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {BackHandler, FlatList, Text, View} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../../common/header';
import {Block, CustomButton} from '../../components';
import {brokerRequest} from '../../redux/requests/action';
import io from 'socket.io-client';
import {handleBackPress} from '../../utils/commonAppUtils';
import useHardwareBack from '../../components/usehardwareBack';

const Request = ({navigationState}) => {
  const {routes, index} = navigationState;
  const selected = index;
  const socket = useSelector((state) => state.socket.data);
  const userId = useSelector((state) => state.user.profile.user.id);

  const dispatch = useDispatch();

  const navigation = useNavigation();

  const handleBack = () => {
    navigation.navigate('Maps');
    return true;
  };

  useHardwareBack(handleBack);

  const getValues = (name) => {
    if (name === 'PastRequest') {
      return 'Past';
    }
    return 'Upcoming';
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(brokerRequest());
      socket.on(`refresh_feed_${userId}`, (msg) => {
        if (msg.type === 'book_broker') {
          dispatch(brokerRequest());
        }
      });
    }, []),
  );
  return (
    <Block safearea flex={false}>
      <Header centerText={'Requests'} />
      <FlatList
        data={routes}
        horizontal
        contentContainerStyle={{
          justifyContent: 'space-around',
          alignItems: 'center',
          flexDirection: 'row',
          flex: 1,
        }}
        keyExtractor={(item) => item.key}
        renderItem={({item, index}) => {
          return (
            <CustomButton
              activeOpacity={1}
              flex={false}
              secondary
              style={[
                ButtonStyle,
                selected === index
                  ? {
                      borderBottomColor: '#231F20',
                      borderBottomWidth: 4,
                    }
                  : {borderBottomColor: 'transparent', borderBottomWidth: 4},
              ]}
              onPress={() => navigation.navigate(item.name)}>
              <Text
                style={[
                  CustomText,
                  selected === index && {
                    color: '#231F20',
                    fontWeight: '500',
                  },
                ]}>
                {getValues(item.name)}
              </Text>
            </CustomButton>
          );
        }}
      />
    </Block>
  );
};
const CustomText = {
  color: '#fff',
  fontSize: 16,
};
const ButtonStyle = {
  paddingVertical: heightPercentageToDP(2),
  width: widthPercentageToDP(50),
  justifyContent: 'center',
  alignItems: 'center',
};
export default Request;
