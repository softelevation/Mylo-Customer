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
const RequestDetails = () => {
  const [seeMore, setSeeMore] = useState(false);
  const nav = useNavigation();
  const dialCall = () => {
    let phoneNumber = '';

    if (Platform.OS === 'android') {
      phoneNumber = 'tel:1234567890';
    } else {
      phoneNumber = 'telprompt:1234567890';
    }

    Linking.openURL(phoneNumber);
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
              fullStarColor={light.darkColor}
              rating={5}
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
            <Text white semibold>
              Addison Mccray
            </Text>
            <StarRating
              disabled={false}
              starSize={20}
              maxStars={5}
              fullStarColor={light.darkColor}
              rating={5}
              starStyle={{marginLeft: w1}}
              containerStyle={{
                width: wp(20),
                marginVertical: t1,
              }}
            />
            <Text semibold white size={14}>
              location name
            </Text>
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
            onPress={() =>
              nav.navigate('ChatDetails', {
                userName: 'Addison Mccray',
              })
            }
            shadow
            style={{width: wp(43)}}
            color="primary">
            Chat
          </Button>
        </Block>
      </Block>
      <ScrollView>
        <Block flex={false} margin={[t2, w4]}>
          <Text
            numberOfLines={seeMore === true ? undefined : 2}
            size={12}
            regular>
            Then a mist closed over the black water and the robot gardener.
            Still it was a steady pulse of pain midway down his spine. The two
            surviving Founders of Zion were old men, old with the movement of
            the train, their high heels like polished hooves against the gray
            metal of the car’s floor. Still it was a yearly pilgrimage to Tokyo,
            where genetic surgeons reset the code of his DNA, a procedure
            unavailable in Chiba. Its hands were holograms that altered to match
            the convolutions of the previous century. It was disturbing to think
            of the Flatline as a paid
          </Text>
          <TouchableOpacity
            onPress={() => {
              setSeeMore(!seeMore);
            }}>
            <Text size={12} secondary regular>
              {seeMore === true ? 'read less' : 'read more'}
            </Text>
          </TouchableOpacity>
        </Block>
        <Block margin={[t1, w2]}>
          <Text margin={[0, w2]}>Reviews</Text>
          <FlatList data={['1', '2']} renderItem={_renderItem} />
        </Block>
      </ScrollView>
    </Block>
  );
};

export default RequestDetails;
