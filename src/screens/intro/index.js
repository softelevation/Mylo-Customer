import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import ResponsiveImage from 'react-native-responsive-image';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import images from '../../assets';
import {Block, ImageComponent, Text} from '../../components';
import Icon from 'react-native-vector-icons/Ionicons';
import {light} from '../../components/theme/colors';
const slides = [
  {
    key: 1,
    title: 'Title 1',
    text: 'Find your Local Mortgage Broker',
    image: images.intro1_icon,
    backgroundColor: '#59b2ab',
  },
  {
    key: 2,
    title: 'Title 2',
    text: 'Schedule a Meeting',
    image: images.intro1_icon,
    backgroundColor: '#febe29',
  },
  {
    key: 3,
    title: 'Rocket guy',
    text: 'Have your needs met!',
    image: images.intro1_icon,
    backgroundColor: '#22bcb5',
  },
];
const styles = StyleSheet.create({
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: light.secondary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  //[...]
});

const Intro = () => {
  const navigation = useNavigation();
  const _renderDoneButton = () => {
    return (
      <Block style={styles.buttonCircle}>
        <Icon name="md-checkmark" color="rgba(255, 255, 255, .9)" size={24} />
      </Block>
    );
  };
  const _renderNextButton = () => {
    return (
      <Block style={styles.buttonCircle}>
        <Icon
          name="md-chevron-forward"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </Block>
    );
  };
  const _renderPrevButton = () => {
    return (
      <Block style={styles.buttonCircle}>
        <Icon
          name="md-chevron-back"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </Block>
    );
  };
  const _renderSkipButton = () => {
    return (
      <Block flex={false} padding={[hp(1), 0]}>
        <Text white>Skip</Text>
      </Block>
    );
  };
  const _renderItem = ({item}) => {
    return (
      <Block center primary>
        <Block flex={0.7} middle center primary>
          <ResponsiveImage
            source={item.image}
            initHeight="250"
            initWidth="350"
            borderRadius={20}
          />
        </Block>

        <Text style={{width: wp(80)}} size={20} left semibold>
          {item.text}
        </Text>
      </Block>
    );
  };
  const _onDone = () => {
    navigation.navigate('Login');
  };

  return (
    <AppIntroSlider
      renderItem={_renderItem}
      data={slides}
      onDone={_onDone}
      onSkip={_onDone}
      showDoneButton
      showSkipButton
      showNextButton
      showPrevButton
      renderDoneButton={_renderDoneButton}
      renderNextButton={_renderNextButton}
      renderPrevButton={_renderPrevButton}
      renderSkipButton={_renderSkipButton}
      dotStyle={{backgroundColor: light.headerColor}}
      activeDotStyle={{backgroundColor: light.secondary}}
    />
  );
};
export default Intro;
