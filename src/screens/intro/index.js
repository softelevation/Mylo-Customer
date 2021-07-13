import {useNavigation} from '@react-navigation/native';
import React, {useRef, useState} from 'react';

import ResponsiveImage from 'react-native-responsive-image';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import images from '../../assets';
import {Block, Button, Text} from '../../components';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {w5} from '../../components/theme/fontsize';

const Intro = () => {
  const navigation = useNavigation();
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef();
  const [slides, setstate] = useState([
    {
      key: 1,
      header: 'Find your Local Mortgage Broker',
      text:
        'Tell us where you d like to meet,and Mylo will search through its data base of expert Mylo Brokers to find the one closest to you!',
      // image: images.find_icon,
      image: require('../../../android/c2.png'),
      subtitle: 'Find your Local Mortgage Broker',
      backgroundColor: '#59b2ab',
    },
    {
      key: 2,
      header: 'Schedule a Meeting with Broker',
      text:
        'Find the Right time & Place for you and your Mylo Broker.If you need to reschedule-No Problem! you can do so throught the app. ',
      // image: images.meet_icon,
      image: require('../../../android/c3.png'),
      subtitle: 'Schedule a Meeting',
      backgroundColor: '#febe29',
    },
    {
      key: 3,
      header: 'Have your Needs Met with Our Broker',
      text:
        'Sit back and relax as our expert Mylo Broker handles all you loan needs! ',

      image: require('../../../android/c4.png'),
      subtitle: 'Have your needs met!',
      backgroundColor: '#22bcb5',
    },
  ]);

  const _renderItem = ({item}) => {
    return (
      <Block primary>
        <Block flex={0.9} middle center primary>
          <Text
            margin={[hp(7), 0, 0]}
            size={25}
            style={{
              color: '#57B957',
              fontWeight: 'bold',
              textAlign: 'center',
              width: wp(80),
            }}>
            {item.header}
          </Text>
          <ResponsiveImage
            source={item.image}
            initHeight="210"
            initWidth="230"
            borderRadius={20}
            style={{marginTop: hp(8), marginLeft: -5}}
          />
          <Text
            style={{
              width: wp(80),
              alignSelf: 'center',
              color: '#263238',
              marginHorizontal: 15,
            }}
            margin={[hp(7), 0, 0]}
            size={17}
            height={30}
            bold
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
          marginHorizontal: -3,
          backgroundColor: '#F0F0F0',
          //   // backgroundColor: 'rgba(255, 255, 255, 0.92)',
        }}
        inactiveDotStyle={{
          // Define styles for inactive dots here
          backgroundColor: '#57B957',
        }}
        inactiveDotOpacity={0.9}
        inactiveDotScale={0.9}
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
