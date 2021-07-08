import React, {useRef} from 'react';
import {FlatList, KeyboardAvoidingView, Platform} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Header from '../../../common/header';
import {
  Block,
  CustomButton,
  ImageComponent,
  Input,
  Text,
} from '../../../components';
import {t1, t2, t3, t4, w3} from '../../../components/theme/fontsize';

const ChatDetails = ({route: {params: {userName} = {}} = {}}) => {
  const flatlistRef = useRef();
  const _renderItem = ({item}) => {
    return (
      <Block
        alignSelf={item === 'out' && 'flex-end'}
        style={{width: wp(60)}}
        borderRadius={10}
        shadow
        secondary={item === 'out'}
        white={item !== 'out'}
        padding={[t2]}
        margin={[t1, w3]}
        flex={false}>
        <Text size={12}>Case had never seen him wear the same suit twice,</Text>
      </Block>
    );
  };
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={t4}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flexGrow: 1, backgroundColor: '#fff'}}>
      <Header
        menu={'left_arrow_icon'}
        centerText={userName}
        navigation
        menuColor="#fff"
      />
      <Block primary>
        <FlatList
          ref={flatlistRef}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatlistRef.current.scrollToEnd()}
          data={[
            'in',
            'out',
            'in',
            'out',
            'in',
            'out',
            'in',
            'out',
            'in',
            'out',
            'in',
            'out',
            'in',
            'out',
            'in',
            'out',
          ]}
          renderItem={_renderItem}
        />
      </Block>
      <Block
        shadow
        space={'between'}
        center
        row
        white
        flex={false}
        // margin={[0, 0, t2, 0]}
        padding={[t1, t1]}>
        <ImageComponent
          name="attachment_icon"
          height="20"
          width="20"
          color="#000"
        />
        <Input style={{width: wp(75)}} placeholder={'type message here ...'} />
        <CustomButton
          flex={false}
          borderRadius={40}
          center
          middle
          secondary
          style={{height: 40, width: 40}}>
          <Block flex={false} style={{marginRight: wp(1)}}>
            <ImageComponent name="message_send_icon" height="22" width="22" />
          </Block>
        </CustomButton>
      </Block>
    </KeyboardAvoidingView>
  );
};

export default ChatDetails;
