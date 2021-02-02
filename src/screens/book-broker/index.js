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
import {Block, Button, ImageComponent, Text} from '../../components';
import {Modalize} from 'react-native-modalize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {t1, t3, t5, w1, w5} from '../../components/theme/fontsize';
import StarRating from 'react-native-star-rating';
import {light} from '../../components/theme/colors';
import {useNavigation} from '@react-navigation/native';
import MapView, {Marker} from 'react-native-maps';
import {brokerlistRequest} from '../../redux/action';
import {useDispatch, useSelector} from 'react-redux';
import ActivityLoader from '../../components/activityLoader';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-community/async-storage';

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
  const modalizeRef = useRef();
  const navigation = useNavigation();
  const loaderTime = 1000;
  const dispatch = useDispatch();
  const loader = useSelector((state) => state.broker.list.loading);
  const brokerData = useSelector((state) => state.broker.list.broker.data);
  const socket = useSelector((state) => state.socket.data);
  const mapRef = useRef();
  const [toggle, settoggle] = useState(true);

  useEffect(() => {
    dispatch(brokerlistRequest());
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
        if (!isMapRegionSydney(position.coords)) {
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
    socket.on('refresh_feed', (msg) => {
      console.log('Websocket event received!', msg);
      if (msg.type === 'broker_detail') {
        viewDetailsDialog();
      }
    });
  }, []);

  useEffect(() => {
    onOpen();
    const unsubscribe = navigation.addListener('focus', () => {
      onOpen();
    });

    return unsubscribe;
  }, []);

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

  const viewDetails = () => {
    setAction('loading');
    setTimeout(() => {
      modalizeRef.current?.close();
      navigation.navigate('RequestDetails');
    }, loaderTime);
  };

  const dialCall = () => {
    let phoneNumber = '';

    if (Platform.OS === 'android') {
      phoneNumber = 'tel:1234567890';
    } else {
      phoneNumber = 'telprompt:1234567890';
    }

    Linking.openURL(phoneNumber);
  };

  const openMessage = () => {
    const url =
      Platform.OS === 'android'
        ? 'sms:1-408-555-1212?body=yourMessage'
        : 'sms:1-408-555-1212';

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

      <Modalize
        alwaysOpen={action === 'schedulebroker' ? defaultHeight : 0}
        modalStyle={{backgroundColor: '#292F37'}}
        overlayStyle={{backgroundColor: 'transparent'}}
        handlePosition="inside"
        handleStyle={{backgroundColor: '#11181E'}}
        adjustToContentHeight={toggle}
        ref={modalizeRef}>
        {action === 'loading' && (
          <Block center middle margin={[hp(15), 0, 0, 0]} flex={false}>
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
          <Block margin={[t3, w5, t5, w5]} flex={false}>
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
                  Addison Mccray
                </Text>
                <StarRating
                  disabled={false}
                  starSize={20}
                  maxStars={5}
                  fullStarColor={light.secondary}
                  rating={5}
                  starStyle={{marginLeft: w1}}
                  containerStyle={{
                    width: wp(20),
                    marginTop: t1,
                  }}
                />
              </Block>
            </Block>
            <Block row space={'between'}>
              <Button
                onPress={() => dialCall()}
                shadow
                style={{width: wp(43)}}
                color="#434751">
                Phone
              </Button>
              <Button
                onPress={() => openMessage()}
                shadow
                style={{width: wp(43)}}
                color="#434751">
                Message
              </Button>
            </Block>
            <Block flex={false}>
              <Button
                onPress={() => viewDetails()}
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
