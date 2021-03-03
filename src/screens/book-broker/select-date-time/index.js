import React, {useEffect, useRef, useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {StyleSheet} from 'react-native';
import Header from '../../../common/header';
import {
  Block,
  Button,
  CustomButton,
  ImageComponent,
  Input,
  Text,
} from '../../../components';
import {t1, t2, t3, w1, w5} from '../../../components/theme/fontsize';
import DatePicker from '../../../common/date-time-picker';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {useSelector} from 'react-redux';
import {Alert} from 'react-native';
import {light} from '../../../components/theme/colors';
import AsyncStorage from '@react-native-community/async-storage';
const initialState = {
  date: '',
  time: '',
  location: '',
};
const SelectDateTime = () => {
  const [details, setDetails] = useState(initialState);
  const {date, time} = details;
  const mapRef = useRef();
  const nav = useNavigation();
  const [type, settype] = useState('ASAP');
  const [Loader, setLoader] = useState(false);
  const brokerData = useSelector((state) => state.broker.list.broker.data);
  const socket = useSelector((state) => state.socket.data);

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

          return;
        }

        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.00922 * 1.5,
          longitudeDelta: 0.00421 * 1.5,
          // angle: position.coords.heading,
        };

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
  return (
    <Block>
      <Header centerText={'Current Location'} />
      <Block white>
        <Map center middle secondary flex={false}>
          <MapView
            ref={mapRef}
            minZoomLevel={10}
            maxZoomLevel={14}
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
    </Block>
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
