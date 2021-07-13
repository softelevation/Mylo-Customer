import React, {useState} from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import {Block, CustomButton, Text} from '../components';
import {t1, w1} from '../components/theme/fontsize';
import PropTypes from 'prop-types';
import moment from 'moment';
const DatePicker = ({mode, Title, setValue, initialValue}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setValue(date);
    hideDatePicker();
  };

  return (
    <Block flex={false}>
      <Block flex={false} margin={[t1, w1]}>
        <Text size={14}>{Title}</Text>
        <CustomButton
          onPress={() => showDatePicker()}
          row
          center
          space={'between'}
          flex={false}
          borderColorDeafult
          padding={[t1, 0]}
          borderWidth={[0, 0, 1, 0]}>
          <Text size={14} grey>
            {initialValue || `Select ${Title}`}
          </Text>
          <Icon name="chevron-down-sharp" size={20} />
        </CustomButton>
      </Block>
      <DateTimePickerModal
        isDarkModeEnabled
        isVisible={isDatePickerVisible}
        mode={mode}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
      />
    </Block>
  );
};
DatePicker.defaultProps = {
  mode: 'date',
  Title: 'Date',
};
DatePicker.propTypes = {
  mode: PropTypes.string,
  Title: PropTypes.string,
};

export default DatePicker;
