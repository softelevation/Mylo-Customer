import React from 'react';
import {Block, CustomButton, ImageComponent, Text} from '../../components';
import Header from '../../common/header';
import {FlatList} from 'react-native';
import {t1, t2, w2, w3, w4, w5} from '../../components/theme/fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {ChatData} from '../../utils/static-data';
import {useNavigation} from '@react-navigation/native';

const Chat = () => {
  const navigation = useNavigation();
  const _renderItem = ({item}) => {
    return (
      <CustomButton
        onPress={() =>
          navigation.navigate('ChatDetails', {
            userName: item.name,
          })
        }
        row
        center
        space={'between'}
        flex={false}
        borderRadius={10}
        white
        shadow
        padding={[t2, w2]}
        margin={[t1, w4]}>
        <Block center row flex={false}>
          <ImageComponent name="avatar" height="50" width="50" radius={50} />
          <Block style={{width: wp(48)}} margin={[0, w3]} flex={false}>
            <Text semibold size={16}>
              {item.name}
            </Text>
            <Text
              grey={item.noti <= 0}
              numberOfLines={2}
              margin={[hp(0.5), 0, 0, 0]}
              size={12}>
              {item.message}
            </Text>
          </Block>
        </Block>
        <Block center middle margin={[0, w5]} flex={false}>
          <Text grey semibold size={12}>
            {item.time}
          </Text>
          {item.noti > 0 ? (
            <Block
              center
              middle
              flex={false}
              borderRadius={20}
              secondary
              margin={[t1, 0, 0, 0]}
              style={{height: 20, width: 20}}>
              <Text white size={10}>
                {item.noti}
              </Text>
            </Block>
          ) : (
            <Block
              center
              middle
              flex={false}
              borderRadius={20}
              margin={[t1, 0, 0, 0]}
              style={{height: 20, width: 20}}
            />
          )}
        </Block>
      </CustomButton>
    );
  };
  return (
    <Block white>
      <Header centerText={'Messages'} />
      <FlatList data={ChatData} renderItem={_renderItem} />
    </Block>
  );
};

export default Chat;
