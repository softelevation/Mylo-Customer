import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';

const Ola = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <Image
        source={require('../../../android/ola2.png')}
        style={{width: 250, height: 250, marginHorizontal: 73, marginTop: 70}}
      />
      <Text
        style={{
          fontSize: 25,
          fontWeight: 'bold',
          marginTop: 45,
          textAlign: 'center',
        }}>
        Welcome to Ola
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: '#808080',
          textAlign: 'center',
          marginHorizontal: 25,
          marginTop: 8,
        }}>
        Have a hassle-free booking experience by giving us the following
        permissions.
      </Text>
      <View style={{flexDirection: 'row', marginTop: 15, marginHorizontal: 65}}>
        <Text style={{fontSize: 50, marginVertical: -20}}>.</Text>
        <Text
          style={{
            marginTop: 20,
            marginLeft: 7,
            fontSize: 14,
          }}>
          Loction(for finding available rides)
        </Text>
      </View>
      <View
        style={{flexDirection: 'row', marginTop: -19, marginHorizontal: 65}}>
        <Text style={{fontSize: 50, marginVertical: -20}}>.</Text>
        <Text
          style={{
            marginTop: 20,
            marginLeft: 7,
            fontSize: 14,
          }}>
          Phone(for account security verification)
        </Text>
      </View>
      <View style={{flex: 1}}>
        <TouchableOpacity
          style={{
            borderWidth: -1,
            marginHorizontal: 10,
            marginTop: 150,
            padding: 10,
            backgroundColor: '#53c653',
          }}>
          <Text style={{textAlign: 'center', color: 'white'}}>ALLOW</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Ola;
