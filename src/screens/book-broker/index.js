import React, {useRef, useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  View,
  Linking,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
import Header from '../../common/header';
import {
  Block,
  Button,
  CustomButton,
  ImageComponent,
  Text,
} from '../../components';
import {Modalize} from 'react-native-modalize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {t1, t3, t5, w1, w5} from '../../components/theme/fontsize';
import StarRating from 'react-native-star-rating';
import {light} from '../../components/theme/colors';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import MapView, {Marker} from 'react-native-maps';
import {brokerlistRequest, profileRequest} from '../../redux/action';
import {useDispatch, useSelector} from 'react-redux';
import ActivityLoader from '../../components/activityLoader';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-community/async-storage';
import {strictValidObjectWithKeys} from '../../utils/commonUtils';

const BookBroker = () => {
  const [action, setAction] = useState('');
  const [location, setlocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.09,
    longitudeDelta: 0.02,
  });
  const {width, height} = Dimensions.get('window');
  const [defaultHeight, setDefaultHeight] = useState(height / 3);
  const [brokerDetails, setbrokerDetails] = useState({});
  const modalizeRef = useRef();
  const navigation = useNavigation();
  const loaderTime = 1000;
  const dispatch = useDispatch();
  const loader = useSelector((state) => state.broker.list.loading);
  const brokerData = useSelector((state) => state.broker.list.broker.data);
  const socket = useSelector((state) => state.socket.data);
  const mapRef = useRef();
  const [toggle, settoggle] = useState(true);
  const user = useSelector((state) => state.user.profile.user);

  useEffect(() => {
    dispatch(brokerlistRequest());
    dispatch(profileRequest());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user && !user.name) {
      setTimeout(() => {
        navigation.dispatch(DrawerActions.openDrawer());
        navigation.navigate('Profile');
      }, 2000);
    }
    const unsubscribe = navigation.addListener('state', () => {
      if (user && !user.name) {
        setTimeout(() => {
          navigation.dispatch(DrawerActions.openDrawer());
          navigation.navigate('Profile');
        }, 2000);
      }
    });

    return unsubscribe;
  }, []);
  const isMapRegionSydney = (coords) => {
    return (
      coords.longitude >= 148.601105 &&
      coords.longitude <= 151.75 &&
      coords.latitude >= -35.353333 &&
      coords.latitude <= -31.083332
    );
  };
  useEffect(() => {
    const watchId = Geolocation.getCurrentPosition(
      (position) => {
        if (user && !user.name) {
          Alert.alert('Please Update the Profile first');
        } else if (!isMapRegionSydney(position.coords)) {
          Alert.alert('You can book services only for an address in Sydney.');

          return;
        }

        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.00922 * 1.5,
          longitudeDelta: 0.00421 * 1.5,
          // angle: position.coords.heading,
        };
        console.log(position, 'position');

        setlocation(region);
      },
      (error) => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 15000,
      },
    );

    return () => Geolocation.clearWatch(watchId);
  }, []);

  // Socket

  useEffect(() => {
    socket.on('broker_details', (msg) => {
      console.log('Websocket event received!', msg);
      setbrokerDetails(msg);
      viewDetailsDialog();
    });
  }, [brokerDetails]);

  useEffect(() => {
    onOpen();
    const unsubscribe = navigation.addListener('focus', () => {
      onOpen();
    });

    return unsubscribe;
  }, []);
  console.log(brokerDetails, 'vv');
  const viewDetailsDialog = () => {
    modalizeRef.current?.open();
    setAction('brokerdetails');
  };

  const onOpen = () => {
    modalizeRef.current?.open();
    setAction('schedulebroker');
  };

  // Call Book Now

  const bookNowBroker = async () => {
    const token = await AsyncStorage.getItem('token');
    socket.emit('book_now', token);
    setAction('loading');
    setTimeout(() => {
      setAction('loading');
      modalizeRef.current?.close();
    }, loaderTime);
  };

  // Call Schedule Broker
  const bookScheduledBroker = () => {
    setAction('loading');
    setTimeout(() => {
      navigation.navigate('SelectDateTime');
      modalizeRef.current?.close();
    }, loaderTime);
  };

  // Call View Details

  const viewDetails = (item) => {
    setAction('loading');
    setTimeout(() => {
      modalizeRef.current?.close();
      navigation.navigate('RequestDetails', {
        item: item,
      });
    }, loaderTime);
  };

  const dialCall = (phone) => {
    let phoneNumber = '';

    if (Platform.OS === 'android') {
      phoneNumber = `tel:${phone}`;
    } else {
      phoneNumber = `telprompt:${phone}`;
    }

    Linking.openURL(phoneNumber);
  };

  const openMessage = (phone) => {
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

  const getDefaultCoords = () => {
    return {
      longitude: 151.2099,
      latitude: -33.865143,
      latitudeDelta: 0.09,
      longitudeDelta: 0.02,
    };
  };

  return (
    <Block>
      <Header centerText="Find Broker" />
      {loader && <ActivityLoader />}
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          minZoomLevel={10}
          maxZoomLevel={14}
          showsUserLocation={true}
          // provider="google"
          style={styles.map}
          initialRegion={location}
          onRegionChangeComplete={async (coords) => {
            if (!isMapRegionSydney(coords)) {
              if (isMapRegionSydney(location)) {
                mapRef && mapRef.current.animateToCoordinate(location);
              } else {
                setlocation({
                  longitude: 151.2099,
                  latitude: -33.865143,
                  latitudeDelta: 0.09,
                  longitudeDelta: 0.02,
                });
                mapRef &&
                  mapRef.current.animateToCoordinate(getDefaultCoords());
              }
              return;
            }
          }}>
          {brokerData &&
            brokerData.map((item, index) => {
              const marker = {
                latitude: JSON.parse(item.latitude),
                longitude: JSON.parse(item.longitude),
              };
              return (
                <Marker title={item.name} coordinate={marker}>
                  <ImageComponent
                    name={'map_person_icon'}
                    height="40"
                    width="40"
                  />
                </Marker>
              );
            })}
        </MapView>
      </View>
      {/* {!action && ( */}
      <CustomButton
        onPress={() => onOpen()}
        flex={false}
        style={{position: 'absolute', bottom: hp(2), right: wp(3)}}>
        <ImageComponent name="plus_icon" height="60" width="60" />
      </CustomButton>
      {/* )} */}

      <Modalize
        modalStyle={{backgroundColor: '#292F37'}}
        overlayStyle={{backgroundColor: 'transparent'}}
        handlePosition="inside"
        handleStyle={{backgroundColor: '#11181E'}}
        adjustToContentHeight={toggle}
        ref={modalizeRef}>
        {action === 'loading' && (
          <Block center middle style={{height: hp(30)}} flex={false}>
            <ActivityIndicator size="large" color="#fff" />
          </Block>
        )}
        {action === 'schedulebroker' && (
          <Block margin={[t5, w5, t5, w5]} flex={false}>
            <Button onPress={() => bookNowBroker()} color="secondary">
              Book Now
            </Button>
            <Button
              style={{marginVertical: 0}}
              onPress={() => bookScheduledBroker()}
              color="secondary">
              Schedule
            </Button>
          </Block>
        )}
        {action === 'brokerdetails' && (
          <Block
            style={{height: hp(35)}}
            padding={[t3, w5, t3, w5]}
            flex={false}>
            <Block flex={false} row center>
              <Block
                alignSelf={'flex-start'}
                flex={false}
                borderRadius={80}
                borderWidth={1}
                borderColor="#fff">
                <ImageComponent
                  name="avatar"
                  height="70"
                  width="70"
                  radius={70}
                />
              </Block>
              <Block flex={false} margin={[0, w5]}>
                <Text white semibold>
                  {strictValidObjectWithKeys(brokerDetails) &&
                    brokerDetails.name}
                </Text>
                <StarRating
                  disabled={false}
                  starSize={20}
                  maxStars={5}
                  fullStarColor={light.secondary}
                  rating={
                    (strictValidObjectWithKeys(brokerDetails) &&
                      brokerDetails.rating) ||
                    0
                  }
                  starStyle={{marginLeft: w1}}
                  containerStyle={{
                    width: wp(20),
                    marginTop: t1,
                  }}
                />
              </Block>
            </Block>
            <Block flex={false} row space={'between'}>
              <Button
                onPress={() =>
                  dialCall(
                    strictValidObjectWithKeys(brokerDetails) &&
                      brokerDetails.phone_no,
                  )
                }
                shadow
                style={{width: wp(43)}}
                color="#434751">
                Phone
              </Button>
              <Button
                onPress={() =>
                  openMessage(
                    strictValidObjectWithKeys(brokerDetails) &&
                      brokerDetails.phone_no,
                  )
                }
                shadow
                style={{width: wp(43)}}
                color="#434751">
                Message
              </Button>
            </Block>
            <Block flex={false}>
              <Button
                onPress={() => viewDetails(brokerDetails)}
                style={{marginTop: hp(0.5)}}
                shadow
                color="#434751">
                View Details
              </Button>
            </Block>
          </Block>
        )}
      </Modalize>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    // ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default BookBroker;
