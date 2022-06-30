import React from 'react';
import {StyleSheet, ActivityIndicator, View} from 'react-native';
import {light} from './theme/colors';

const styles = StyleSheet.create({
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'rgb(255,255,255)',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    zIndex: 100,
  },
});

const ActivityLoader = () => {
  return (
    // <ActivityIndicator
    //   size="large"
    //   color={light.secondary}
    //   style={styles.loader}
    // />
    <View
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        zIndex: 1000,
      }}>
      <View
        style={{
          borderRadius: 10,
          shadowColor: 'black',
          backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 25,
          shadowOffset: {width: 0, height: 2},
          maxWidth: 150,
          maxHeight: 150,
          shadowOpacity: 0.4,
          shadowRadius: 4,
          elevation: 5,
        }}>
        <ActivityIndicator size={'large'} color={light.secondary} />
      </View>
    </View>
  );
};

export default ActivityLoader;
