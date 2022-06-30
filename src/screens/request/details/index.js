import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  TouchableOpacity,
  Linking,
  Platform,
  FlatList,
  ScrollView,
} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import StarRating from 'react-native-star-rating';
import Header from '../../../common/header';
import {Block, Text, ImageComponent, Button} from '../../../components';
import {light} from '../../../components/theme/colors';
import {t1, t2, w1, w2, w3, w4, w5} from '../../../components/theme/fontsize';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  strictValidArrayWithLength,
  strictValidString,
} from '../../../utils/commonUtils';
const RequestDetails = ({
  route: {
    params: {item},
  },
}) => {
  const [seeMore, setSeeMore] = useState(false);
  const {navigate} = useNavigation();
  const dialCall = () => {
    let phoneNumber = '';

    if (Platform.OS === 'android') {
      phoneNumber = `tel:${item.phone_no}`;
    } else {
      phoneNumber = `telprompt:${item.phone_no}`;
    }

    Linking.openURL(phoneNumber);
  };
  const openMessage = () => {
    const url =
      Platform.OS === 'android'
        ? `sms:${item.phone_no}?body=yourMessage`
        : `sms:${item.phone_no}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };
  const _renderItem = () => {
    return (
      <Block
        white
        center
        row
        borderRadius={10}
        shadow
        margin={[t1, w2]}
        padding={[t2]}
        flex={false}>
        <ImageComponent name="avatar" height="50" width="50" radius={50} />
        <Block margin={[0, w4]}>
          <Block row center>
            <StarRating
              disabled={false}
              starSize={20}
              maxStars={5}
              fullStarColor={light.starColor}
              rating={item.rating || 0}
              starStyle={{marginLeft: w1}}
              containerStyle={{
                marginVertical: t1,
              }}
            />
            <Text margin={[0, w3]} size={14}>
              20 Dec 2020
            </Text>
          </Block>
          <Text size={14}>
            No sound but the muted purring of the room where Case waited.
          </Text>
        </Block>
      </Block>
    );
  };
  return (
    <Block white>
      <Header
        navigation
        menuColor={'#fff'}
        menu={'left_arrow_icon'}
        centerText={'Broker Details'}
      />
      <Block padding={[t2]} color="secondary" flex={false}>
        <Block flex={false} row center>
          <Block
            alignSelf={'flex-start'}
            flex={false}
            borderRadius={80}
            borderWidth={1}
            borderColor="#fff">
            <ImageComponent name="avatar" height="70" width="70" radius={70} />
          </Block>
          <Block flex={false} margin={[0, w5]}>
            <Text style={{width: wp(60)}} white medium>
              {item.name}
            </Text>
            <StarRating
              disabled={false}
              starSize={20}
              maxStars={5}
              fullStarColor={light.starColor}
              rating={item.rating || 1}
              starStyle={{marginLeft: w1}}
              containerStyle={{
                width: wp(20),
                marginVertical: t1,
              }}
            />
          </Block>
        </Block>
        <Block margin={[t1, 0, 0, 0]} flex={false} row space={'between'}>
          <Button
            onPress={() => dialCall()}
            shadow
            style={{width: wp(43)}}
            color="primary">
            Phone
          </Button>
          <Button
            onPress={() => openMessage()}
            shadow
            style={{width: wp(43)}}
            color="primary">
            Message
          </Button>
        </Block>
      </Block>
      <ScrollView>
        <Block flex={false} margin={[t2, w4]}>
          {strictValidString(item.about_me) && (
            <>
              <Text semibold>About Me</Text>
              <Text
                margin={[t1, 0, 0]}
                numberOfLines={seeMore === true ? undefined : 2}
                size={15}
                regular>
                {item.about_me}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSeeMore(!seeMore);
                }}>
                <Text size={14} secondary regular>
                  {seeMore === true ? 'read less' : 'read more'}
                </Text>
              </TouchableOpacity>
            </>
          )}
          <Text margin={[t2, 0, t1, 0]} semibold>
            Details
          </Text>
          {strictValidString(item.phone_no) && (
            <Block margin={[t1, 0, 0]} flex={false} row>
              <Icon style={{width: wp(7)}} name="phone" size={20} />
              <Text size={15} margin={[0, w2]}>
                {item.phone_no}
              </Text>
            </Block>
          )}
          {strictValidString(item.email) && (
            <Block margin={[t1, 0, 0]} flex={false} row>
              <Icon style={{width: wp(7)}} name="email" size={20} />
              <Text size={15} margin={[0, w2]}>
                {item.email}
              </Text>
            </Block>
          )}
          {strictValidString(item.address) && (
            <Block margin={[t1, 0, 0]} flex={false} row>
              <Icon style={{width: wp(7)}} name="map-marker-radius" size={20} />
              <Text size={15} margin={[0, w2]}>
                {item.address}
              </Text>
            </Block>
          )}
        </Block>
        {strictValidArrayWithLength(item.reviews) && (
          <Block margin={[t1, w2, t1]}>
            <Text semibold margin={[0, w2, t1]}>
              Reviews
            </Text>
            <FlatList
              data={item.reviews && item.reviews}
              renderItem={_renderItem}
            />
          </Block>
        )}
        <Block flex={false} center>
          <Button
            onPress={() =>
              navigate('Feedback', {
                item: item,
              })
            }
            shadow
            style={{width: wp(83)}}
            color="primary">
            Submit Feedback
          </Button>
        </Block>
      </ScrollView>
    </Block>
  );
};

export default RequestDetails;
