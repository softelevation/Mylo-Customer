import React, {useState} from 'react';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import Header from '../../common/header';
import {Block, Button, ImageComponent, Input, Text} from '../../components';
import {t1, t2, t5, w1, w2, w3} from '../../components/theme/fontsize';
import StarRating from 'react-native-star-rating';
import {light} from '../../components/theme/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
const Feedback = () => {
  const [Ratings, setRatings] = useState(3);
  return (
    <Block secondary>
      <Header
        menu={'left_arrow_icon'}
        menuColor="#fff"
        navigation
        centerText={'Feedback'}
      />
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <Block
          borderRadius={20}
          white
          flex={false}
          margin={[t5, w3]}
          padding={[t2]}>
          <Block margin={[0, w3]} center flex={false}>
            <ImageComponent name="feedback_icon" height="200" width="300" />
            <Text margin={[t2]} size={32} bold center>
              Request has Ended
            </Text>
            <Text center grey size={14}>
              Please rate your experience. This would help the broker improve
              his/hers services.
            </Text>
            <StarRating
              starSize={50}
              maxStars={5}
              selectedStar={(rating) => setRatings(rating)}
              fullStarColor={light.darkColor}
              rating={Ratings}
              starStyle={{marginLeft: w1}}
              containerStyle={{
                marginVertical: t2,
              }}
            />
            <Text center grey size={12}>
              Tap a star to rate.
            </Text>
          </Block>
          <Block flex={false} margin={[t1, w2, 0, w2]}>
            <Input
              multiline={true}
              style={{height: heightPercentageToDP(10)}}
              textAlignVertical={'top'}
              label={'A few words about your experience with the broker'}
              placeholder={'Enter text here ...'}
            />
          </Block>
          <Button color="primary">Send Feedback</Button>
        </Block>
      </KeyboardAwareScrollView>
    </Block>
  );
};

export default Feedback;
