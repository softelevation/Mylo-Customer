/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {PermissionsAndroid, Platform, StyleSheet} from 'react-native';
import Header from '../../../common/header';
import {
  Block,
  Button,
  CustomButton,
  ImageComponent,
  Text,
} from '../../../components';
import {t1, t2, w3, w5} from '../../../components/theme/fontsize';
import DatePicker from '../../../common/date-time-picker';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {useSelector} from 'react-redux';
import {light} from '../../../components/theme/colors';
import AsyncStorage from '@react-native-community/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Alerts, strictValidObjectWithKeys} from '../../../utils/commonUtils';
import AlertCompnent from '../../../common/AlertCompnent';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import moment from 'moment';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import useHardwareBack from '../../../components/usehardwareBack';
import TimeZone from 'react-native-timezone';
import io from 'socket.io-client';

const initialState = {
  date: '',
  time: '',
  location: '',
};
const SelectDateTime = () => {
  const [dateAndtime, setDetails] = useState(initialState);
  const {date, time} = dateAndtime;
  const mapRef = useRef();
  const [type, settype] = useState('ASAP');
  const [toggle, setToggle] = useState(false);
  const [Loader, setLoader] = useState(false);
  const brokerData = useSelector((state) => state.broker.list.broker.data);
  const locationReducer = useSelector((state) => state.location.data);
  const [currentAddress, setCurrentAddress] = useState({});
  const [modal, setmodal] = useState(false);
  const [selectLocation, setSelectLocation] = useState('');
  const [alertdata, setAlert] = useState({
    title: '',
    description: '',
  });
  const [location, setlocation] = useState({
    latitude: locationReducer.latitude || 151.2099,
    longitude: locationReducer.longitude || -33.865143,
    latitudeDelta: locationReducer.latitudeDelta || 0.2556429502693618,
    longitudeDelta: locationReducer.longitudeDelta || 0.3511001542210579,
  });
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.navigate('Maps');
    return true;
  };

  useHardwareBack(handleBack);

  const getDefaultCoords = () => {
    return {
      longitude: 151.2099,
      latitude: -33.865143,
      latitudeDelta: 0.2556429502693618,
      longitudeDelta: 0.3511001542210579,
    };
  };

  const isMapRegionSydney = (coords) => {
    return (
      coords.longitude >= 148.601105 &&
      coords.longitude <= 151.75 &&
      coords.latitude >= -35.353333 &&
      coords.latitude <= -31.083332
    );
  };
  const bookNowBroker = async () => {
    const socket = io('http://3.235.91.25:3000');

    setLoader(true);
    const token = await AsyncStorage.getItem('token');
    socket.emit('book_now', {
      token: token,
      lat: location.latitude,
      lng: location.longitude,
      location: currentAddress.address,
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

  const formatDate = (a) => {
    return moment(a).format('YYYY-MM-DD');
  };
  const formatTime = (a) => {
    return moment(a).format('HH:mm:ss');
  };
  const formatViewDate = (d) => {
    return moment(d).format('DD MMMM YYYY');
  };
  const formatCheckDate = (d) => {
    //1995, 11, 17
    return moment(d).format('DD MM YYYY');
  };
  const formatViewTime = (a) => {
    return moment(a).format('hh:mm a');
  };
  const formatViewTimeBy24 = (a) => {
    const convertedTime = moment(a).format('HH:mm:ss: A');
    return moment(convertedTime, 'HH:mm:ss: A').diff(
      moment().startOf('day'),
      'seconds',
    );
  };
  const formatSendDate = (b) => {
    return moment(b).format('YYYY-MM-DD hh:mm:ss');
  };
  const checkType = async () => {
    const timeZone = await TimeZone.getTimeZone().then((zone) => zone);
    const socket = io('http://3.235.91.25:3000');

    if (type === 'ASAP') {
      bookNowBroker();
    } else {
      if (!date) {
        setmodal(true);
        setAlert({
          title: 'Error',
          description: 'Please choose date from the date picker',
        });
      }
      if (!time) {
        setmodal(true);
        setAlert({
          title: 'Error',
          description: 'Please choose time from the time picker',
        });
      } else {
        setLoader(true);
        const token = await AsyncStorage.getItem('token');
        socket.emit('book_now', {
          token: token,
          assign_at: `${formatDate(date)} ${formatTime(time)}`,
          lat: location.latitude,
          lng: location.longitude,
          location: currentAddress.address,
          time_zone: timeZone,
        });
        console.log({
          token: token,
          assign_at: `${formatDate(date)} ${formatTime(time)}`,
          lat: location.latitude,
          lng: location.longitude,
          location: currentAddress.address,
          time_zone: timeZone,
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
      }
    }
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        if (!isMapRegionSydney(position.coords)) {
          let region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.2556429502693618,
            longitudeDelta: 0.3511001542210579,
            // angle: position.coords.heading,
          };
          fetchCoordsAddress(
            position.coords.latitude + ',' + position.coords.longitude,
            true,
            region,
          );
          return;
        }

        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.2556429502693618,
          longitudeDelta: 0.3511001542210579,
          // angle: position.coords.heading,
        };
        fetchCoordsAddress(
          position.coords.latitude + ',' + position.coords.longitude,
          true,
        );

        setlocation(region);
      },
      (error) => console.log(error),
      {
        enableHighAccuracy: false,
        timeout: 15000,
      },
    );
  };
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Mylo App Location Permission',
          message:
            'Mylo App App needs access to your location ' +
            'so you can access the geolocation service.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getLocation();
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === 'ios') {
        getLocation();
      } else {
        requestCameraPermission();
      }
    }, []),
  );
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
        setlocation(coords);
      } else {
      }
    } catch (e) {
      console.warn('error', e);
    }
  };

  const checkTimeVal = (val) => {
    const selectedTime = formatViewTimeBy24(val);
    const afterOneHour = formatViewTimeBy24(
      new Date(new Date().setHours(new Date().getHours() + 1)),
    );
    const selectedDate = formatCheckDate(date);
    const currentDate = formatCheckDate(new Date());

    if (selectedTime >= afterOneHour && selectedDate === currentDate) {
      setDetails({...dateAndtime, time: val});
    } else if (selectedDate !== currentDate) {
      setDetails({...dateAndtime, time: val});
    } else {
      setDetails({...dateAndtime, time: ''});
      Alerts(
        'Error',
        'Please select time after 1 hour from the current time',
        light.warning,
      );
    }
  };

  const checkDate = (val) => {
    const selectedDate = formatCheckDate(val);
    const currentDate = formatCheckDate(new Date());
    const selectedTime = formatViewTimeBy24(time);
    const afterOneHour = formatViewTimeBy24(
      new Date(new Date().setHours(new Date().getHours() + 1)),
    );
    if (selectedDate === currentDate && selectedTime >= afterOneHour) {
      setDetails({...dateAndtime, date: val});
    } else if (selectedDate === currentDate && selectedTime < afterOneHour) {
      setDetails({...dateAndtime, date: val, time: ''});
    } else {
      setDetails({...dateAndtime, date: val});
    }
  };

  const changeLocation = async (data, details) => {
    const longitude = details.geometry.location.lng;
    const latitude = details.geometry.location.lat;
    await setlocation({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.2556429502693618,
      longitudeDelta: 0.3511001542210579,
    });
    (await mapRef) &&
      mapRef.current.animateToCoordinate({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.2556429502693618,
        longitudeDelta: 0.3511001542210579,
      });
    const selectedAddress = {
      lat: latitude,
      lng: longitude,
      address: data.description,
    };
    setCurrentAddress(selectedAddress);
  };

  return (
    <>
      <Header
        rightIcon="down_icon"
        rightPress={() => setToggle(!toggle)}
        rightColor="#fff"
        centerText={
          strictValidObjectWithKeys(currentAddress)
            ? currentAddress.address
            : 'Loading...'
        }
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        style={{backgroundColor: '#fff'}}>
        {toggle && (
          <Block padding={[t1, w3]} flex={false}>
            <GooglePlacesAutocomplete
              value={selectLocation}
              placeholder={'Search Location'}
              placeholderTextColor="#a2a0a0"
              listViewDisplayed="false"
              returnKeyType={'done'}
              // ref={locationRef}
              minLength={1}
              autoFocus={false}
              currentLocation={false}
              enablePoweredByContainer={false}
              clearButtonMode={'while-editing'}
              keyboardShouldPersistTaps={'handled'}
              onPress={(data, details = null) => {
                changeLocation(data, details);
              }}
              fetchDetails={true}
              styles={{
                textInputContainer: {
                  marginTop: hp(0.8),
                  marginBottom: hp(0.5),
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  borderColor: 'rgba(0,0,0,.2)',
                  color: '#8A8E99',
                  fontSize: 16,
                },
                textInput: {
                  color: '#8A8E99',
                  fontWeight: 'bold',
                  fontSize: 16,
                  backgroundColor: 'transparent',
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
              query={{
                key: 'AIzaSyBf4G3qQTDy6-DN6Tb9m6WzgYCW598EoxU',
                language: 'en',
                components: 'country:Au',
              }}
            />
          </Block>
        )}
        <Block white>
          <Block
            style={styles.MapContainer}
            center
            middle
            secondary
            flex={false}>
            <MapView
              ref={mapRef}
              // showsUserLocation={true}
              provider="google"
              style={styles.map}
              initialRegion={location}
              onRegionChangeComplete={async (coords) => {
                if (!isMapRegionSydney(coords)) {
                  if (
                    !strictValidObjectWithKeys(currentAddress) &&
                    !currentAddress.address &&
                    isMapRegionSydney(location)
                  ) {
                    mapRef && mapRef.current.animateToCoordinate(location);
                  } else {
                    !strictValidObjectWithKeys(currentAddress) &&
                      !currentAddress.address &&
                      mapRef &&
                      mapRef.current.animateToCoordinate(getDefaultCoords());
                  }
                  return;
                }
                if (currentAddress && !currentAddress.address) {
                  fetchCoordsAddress(
                    coords.latitude + ',' + coords.longitude,
                    true,
                    coords,
                  );
                }
              }}>
              <Marker
                title={
                  strictValidObjectWithKeys(currentAddress)
                    ? currentAddress.address
                    : ''
                }
                coordinate={location}>
                <ImageComponent name={'customer_icon'} height="40" width="40" />
              </Marker>
              {brokerData &&
                brokerData.map((item, index) => {
                  const marker = {
                    latitude: item.latitude,
                    longitude: item.longitude,
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
          </Block>
          <Block padding={[t2]} flex={false}>
            <Block row middle center flex={false}>
              <CustomButton
                onPress={() => settype('ASAP')}
                color={type === 'ASAP' ? light.secondary : light.headerColor}
                padding={[hp(1.5), wp(10)]}
                style={{
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 10,
                  marginTop: 130,
                }}
                flex={false}>
                <Text white size={18}>
                  ASAP
                </Text>
              </CustomButton>
              <CustomButton
                onPress={() => settype('LATER')}
                color={type === 'LATER' ? light.secondary : light.headerColor}
                padding={[hp(1.5), wp(10)]}
                style={{
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                  marginTop: 130,
                }}
                flex={false}>
                <Text white size={18}>
                  LATER
                </Text>
              </CustomButton>
            </Block>

            {type === 'LATER' && (
              <>
                <DatePicker
                  mode="date"
                  initialValue={date ? formatViewDate(date) : 'Select Date'}
                  setValue={(val) => checkDate(val)}
                />
                <DatePicker
                  mode="time"
                  Title={'Time'}
                  initialValue={time ? formatViewTime(time) : 'Select Time'}
                  setValue={(val) => checkTimeVal(val)}
                />
              </>
            )}
          </Block>
          <Block margin={[0, w5]}>
            <Button
              isLoading={Loader}
              onPress={() => checkType()}
              disabled={type === 'ASAP' ? false : !time || !date}
              color="secondary">
              {type === 'ASAP' ? 'Book Now' : 'Schedule Now'}
            </Button>
          </Block>
        </Block>
      </KeyboardAwareScrollView>
      <Block flex={false}>
        <AlertCompnent
          visible={modal}
          title={alertdata.title}
          description={alertdata.description}
          buttonTitle="OK"
          onPress={() => {
            setDetails({
              date: '',
              time: '',
              location: '',
            });
            setlocation({
              latitude: locationReducer.latitude,
              longitude: locationReducer.longitude,
              latitudeDelta:
                locationReducer.latitudeDelta || 0.2556429502693618,
              longitudeDelta:
                locationReducer.longitudeDelta || 0.3511001542210579,
            });
            requestCameraPermission();
            setSelectLocation('');
            setToggle(false);
            setmodal(false);
          }}
          // onRequestClose={() => setmodal(false)}
        />
      </Block>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    height: 380,
  },
  MapContainer: {
    height: hp(34),
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});
export default SelectDateTime;
