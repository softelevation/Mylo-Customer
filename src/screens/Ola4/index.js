import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';

const Ola4 = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <Image
        source={require('./android/ola3.jpg')}
        style={{width: 250, height: 250, marginHorizontal: 73, marginTop: 100}}
      />
      <Text
        style={{
          fontSize: 25,
          fontWeight: 'bold',
          marginTop: 25,
          textAlign: 'center',
        }}>
        GPS turned off
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: '#808080',
          textAlign: 'center',
          marginHorizontal: 25,
          marginTop: 8,
        }}>
        Allow Ola Cabs to turn on your phone GPS for accurate pickup.
      </Text>

      <View style={{flex: 1}}>
        <TouchableOpacity
          style={{
            borderWidth: -1,
            marginHorizontal: 10,
            marginTop: 215,
            padding: 10,
            backgroundColor: '#53c653',
          }}>
          <Text style={{textAlign: 'center', color: 'white'}}>TURN ON GPS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Ola4;
