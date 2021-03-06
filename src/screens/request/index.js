import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {FlatList, Text, View} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import Header from '../../common/header';
import {Block, CustomButton} from '../../components';
import {brokerRequest} from '../../redux/requests/action';
import io from 'socket.io-client';

const Request = ({navigationState}) => {
  const {routes, index} = navigationState;
  const selected = index;
  const navigation = useNavigation();
  const socket = useSelector((state) => state.socket.data);

  const dispatch = useDispatch();
  const getValues = (name) => {
    if (name === 'PastRequest') {
      return 'Past';
    }
    return 'Upcoming';
  };

  useEffect(() => {
    dispatch(brokerRequest());
    socket.on('refresh_feed', (msg) => {
      if (msg.type === 'book_broker') {
        dispatch(brokerRequest());
      }
      console.log('Websocket event received!', msg);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
            <ButtonStyle
              activeOpacity={1}
              flex={false}
              secondary
              style={
                selected === index
                  ? {
                      borderBottomColor: '#231F20',
                      borderBottomWidth: 4,
                    }
                  : {borderBottomColor: 'transparent', borderBottomWidth: 4}
              }
              onPress={() => navigation.navigate(item.name)}>
              <CustomText
                style={
                  selected === index && {
                    color: '#231F20',
                    fontWeight: '500',
                  }
                }>
                {getValues(item.name)}
              </CustomText>
            </ButtonStyle>
          );
        }}
      />
    </Block>
  );
};
const CustomText = styled.Text({
  color: '#fff',
  fontSize: 16,
});
const ButtonStyle = styled(CustomButton)({
  paddingVertical: heightPercentageToDP(2),
  width: widthPercentageToDP(50),
  justifyContent: 'center',
  alignItems: 'center',
});
export default Request;
