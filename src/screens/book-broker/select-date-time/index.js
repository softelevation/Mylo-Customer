import React, {useEffect, useRef, useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Platform, StyleSheet} from 'react-native';
import Header from '../../../common/header';
import {
  Block,
  Button,
  CustomButton,
  ImageComponent,
  Input,
  Text,
} from '../../../components';
import {t1, t2, t3, w1, w3, w5} from '../../../components/theme/fontsize';
import DatePicker from '../../../common/date-time-picker';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {useSelector} from 'react-redux';
import {Alert} from 'react-native';
import {light} from '../../../components/theme/colors';
import AsyncStorage from '@react-native-community/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {strictValidObjectWithKeys} from '../../../utils/commonUtils';
const initialState = {
  date: '',
  time: '',
  location: '',
};

const initialMapState = {
  searchAddress: null,
  waiting: false,
  searchAddressList: [],
};
const SelectDateTime = () => {
  const [details, setDetails] = useState(initialState);
  const {date, time} = details;
  const mapRef = useRef();
  const nav = useNavigation();
  const [type, settype] = useState('ASAP');
  const [toggle, setToggle] = useState(false);
  const [Loader, setLoader] = useState(false);
  const brokerData = useSelector((state) => state.broker.list.broker.data);
  const socket = useSelector((state) => state.socket.data);
  const [currentAddress, setCurrentAddress] = useState({});
  const [state, setState] = useState(initialMapState);

  const {waiting, searchAddress, searchAddressList} = state;
  const [location, setlocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.09,
    longitudeDelta: 0.02,
  });

  const getDefaultCoords = () => {
    return {
      longitude: 151.2099,
      latitude: -33.865143,
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
    setLoader(true);
    const token = await AsyncStorage.getItem('token');
    socket.emit('book_now', token);
    setTimeout(() => {
      setLoader(false);
      Alert.alert('Please wait for the availability of the broker');
    }, 2000);
  };

  const checkType = () => {
    if (type === 'ASAP') {
      bookNowBroker();
    } else {
      Alert.alert('Coming Soon');
    }
  };

  useEffect(() => {
    const watchId = Geolocation.getCurrentPosition(
      (position) => {
        if (!isMapRegionSydney(position.coords)) {
          // Alert.alert('You can book services only for an address in Sydney.');
          fetchCoordsAddress(
            position.coords.latitude + ',' + position.coords.longitude,
            true,
          );
          return;
        }

        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.00922 * 1.5,
          longitudeDelta: 0.00421 * 1.5,
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
        enableHighAccuracy: true,
        timeout: 15000,
      },
    );

    return () => Geolocation.clearWatch(watchId);
  }, []);

  const fetchCoordsAddress = async (searchVal, inital, mapCoords) => {
    // this.setState({currentLocationLoading: true});
    const {latitudeDelta, longitudeDelta} = mapCoords || location;
    try {
      const KEY = 'AIzaSyBV1ketkObRpPpeN5H9Ucj73SsZ8fIdQY0';
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${searchVal}&key=${KEY}`;
      const res = await fetch(url);
      const response = await res.json();
      const searchAddressNewList = [];

      response.results.forEach((item) => {
        const newLocation = item.geometry.location;
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
        }
        // searchAddressNewList.push({
        //   newLocation,
        //   address: item.formatted_address,
        // });
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
      if (inital) {
        // this.setState({
        //   coords,
        //   selectedAddress,
        //   currentLocation: selectedAddress,
        //   latitudeDelta,
        //   longitudeDelta,
        //   currentLocationLoading: false,
        // });
        setCurrentAddress(selectedAddress);
        setlocation(coords);
      } else {
        // this.setState({
        //   coords,
        //   selectedAddress,
        //   latitudeDelta,
        //   longitudeDelta,
        //   currentLocationLoading: false,
        // });
      }
    } catch (e) {
      console.warn('error', e);
    }
  };

  const fetchGoogleAddress = async (_searchAddressTxt) => {
    if (!waiting && _searchAddressTxt && _searchAddressTxt.length > 3) {
      const waitingPromise = new Promise((resolve) =>
        setTimeout(() => resolve(), 300),
      );
      // this.setState({sea: _searchAddressTxt, waiting: true});
      setState({
        searchAddress: _searchAddressTxt,
        waiting: true,
      });
      await waitingPromise;
      try {
        const KEY = 'AIzaSyBV1ketkObRpPpeN5H9Ucj73SsZ8fIdQY0';
        const encoddedAddress = encodeURI(searchAddress);
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoddedAddress}&key=${KEY}&sensor=false&components=country:FR`;
        const res = await fetch(url);
        const response = await res.json();
        console.log(response, 'response');
        const searchAddressVal = {};
        response.results.forEach((item) => {
          searchAddressVal[item.formatted_address] = {
            address: item.formatted_address,
            lat: item.geometry.location.lat,
            lng: item.geometry.location.lng,
          };
        });
        setState({
          ...state,
          searchAddress: _searchAddressTxt,
          waiting: false,
          searchAddressList: searchAddressVal,
        });
      } catch (e) {
        console.warn('google address fetch error:', e);
        setState({
          ...state,
          waiting: false,
        });
      }
    } else if (!_searchAddressTxt) {
      setState({
        ...state,
        waiting: false,
        searchAddressList: {},
        searchAddress: '',
      });
    } else {
      setState({...state, searchAddress: _searchAddressTxt});
    }
  };
  console.log(state, 'state');

  const renderSearchAddress = () => {
    return (
      <>
        {Object.values(searchAddressList).map((add) => {
          return (
            <Block flex={false}>
              <Text>{add.address}</Text>
            </Block>
          );
        })}
      </>
    );
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
      <KeyboardAwareScrollView style={{backgroundColor: '#fff'}}>
        {toggle && (
          <Block padding={[t1, w3]} flex={false}>
            <Input
              value={searchAddress}
              placeholder="Search Location"
              onChangeText={(v) => fetchGoogleAddress(v)}
            />
            {strictValidObjectWithKeys(searchAddressList) &&
              renderSearchAddress()}
          </Block>
        )}
        <Block white>
          <Map center middle secondary flex={false}>
            <MapView
              ref={mapRef}
              minZoomLevel={2}
              maxZoomLevel={8}
              showsUserLocation={true}
              provider="google"
              style={styles.map}
              initialRegion={location}
              onRegionChangeComplete={async (coords) => {
                if (!isMapRegionSydney(coords)) {
                  if (isMapRegionSydney(location)) {
                    mapRef && mapRef.current.animateToCoordinate(location);
                  } else {
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
              {brokerData &&
                brokerData.map((item, index) => {
                  const marker = {
                    latitude: item.latitude,
                    longitude: item.longitude,
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
          </Map>
          <Block padding={[t2]} flex={false}>
            <Block row middle center flex={false}>
              <CustomButton
                onPress={() => settype('ASAP')}
                color={type === 'ASAP' ? light.secondary : light.headerColor}
                padding={[hp(1.5), wp(10)]}
                style={{
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 10,
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
                  initialValue={date}
                  setValue={(val) => setDetails({...details, date: val})}
                />
                <DatePicker
                  mode="time"
                  Title={'Time'}
                  initialValue={time}
                  setValue={(val) => setDetails({...details, time: val})}
                />
              </>
            )}
          </Block>
          <Block margin={[0, w5]}>
            <Button
              isLoading={Loader}
              onPress={() => checkType()}
              color="secondary">
              Book Now
            </Button>
          </Block>
        </Block>
      </KeyboardAwareScrollView>
    </>
  );
};
const Map = styled(Block)({
  height: hp(30),
  borderBottomLeftRadius: 20,
  borderBottomRightRadius: 20,
});

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
export default SelectDateTime;
