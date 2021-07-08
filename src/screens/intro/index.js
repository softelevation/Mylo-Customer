import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';

import ResponsiveImage from 'react-native-responsive-image';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import images from '../../assets';
import {Block, Button, Text} from '../../components';
import {light} from '../../components/theme/colors';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {w5} from '../../components/theme/fontsize';
import Geolocation from '@react-native-community/geolocation';

const Intro = () => {
  const navigation = useNavigation();
  const [activeSlide, setActiveSlide] = useState();
  const carouselRef = useRef();
  const [slides, setstate] = useState([
    {
      key: 1,
      header: 'Find your Local Mortgage Broker',
      text:
        'Tell us where you d like to meet,and Mylo will search through its data base of expert Mylo Brokers to find the one closest to you!',
      image: images.find_icon,
      subtitle: 'Find your Local Mortgage Broker',
      backgroundColor: '#59b2ab',
    },
    {
      key: 2,
      header: 'Schedule a Meeting',
      text:
        'Find the Right time & Place for you and your Mylo Broker.If you need to reschedule-No Problem! you can do so throught the app. ',
      image: images.meet_icon,
      subtitle: 'Schedule a Meeting',
      backgroundColor: '#febe29',
    },
    {
      key: 3,
      header: 'Have your needs met!',
      text:
        'Sit back and relax as our expert Mylo Broker handles all you loan needs! ',

      image: images.met_icon,
      subtitle: 'Have your needs met!',
      backgroundColor: '#22bcb5',
    },
  ]);

  useEffect(() => {
    const watchId = Geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
    return () => Geolocation.clearWatch(watchId);
  }, []);

  const _renderItem = ({item}) => {
    return (
      <Block primary>
        <Block flex={0.9} middle center primary>
          <Text color="secondary" margin={[hp(5), 0]} size={25} center bold>
            {item.header}
          </Text>
          <ResponsiveImage
            source={item.image}
            initHeight="260"
            initWidth="370"
            borderRadius={20}
          />
          <Text
            style={{width: wp(90), alignSelf: 'center'}}
            margin={[hp(5), 0, 0]}
            size={16}
            center
            regular>
            {item.text}
          </Text>
        </Block>
      </Block>
    );
  };

  return (
    <Block primary>
      <Carousel
        ref={carouselRef}
        autoplay
        autoplayInterval={3000}
        useScrollView
        lockScrollWhileSnapping
        data={slides}
        renderItem={_renderItem}
        sliderWidth={wp(100)}
        itemWidth={wp(100)}
        layout={'default'}
        // inactiveSlideScale={1}
        enableSnap
        onSnapToItem={(index) => setActiveSlide(index)}
      />
      <Pagination
        dotsLength={slides.length}
        activeDotIndex={activeSlide}
        // containerStyle={{backgroundColor: 'rgba(0, 0, 0, 0.75)'}}
        dotStyle={{
          width: 12,
          height: 12,
          borderRadius: 9,
          marginHorizontal: 8,
          backgroundColor: '#53c653',

          //   // backgroundColor: 'rgba(255, 255, 255, 0.92)',
        }}
        inactiveDotStyle={{
          // Define styles for inactive dots here
          backgroundColor: '#d3d3d3',
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
      {activeSlide === 2 ? (
        <Block flex={false} padding={[0, w5]} row center space={'between'}>
          {/* <Button style={{width: wp(42)}} color="transparent">
            Back
          </Button> */}
          <Text style={{height: hp(10)}} />
          <Button
            onPress={() => navigation.navigate('Login')}
            style={{width: wp(42)}}
            color="secondary">
            Continue
          </Button>
        </Block>
      ) : (
        <Block flex={false} padding={[0, w5]} row center space={'between'}>
          <Text style={{height: hp(10)}} />
        </Block>
      )}
    </Block>
  );
};
export default Intro;
