import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {FlatList, StyleSheet, Text} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import Header from '../../common/header';
import {Block, CustomButton} from '../../components';
import {brokerRequest} from '../../redux/requests/action';
import useHardwareBack from '../../components/usehardwareBack';
import {SocketContext} from '../../utils/socket';

const Request = ({navigationState}) => {
  const {routes, index} = navigationState;
  const selected = index;
  const socket = React.useContext(SocketContext);
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

  useFocusEffect(
    React.useCallback(() => {
      dispatch(brokerRequest());
      socket.on(`refresh_feed_${userId}`, (msg) => {
        if (msg.type === 'book_broker') {
          dispatch(brokerRequest());
        }
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );
  return (
    <Block safearea flex={false}>
      <Header centerText={'Requests'} />
      <FlatList
        data={routes}
        horizontal
        contentContainerStyle={styles.FlatListStyle}
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
                  ? styles.selectedStyle
                  : styles.unSelectedStyle,
              ]}
              onPress={() => navigation.navigate(item.name)}>
              <Text
                style={[CustomText, selected === index && styles.selectedText]}>
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
const styles = StyleSheet.create({
  FlatListStyle: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  selectedStyle: {
    borderBottomColor: '#231F20',
    borderBottomWidth: 4,
  },
  unSelectedStyle: {
    borderBottomColor: 'transparent',
    borderBottomWidth: 4,
  },
  selectedText: {
    color: '#231F20',
    fontWeight: '500',
  },
});
export default Request;
