import React, {useRef, useState, useEffect} from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  FlatList,
  Keyboard,
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
import ResponsiveImage from 'react-native-responsive-image';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {t1, t5, w3, w4, w5} from '../../components/theme/fontsize';
import {light} from '../../components/theme/colors';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import MapView, {Marker} from 'react-native-maps';
import {
  brokerlistRequest,
  locationRequest,
  profileRequest,
} from '../../redux/action';
import {useDispatch, useSelector} from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/Ionicons';
import {AdsData} from '../../utils/static-data';
import AlertCompnent from '../../common/AlertCompnent';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {
  strictValidArrayWithLength,
  strictValidString,
  strictValidObjectWithKeys,
} from '../../utils/commonUtils';
import images from '../../assets';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import {SocketContext} from '../../utils/socket';

const BookBroker = (props) => {
  const locationReducer = useSelector((state) => state.location.data);
  const [action, setAction] = useState('');
  const [location, setlocation] = useState({
    latitude: locationReducer.latitude || 151.2099,
    longitude: locationReducer.longitude || -33.865143,
    latitudeDelta: locationReducer.latitudeDelta || 0.2556429502693618,
    longitudeDelta: locationReducer.longitudeDelta || 0.3511001542210579,
  });
  console.log(location);
  const [modal, setmodal] = useState(false);
  const [initialModal, setInitialmodal] = useState(false);
  const [alertdata, setAlert] = useState({
    title: '',
    description: '',
  });
  const [defaultHeight, setDefaultHeight] = useState(350);
  const modalizeRef = useRef();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const loader = useSelector((state) => state.broker.list.loading);
  const brokerData = useSelector((state) => state.broker.list.broker.data);
  const mapRef = useRef();
  const user = useSelector((state) => state.user.profile.user);
  const [isload, setLoader] = useState(false);
  const locationRef = useRef();
  const [selectedLocation, setSelectedLocation] = useState('');
  const [currentAddress, setCurrentAddress] = useState({});
  const socket = React.useContext(SocketContext);
  const [searching, setSearching] = useState({});
  const [callFrom, setCallFrom] = useState('Region');
  const [locationAddress, setLocationAddress] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(remoteMessage, 'remoteMessage');
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      navigation.navigate('Notifications');
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (location.latitude !== 0) {
      dispatch(
        brokerlistRequest({
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      );
    }
    dispatch(profileRequest());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setDefaultHeight(700);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setDefaultHeight(350);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        if (user && !user.name && user && !user.phone_no) {
          setInitialmodal(true);
          setAlert({
            title: 'Message',
            description: 'Please update the profile first',
          });
        } else if (!isMapRegionSydney(position.coords)) {
          setAlert({
            title: 'Message',
            description: 'You can book services only for an address in Sydney.',
          });
          setInitialmodal(true);

          setlocation({
            longitude: 151.2099,
            latitude: -33.865143,
            latitudeDelta: 0.2556429502693618,
            longitudeDelta: 0.3511001542210579,
          });
          dispatch(
            locationRequest({
              longitude: 151.2099,
              latitude: -33.865143,
              latitudeDelta: 0.2556429502693618,
              longitudeDelta: 0.3511001542210579,
            }),
          );
          fetchCoordsAddress(
            position.coords.latitude + ',' + position.coords.longitude,
            true,
          );
          return;
        }

        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.2556429502693618,
          longitudeDelta: 0.3511001542210579,
        };
        dispatch(locationRequest(position.coords));
        fetchCoordsAddress(
          position.coords.latitude + ',' + position.coords.longitude,
          true,
        );
        setlocation(region);
      },

      (error) => console.log('error => ', error),
      {
        enableHighAccuracy: false,
        timeout: 15000,
      },
    );

    return () => Geolocation.clearWatch(watchId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onOpen();
    const unsubscribe = navigation.addListener('focus', () => {
      onOpen();
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onOpen = () => {
    modalizeRef.current?.open();
    setAction('schedulebroker');
  };
  const bookNowBrokerScreen = async (lat, lng) => {
    const token = await AsyncStorage.getItem('token');
    socket.emit('book_now', {
      token: token,
      lat: lat,
      lng: lng,
      location: locationAddress,
    });
    setTimeout(() => {
      setLoader(false);
      setmodal(true);
      setAlert({
        title: 'Success',
        description:
          'Your request has been submitted. Please wait for the broker to confirm.',
      });
    }, 2000);
  };

  const bookNowBroker = async () => {
    setLoader(true);
    setCallFrom('GoogleAutoComplete');
    if (location.latitude !== 0) {
      dispatch(
        brokerlistRequest({
          latitude: searching.geometry.location.lat,
          longitude: searching.geometry.location.lng,
        }),
      );
      bookNowBrokerScreen(
        searching.geometry.location.lat,
        searching.geometry.location.lng,
      );
    }
  };
  const setLocationByPlaceholder = async (details) => {
    setSearching(details);
    await setlocation({
      longitude: details.geometry.location.lng,
      latitude: details.geometry.location.lat,
      latitudeDelta: 0.008045066951822832,
      longitudeDelta: 0.012168176472187042,
    });

    (await mapRef) &&
      mapRef.current.animateToCoordinate({
        longitude: details.geometry.location.lng,
        latitude: details.geometry.location.lat,
        latitudeDelta: 0.008045066951822832,
        longitudeDelta: 0.012168176472187042,
      });
  };

  const getDefaultCoords = () => {
    return {
      longitude: 151.2099,
      latitude: -33.865143,
      latitudeDelta: 0.2556429502693618,
      longitudeDelta: 0.3511001542210579,
    };
  };

  const fetchCoordsAddress = async (searchVal, inital, mapCoords) => {
    console.log(searchVal, inital, mapCoords);
    // this.setState({currentLocationLoading: true});
    const {latitudeDelta, longitudeDelta} = mapCoords || location;
    try {
      const KEY = 'AIzaSyBV1ketkObRpPpeN5H9Ucj73SsZ8fIdQY0';
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${searchVal}&key=${KEY}`;
      const res = await fetch(url);
      const response = await res.json();
      const searchAddressNewList = [];
      console.log(response, 'response');
      response.results.forEach((item) => {
        const newLocation = item.geometry.location;
        const defaultlocation = {
          lat: -33.8650229,
          lng: 151.2099088,
        };
        console.log(
          newLocation,
          item.formatted_address,
          'item.formatted_address',
        );
        if (
          isMapRegionSydney({
            latitude: newLocation.lat,
            longitude: newLocation.lng,
          })
        ) {
          searchAddressNewList.push({
            newLocation,
            address: item.formatted_address,
          });
        } else {
          searchAddressNewList.push({
            newLocation: {
              lat: -33.8650229,
              lng: 151.2099088,
            },
            address: "12 O'Connell St, Sydney NSW 2000, Australia",
          });
        }
      });

      const coords = {
        latitude:
          searchAddressNewList.length > 0
            ? searchAddressNewList[0].newLocation.lat
            : (mapCoords || location || getDefaultCoords()).latitude,
        longitude:
          searchAddressNewList.length > 0
            ? searchAddressNewList[0].newLocation.lng
            : (mapCoords || location || getDefaultCoords()).longitude,
        latitudeDelta,
        longitudeDelta,
      };
      const address =
        searchAddressNewList.length > 0 ? searchAddressNewList[0].address : '';
      const selectedAddress = {
        lat: coords.latitude,
        lng: coords.longitude,
        address,
      };
      (await mapRef) && mapRef.current.animateToCoordinate(coords);
      if (inital) {
        setCurrentAddress(selectedAddress);
        // setlocation(coords);
      } else {
      }
    } catch (e) {
      console.warn('error', e);
    }
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
          {item.name}
        </Text>
        <ResponsiveImage
          source={images[item.image]}
          initHeight={60}
          initWidth={60}
        />
      </Block>
    );
  };
  if (loading) {
    return null;
  }
  return (
    <Block style={{backgroundColor: '#fff'}}>
      <Header
        // centerText=""
        centerText={
          strictValidObjectWithKeys(currentAddress)
            ? currentAddress.address
            : 'Loading...'
        }
      />
      {/* {loader && <ActivityLoader />} */}
      <CustomButton
        style={styles.customLocation}
        onPress={() => {
          mapRef && mapRef.current.animateToCoordinate(location);
        }}
        primary
        flex={false}>
        <ImageComponent
          color={light.secondary}
          name={'nav_icon'}
          height="30"
          width="30"
        />
      </CustomButton>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          zoomControlEnabled
          showsScale
          style={styles.map}
          initialRegion={location}
          onRegionChangeComplete={async (coords) => {
            if (!isMapRegionSydney(coords)) {
              if (isMapRegionSydney(location)) {
                mapRef && mapRef.current.animateToCoordinate(location);
              } else {
                if (callFrom === 'Region') {
                  setCallFrom('Regionss');
                  setlocation({
                    longitude: 151.2099,
                    latitude: -33.865143,
                    latitudeDelta: 0.008045066951822832,
                    longitudeDelta: 0.012168176472187042,
                  });
                  mapRef &&
                    mapRef.current.animateToCoordinate(getDefaultCoords());
                } else {
                  setCallFrom('GoogleAutoComplete');
                }
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
                <Marker coordinate={marker}>
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
        modalStyle={{
          backgroundColor: '#fff',
          flex: 1,
        }}
        overlayStyle={{backgroundColor: 'transparent'}}
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
          keyboardShouldPersistTaps: 'always',
        }}
        handlePosition="inside"
        handleStyle={{backgroundColor: light.darkColor}}
        alwaysOpen={defaultHeight}
        snapPoint={defaultHeight}
        ref={modalizeRef}>
        {action === 'loading' && (
          <Block center middle style={{height: hp(30)}} flex={false}>
            <ActivityIndicator size="large" color="#000" />
          </Block>
        )}
        {action === 'schedulebroker' && (
          <Block margin={[t5, w5, t5, w5]} flex={false}>
            <GooglePlacesAutocomplete
              value={selectedLocation}
              placeholder={'Search Location'}
              placeholderTextColor="#a2a0a0"
              listViewDisplayed="false"
              returnKeyType={'done'}
              ref={locationRef}
              minLength={1}
              autoFocus={false}
              currentLocation={false}
              enablePoweredByContainer={false}
              clearButtonMode={'while-editing'}
              keyboardShouldPersistTaps={'handled'}
              onPress={(data, details = null) => {
                const longitude = details.geometry.location.lng;
                const latitude = details.geometry.location.lat;
                setLocationAddress(data.description);
                setLocationByPlaceholder(details);
                const selectedAddress = {
                  lat: latitude,
                  lng: longitude,
                  address: data.description,
                };
                setCurrentAddress(selectedAddress);
              }}
              styles={{
                textInputContainer: {
                  width: wp('90%%'),
                  height: hp('7%'),
                  borderWidth: 1,
                  alignItems: 'center',
                  borderRadius: 10,
                  borderColor: '#0000001F',
                },
                textInput: {
                  color: '#8A8E99',
                  fontWeight: 'bold',
                  fontSize: 16,
                  backgroundColor: 'transparent',
                  marginTop: hp(0.7),
                },
                description: {
                  color: '#8A8E99',
                  fontSize: 16,
                  zIndex: 99,
                },
                listView: {
                  color: '#8A8E99',
                  fontSize: 14,
                  zIndex: 1000, //To popover the component outwards,
                },
              }}
              renderLeftButton={() => (
                <View style={{paddingLeft: w4}}>
                  <ImageComponent
                    name="search_icon"
                    height={25}
                    width={25}
                    color={light.secondary}
                  />
                </View>
              )}
              textInputProps={{
                // onFocus: () => setDefaultHeight(700),
                // onBlur: () => setDefaultHeight(350),
                onChangeText: (v) => setSelectedLocation(v),
              }}
              fetchDetails={true}
              query={{
                key: 'AIzaSyBf4G3qQTDy6-DN6Tb9m6WzgYCW598EoxU',
                language: 'en',
                components: 'country:Au',
              }}
            />

            <Button
              disabled={
                !strictValidString(selectedLocation) ||
                !strictValidArrayWithLength(brokerData)
              }
              isLoading={isload}
              onPress={() => bookNowBroker()}
              color="secondary">
              Find a Mortgage Broker
            </Button>
            <FlatList
              scrollEnabled={false}
              data={AdsData}
              renderItem={renderAds}
            />
          </Block>
        )}
      </Modalize>
      <Block flex={false}>
        <AlertCompnent
          visible={modal}
          title={alertdata.title}
          description={alertdata.description}
          buttonTitle="OK"
          onPress={() => {
            setmodal(false);
            locationRef.current?.setAddressText('');
            setSelectedLocation('');
            navigation.navigate('Request');
          }}
          // onRequestClose={() => setmodal(false)}
        />
        <AlertCompnent
          visible={initialModal}
          title={alertdata.title}
          description={alertdata.description}
          buttonTitle="OK"
          onPress={() => {
            setInitialmodal(false);
          }}
          // onRequestClose={() => setmodal(false)}
        />
      </Block>
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
  customLocation: {
    position: 'absolute',
    top: hp(10),
    right: w3,
    zIndex: 99,
    height: 50,
    width: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default BookBroker;
