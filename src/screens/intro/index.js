import {useNavigation} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {StyleSheet} from 'react-native';

import ResponsiveImage from 'react-native-responsive-image';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import images from '../../assets';
import {Block, Button, Text} from '../../components';
import {light} from '../../components/theme/colors';
import Carousel from 'react-native-snap-carousel';
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
        'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ',
      image: images.find_icon,
      subtitle: 'Find your Local Mortgage Broker',
      backgroundColor: '#59b2ab',
    },
    {
      key: 2,
      header: 'Schedule a Meeting',
      text:
        'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ',
      image: images.meet_icon,
      subtitle: 'Schedule a Meeting',
      backgroundColor: '#febe29',
    },
    {
      key: 3,
      header: 'Have your needs met!',
      text:
        'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ',

      image: images.met_icon,
      subtitle: 'Have your needs met!',
      backgroundColor: '#22bcb5',
    },
  ]);

  const _renderItem = ({item}) => {
    return (
      <Block primary>
        <Block flex={0.9} middle center primary>
          <Text color="#282B32" margin={[hp(5), 0]} size={25} center bold>
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
