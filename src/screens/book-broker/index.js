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
  Input,
  Text,
} from '../../components';
import {Modalize} from 'react-native-modalize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {t1, t3, t5, w1, w2, w3, w4, w5} from '../../components/theme/fontsize';
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
import {FlatList} from 'react-native-gesture-handler';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/Ionicons';
import MapViewDirections from 'react-native-maps-directions';

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
  const [isload, setLoader] = useState(false);
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
  console.log(location);
  useEffect(() => {
    const watchId = Geolocation.getCurrentPosition(
      (position) => {
        const {latitude, longitude, accuracy} = position.coords;
        const oneDegreeOfLatitudeInMeters = 2000.32 * 1000;
        const latDelta = accuracy / oneDegreeOfLatitudeInMeters;
        const longDelta =
          accuracy /
          (oneDegreeOfLatitudeInMeters * Math.cos(latitude * (Math.PI / 180)));

        if (user && !user.name) {
          Alert.alert('Please Update the Profile first');
        } else if (!isMapRegionSydney(position.coords)) {
          Alert.alert('You can book services only for an address in Sydney.');
          setlocation({
            longitude: 151.2099,
            latitude: -33.865143,
            latitudeDelta: latDelta,
            longitudeDelta: longDelta,
          });
          return;
        }

        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: latDelta,
          longitudeDelta: longDelta,
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
    setLoader(true);
    const token = await AsyncStorage.getItem('token');
    socket.emit('book_now', token);
    setTimeout(() => {
      setLoader(false);
      Alert.alert('Please wait for the availability of the broker');
    }, 2000);
    // setAction('loading');
    // setTimeout(() => {
    //   modalizeRef.current?.close();
    // }, loaderTime);
  };

  const getDefaultCoords = () => {
    return {
      longitude: 151.2099,
      latitude: -33.865143,
      latitudeDelta: 0.09,
      longitudeDelta: 0.02,
    };
  };

  const renderAds = ({item}) => {
    return (
      <Block
        borderRadius={10}
        row
        primary
        borderColorDeafult
        flex={false}
        borderWidth={2}
        margin={[t1, 0]}
        padding={[hp(3)]}>
        <Text style={{width: wp(65)}} semibold secondary>
          {item}
        </Text>
        <ImageComponent name="run_icon" height={60} width={60} />
      </Block>
    );
  };

  return (
    <Block>
      <Header centerText="" />
      {loader && <ActivityLoader />}
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          minZoomLevel={2}
          maxZoomLevel={8}
          zoomControlEnabled
          showsUserLocation={true}
          showsScale
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
                  latitudeDelta: 0.0046,
                  longitudeDelta: 0.0046,
                });
                mapRef &&
                  mapRef.current.animateToCoordinate(getDefaultCoords());
              }
              return;
            }
          }}>
          <Marker title={'Me'} coordinate={location}>
            <ImageComponent name={'customer_icon'} height="40" width="40" />
          </Marker>
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
        modalStyle={{backgroundColor: '#fff', marginTop: hp(5)}}
        overlayStyle={{backgroundColor: 'transparent'}}
        handlePosition="inside"
        handleStyle={{backgroundColor: light.darkColor}}
        alwaysOpen={350}
        snapPoint={350}
        ref={modalizeRef}>
        {action === 'loading' && (
          <Block center middle style={{height: hp(30)}} flex={false}>
            <ActivityIndicator size="large" color="#000" />
          </Block>
        )}
        {action === 'schedulebroker' && (
          <Block margin={[t5, w5, t5, w5]} flex={false}>
            <Block
              row
              center
              space={'between'}
              flex={false}
              borderColorDeafult
              padding={[t1, 0]}
              color="#F0F1F3"
              borderWidth={1}>
              <Icon
                style={{paddingLeft: w4}}
                name="ios-search"
                color={light.secondary}
                size={30}
              />
              <TextArea
                placeholderTextColor={'#00000091'}
                placeholder={'Search Destination'}
              />
            </Block>
            <Button
              isLoading={isload}
              onPress={() => bookNowBroker()}
              color="secondary">
              Find a Mortgage Broker
            </Button>
            <FlatList
              scrollEnabled={false}
              data={[
                'Purchase your first home at 1.89%',
                'Refinance at 1.94% and get 4k cashback with a major bank',
                'Restructure your portfolio with a major.',
              ]}
              renderItem={renderAds}
            />
          </Block>
        )}
      </Modalize>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    // ...StyleSheet.absoluteFillObject,
    flex: 0.5,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
const TextArea = styled(Input)({
  borderWidth: 0,
  padding: 0,
  width: wp(75),
  fontSize: 20,
  backgroundColor: '#F0F1F3',
});

export default BookBroker;
