import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Alert} from 'react-native';
import {useSelector} from 'react-redux';
import {Block, ImageComponent, Text} from '../../components';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Header from '../../common/header';

const TrackBroker = () => {
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
        centerText="Track Your Broker"
        leftIcon={true}
        menu={'left_arrow_icon'}
        menuColor="#fff"
        navigation
      />
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          minZoomLevel={15}
          maxZoomLevel={20}
          zoomControlEnabled
          showsUserLocation={true}
          // provider="google"
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
          {brokerData && (
            <Marker
              title={brokerData[3].name}
              coordinate={{
                latitude: brokerData[3].latitude,
                longitude: brokerData[3].longitude,
              }}>
              <ImageComponent name={'map_person_icon'} height="40" width="40" />
            </Marker>
          )}
        </MapView>
      </View>
    </Block>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
export default TrackBroker;
