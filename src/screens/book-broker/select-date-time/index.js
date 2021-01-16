import React, {useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Header from '../../../common/header';
import {Block, Button, Input, Text} from '../../../components';
import {t1, t2, w1, w5} from '../../../components/theme/fontsize';
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from '../../../common/date-time-picker';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';

const initialState = {
  date: '',
  time: '',
  location: '',
};
const SelectDateTime = () => {
  const [details, setDetails] = useState(initialState);
  const {date, time} = details;
  const nav = useNavigation();
  return (
    <Block>
      <Header
        menu={'left_arrow_icon'}
        menuColor="#fff"
        navigation
        centerText={'Date and Time'}
      />
      <Block white>
        <MapView center middle secondary flex={false}>
          <Text semibold white>
            Google Maps
          </Text>
        </MapView>
        <Block padding={[t2]} flex={false}>
          <Block flex={false} margin={[t1, w1]}>
            <Block
              row
              center
              space={'between'}
              flex={false}
              borderColorDeafult
              padding={[t1, 0]}
              borderWidth={[0, 0, 1, 0]}>
              <TextArea
                placeholderTextColor={'#00000091'}
                placeholder={'Search Location here'}
              />
              <Icon name="chevron-down-sharp" size={20} />
            </Block>
          </Block>
          <DatePicker
            mode="date"
            initialValue={date}
            setValue={(val) => setDetails({date: val})}
          />
          <DatePicker
            mode="time"
            Title={'Time'}
            initialValue={time}
            setValue={(val) => setDetails({time: val})}
          />
        </Block>
        <Block margin={[0, w5]}>
          <Button onPress={() => nav.navigate('Feedback')} color="secondary">
            Schedule Now
          </Button>
        </Block>
      </Block>
    </Block>
  );
};
const MapView = styled(Block)({
  height: hp(30),
  borderBottomLeftRadius: 20,
  borderBottomRightRadius: 20,
});
const TextArea = styled(Input)({
  borderWidth: 0,
  padding: 0,
  width: wp(80),
});
export default SelectDateTime;
