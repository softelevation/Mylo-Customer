import AsyncStorage from '@react-native-community/async-storage';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {useState} from 'react';
import {Alert, FlatList, RefreshControl, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {Block, CustomButton, ImageComponent, Text} from '../../../components';
import ActivityLoader from '../../../components/activityLoader';
import EmptyFile from '../../../components/emptyFile';
import {t1, t2, w3} from '../../../components/theme/fontsize';
import {brokerRequest} from '../../../redux/requests/action';
import {strictValidObjectWithKeys} from '../../../utils/commonUtils';
import {SocketContext} from '../../../utils/socket';

const UpcomingRequest = () => {
  const navigation = useNavigation();
  const isLoad = useSelector((state) => state.request.list.loading);
  const data = useSelector((state) => state.request.list.data);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const socket = React.useContext(SocketContext);

  const {upcoming} = data;
  const formatDate = (v) => {
    return moment(v).format('DD, MMM YYYY');
  };
  const formatTime = (v) => {
    return moment(v).format('hh:mm a');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
    dispatch(brokerRequest());
  };

  const onhandleDelete = async (id, status) => {
    const token = await AsyncStorage.getItem('token');
    socket.emit('request', {id, status, token});
  };

  const cancelRequest = (item) => {
    Alert.alert(
      'Are you sure?',
      'You want to cancelled this request',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Yes, do it',
          onPress: () => onhandleDelete(item.id, 'cancelled'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  const renderStatus = (key) => {
    switch (key) {
      case 'in_progress':
        return 'In Progress';
      case 'travel_to_booking':
        return 'travel to booking';
      default:
        return key;
    }
  };

  const _renderItem = ({item, index}) => {
    return (
      <CustomButton
        disabled={item.status === 'pending'}
        onPress={() =>
          navigation.navigate('RequestDetails', {
            item: item,
          })
        }
        white
        margin={[t2, w3, 0, w3]}
        borderRadius={10}
        padding={[t2]}
        flex={false}
        shadow>
        <Block space="between" center row flex={false}>
          <Block flex={false} row center>
            <ImageComponent name="avatar" height="50" width="50" radius={50} />
            <Block margin={[0, w3]} flex={false}>
              <Text bold size={18}>
                {item.name}
              </Text>
              <Text margin={[hp(0.5), 0, 0, 0]} grey body>
                Request Id: #{item.id}
              </Text>
            </Block>
          </Block>
          {item.status !== 'pending' && (
            <TouchableOpacity
              onPress={() => {
                cancelRequest(item);
              }}>
              <ImageComponent name="trash_icon" height={20} width={20} />
            </TouchableOpacity>
          )}
        </Block>
        <Block margin={[t1, 0, 0, 0]} flex={false} row>
          <Block
            flex={false}
            borderWidth={[0, 1, 0, 0]}
            borderColorDeafult
            style={{width: wp(55)}}>
            <Block margin={[t1, 0]} row center flex={false}>
              <ImageComponent name="clock_icon" height="13.5" width="13.5" />
              <Text margin={[0, w3]} grey body>
                {formatTime(item.assign_at)}
              </Text>
            </Block>
            <Block margin={[t1, 0]} row center flex={false}>
              <ImageComponent name="calendar_icon" height="14" width="12.25" />
              <Text margin={[0, w3]} grey body>
                {formatDate(item.assign_at)}
              </Text>
            </Block>
            <Block margin={[t1, 0]} row center flex={false}>
              <ImageComponent name="location_icon" height="14" width="14" />
              <Text margin={[0, w3]} grey body>
                {item.location}
              </Text>
            </Block>
          </Block>
          <Block flex={false} center middle style={{width: wp(35)}}>
            <Block
              padding={[hp(1), wp(2)]}
              margin={[0, wp(2)]}
              borderRadius={5}
              flex={false}
              center
              middle
              secondary>
              <Text transform="uppercase" size={13} center white>
                {renderStatus(item.status)}
              </Text>
            </Block>
            {(item.status === 'in_progress' ||
              item.status === 'travel_to_booking') && (
              <Text
                onPress={() =>
                  navigation.navigate('TrackBroker', {
                    item: item,
                  })
                }
                size={12}
                underline
                margin={[t1, 0]}>
                Track Your Broker
              </Text>
            )}
          </Block>
        </Block>
      </CustomButton>
    );
  };
  return (
    <Block white middle>
      {!refreshing && isLoad && <ActivityLoader />}
      {strictValidObjectWithKeys(data) && (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={upcoming}
          contentContainerStyle={{paddingBottom: t2, flexGrow: 1}}
          showsVerticalScrollIndicator={false}
          renderItem={_renderItem}
          ListEmptyComponent={<EmptyFile />}
        />
      )}
    </Block>
  );
};

export default UpcomingRequest;
