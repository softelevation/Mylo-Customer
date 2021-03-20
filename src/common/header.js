import React from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Block, CustomButton, ImageComponent, Text} from '../components';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import {
  DrawerActions,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
const Header = ({
  leftIcon,
  centerText,
  rightText,
  menu,
  menuColor,
  navigation,
  rightIcon,
  rightColor,
  rightPress,
}) => {
  const nav = useNavigation();
  return (
    <Block
      center
      row
      space={'between'}
      padding={[hp(1.5)]}
      secondary
      flex={false}>
      {leftIcon ? (
        <CustomButton
          flex={1}
          left
          middle
          onPress={() =>
            navigation
              ? nav.dispatch(StackActions.pop())
              : nav.dispatch(DrawerActions.openDrawer())
          }>
          <ImageComponent
            name={menu}
            height="25"
            width="25"
            color={menuColor}
          />
        </CustomButton>
      ) : (
        <CustomButton flex={1} left middle />
      )}
      <Block flex={false} center middle>
        <Text
          semibold
          style={{width: wp(80)}}
          transform="uppercase"
          center
          white>
          {centerText}
        </Text>
      </Block>
      <CustomButton onPress={rightPress} right middle>
        <ImageComponent
          name={rightIcon}
          height="25"
          width="25"
          color={rightColor}
        />
      </CustomButton>
    </Block>
  );
};

Header.defaultProps = {
  centerText: 'Home',
  rightText: '',
  leftIcon: true,
  menu: 'menu_icon',
  menuColor: '',
  rightColor: '',
  rightIcon: '',
};
Header.propTypes = {
  centerText: PropTypes.string,
  rightIcon: PropTypes.string,
  leftIcon: PropTypes.bool,
  menu: PropTypes.string,
  menuColor: PropTypes.string,
  rightColor: PropTypes.string,
  rightPress: PropTypes.func.isRequired,
};
export default Header;
