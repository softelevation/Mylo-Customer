import React from 'react';
import {Text} from 'react-native';
import Block from './Block';
import ImageComponent from './ImageComponent';

const EmptyFile = ({text}) => {
  return (
    <Block center middle>
      <ImageComponent name="empty_icon" height="200" width="200" />
      <Text>{text || 'No Data'} </Text>
    </Block>
  );
};

export default EmptyFile;
