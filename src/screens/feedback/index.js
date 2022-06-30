import React, {useState} from 'react';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import Header from '../../common/header';
import {Block, Button, ImageComponent, Input, Text} from '../../components';
import {t1, t2, t5, w1, w2, w3} from '../../components/theme/fontsize';
import StarRating from 'react-native-star-rating';
import {light} from '../../components/theme/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  feedbackRequest,
  feedbacktSuccess,
  feedbackError,
} from '../../redux/action';
import {useDispatch, useSelector} from 'react-redux';
import {useRoute} from '@react-navigation/core';
import {Keyboard} from 'react-native';

const Feedback = () => {
  const [ratings, setRatings] = useState(1);
  const {params} = useRoute();
  const {item} = params;
  const dispatch = useDispatch();
  const [brokerFeedback, setBrokerFeedback] = useState('');
  const isLoad = useSelector((v) => v.feedback.loading);

  const onSubmit = (values) => {
    const data = {
      book_id: item.id,
      rating: ratings,
      message: brokerFeedback,
    };
    console.log(data, 'data');
    dispatch(feedbackRequest({data}));
    Keyboard.dismiss();
  };

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
              starSize={35}
              maxStars={5}
              selectedStar={(rating) => setRatings(rating)}
              fullStarColor={light.starColor}
              rating={ratings}
              starStyle={{marginLeft: w2}}
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
              labelStyle={{marginBottom: heightPercentageToDP(1)}}
              multiline={true}
              value={brokerFeedback}
              onChangeText={(w) => setBrokerFeedback(w)}
              style={{height: heightPercentageToDP(10)}}
              textAlignVertical={'top'}
              label={'A few words about your experience with the broker'}
              placeholder={'Enter text here ...'}
            />
          </Block>
          <Button
            isLoading={isLoad}
            onPress={() => {
              onSubmit();
            }}
            color="secondary">
            Send Feedback
          </Button>
        </Block>
      </KeyboardAwareScrollView>
    </Block>
  );
};

export default Feedback;
