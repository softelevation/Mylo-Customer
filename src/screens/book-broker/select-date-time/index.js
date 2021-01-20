import React, {useEffect, useRef, useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {StyleSheet} from 'react-native';
import Header from '../../../common/header';
import {Block, Button, ImageComponent, Input, Text} from '../../../components';
import {t1, t2, w1, w5} from '../../../components/theme/fontsize';
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from '../../../common/date-time-picker';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {useSelector} from 'react-redux';
import {Alert} from 'react-native';
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
  const brokerData = useSelector((state) => state.broker.list.broker.data);
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
      <Header
        menu={'left_arrow_icon'}
        menuColor="#fff"
        navigation
        centerText={'Date and Time'}
      />
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
          <Block flex={false} margin={[t1, w1]}>
            <Block
              row
              center
              space={'between'}
              flex={false}
              borderColorDeafult
              padding={[t1, 0]}
              borderWidth={[0, 0, 1, 0]}>
              <TextArea
                placeholderTextColor={'#00000091'}
                placeholder={'Search Location here'}
              />
              <Icon name="chevron-down-sharp" size={20} />
            </Block>
          </Block>
          <DatePicker
            mode="date"
            initialValue={date}
            setValue={(val) => setDetails({date: val})}
          />
          <DatePicker
            mode="time"
            Title={'Time'}
            initialValue={time}
            setValue={(val) => setDetails({time: val})}
          />
        </Block>
        <Block margin={[0, w5]}>
          <Button onPress={() => nav.navigate('Feedback')} color="secondary">
            Schedule
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
const TextArea = styled(Input)({
  borderWidth: 0,
  padding: 0,
  width: wp(80),
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
