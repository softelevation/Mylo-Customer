import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Modal} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import StarRating from 'react-native-star-rating';
import {
  Block,
  Text,
  Button,
  ImageComponent,
  CustomButton,
} from '../../components';
import {light} from '../../components/theme/colors';
import {t1, t3, w1, w5} from '../../components/theme/fontsize';
import {dialCall, openMessage} from '../../utils/commonAppUtils';
import {strictValidObjectWithKeys} from '../../utils/commonUtils';

const BrokerDetails = ({brokerDetails, setBrokerDetails}) => {
  const [state, setstate] = useState(true);

  const onClose = () => {
    setstate(!state);
    setBrokerDetails();
  };
  return (
    <Block flex={false} center middle>
      <Modal
        animationType="slide"
        transparent={true}
        visible={state}
        onRequestClose={() => {
          setstate(!state);
        }}>
        <Block
          color="#000"
          style={dialogPosition}
          white
          padding={[t3, w5, t3, w5]}
          flex={false}>
          <CustomButton
            onPress={() => onClose()}
            flex={false}
            alignSelf="flex-end">
            <ImageComponent
              name="cancel_icon"
              color="#fff"
              height={20}
              width={20}
            />
          </CustomButton>
          <Block flex={false} row center>
            <Block
              alignSelf={'flex-start'}
              flex={false}
              borderRadius={80}
              borderWidth={1}
              borderColor="#fff">
              <ImageComponent
                name="avatar"
                height="70"
                width="70"
                radius={70}
              />
            </Block>
            <Block flex={false} margin={[0, w5]}>
              {strictValidObjectWithKeys(brokerDetails) && (
                <Text white semibold>
                  {brokerDetails.name}
                </Text>
              )}
              <StarRating
                disabled={false}
                starSize={20}
                maxStars={5}
                fullStarColor={light.secondary}
                rating={
                  (strictValidObjectWithKeys(brokerDetails) &&
                    brokerDetails.rating) ||
                  0
                }
                starStyle={{marginLeft: w1}}
                containerStyle={{
                  width: wp(20),
                  marginTop: t1,
                }}
              />
            </Block>
          </Block>
          <Block flex={false} row space={'between'}>
            <Button
              onPress={() =>
                dialCall(
                  strictValidObjectWithKeys(brokerDetails) &&
                    brokerDetails.phone_no,
                )
              }
              shadow
              style={{width: wp(43)}}
              color="#434751">
              Phone
            </Button>
            <Button
              onPress={() =>
                openMessage(
                  strictValidObjectWithKeys(brokerDetails) &&
                    brokerDetails.phone_no,
                )
              }
              shadow
              style={{width: wp(43)}}
              color="#434751">
              Message
            </Button>
          </Block>
          {/* <Block flex={false}>
            <Button
              onPress={() => setstate(!state)}
              style={{marginTop: hp(0.5)}}
              shadow
              color="#434751">
              View Details
            </Button>
          </Block> */}
        </Block>
      </Modal>
    </Block>
  );
};
const dialogPosition = {
  position: 'absolute',
  bottom: 0,
  right: 0,
  left: 0,
  height: hp(28),
};
export default BrokerDetails;
