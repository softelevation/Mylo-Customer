import React, {useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {
  Block,
  Button,
  CustomButton,
  ImageComponent,
  Input,
  Text,
} from '../../../components';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Keyboard,
  Platform,
} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';
import {loginRequest, registerRequest} from '../../../redux/action';
import images from '../../../assets';
import {t3, w1, w3} from '../../../components/theme/fontsize';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNavigation} from '@react-navigation/core';
import messaging from '@react-native-firebase/messaging';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import * as Animatable from 'react-native-animatable';
const Login = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [fbLoader, setFbLoader] = useState(false);
  const [googleLoader, setGoogleLoader] = useState(false);
  const isLoad = useSelector((state) => state.user.login.loading);

  const submitValues = (values, {resetForm}) => {
    dispatch(loginRequest(values.mobile));
    Keyboard.dismiss();
    setTimeout(() => {
      resetForm();
    }, 100);
  };

  const logoanimation = {
    from: {
      top: hp(50),
      opacity: 0.5,
      height: 60,
      width: 60,
    },
    to: {
      top: hp(8),
      opacity: 1,
      height: 100,
      width: 100,
    },
  };

  const handleFacebookLogin = async () => {
    const fcmToken = await messaging().getToken();
    setFbLoader(true);
    if (Platform.OS === 'android') {
      LoginManager.setLoginBehavior('web_only');
    }
    LoginManager.logInWithPermissions(['public_profile']).then(
      function (result) {
        if (result.isCancelled) {
          console.log('Login cancelled');
          setFbLoader(false);
        } else {
          const _responseInfoCallback = (error: ?Object, result) => {
            if (error) {
              console.log('Error fetching data: ' + error.toString());
              setFbLoader(false);
            } else {
              setFbLoader(false);
              console.log(result, 'user');

              const data = {
                social_type: 'F',
                social_token: result.id,
                name: result.name,
                email: result.email,
                token: fcmToken,
                image: result.picture.data.url || null,
                // mobile: result.email,
              };
              console.log('Success fetching data: ', data);
              dispatch(registerRequest(data));
            }
          };
          // Create a graph request asking for user information with a callback to handle the response.
          const infoRequest = new GraphRequest(
            '/me',
            {
              parameters: {
                fields: {
                  string:
                    'email,name,first_name,middle_name,last_name,picture.type(large)',
                },
              },
            },
            _responseInfoCallback,
          );
          console.log(infoRequest, 'infoRequest');
          // Start the graph request.
          const res = new GraphRequestManager().addRequest(infoRequest).start();
          console.log(
            'Login success with permissions: ' +
              result.grantedPermissions.toString(),
          );
          console.log(result, 'result', res);
        }
      },
      function (error) {
        console.log('Login fail with error: ' + error);
        setFbLoader(false);
      },
    );
  };

  const signIn = async () => {
    const fcmToken = await messaging().getToken();

    await GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/userinfo.profile'],
    });
    setGoogleLoader(true);
    try {
      GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setGoogleLoader(false);
      console.log(userInfo, 'user');
      const {email, name, id, photo} = userInfo.user;
      const data = {
        social_type: 'G',
        social_token: id,
        name: name || '',
        email: email,
        token: fcmToken,
        image: photo || null,
      };
      console.log(data, 'data');
      dispatch(registerRequest(data));
    } catch (error) {
      console.log(error, 'error');
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // sign in was cancelled
        setGoogleLoader(false);

        //Alert.alert('cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation in progress already
        setGoogleLoader(false);

        Alert.alert('in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setGoogleLoader(false);

        Alert.alert('play services not available or outdated');
      } else {
        setGoogleLoader(false);

        Alert.alert('Something went wrong', error.toString());
      }
    }
  };
  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      style={{flex: 1, backgroundColor: '#fff'}}>
      <Formik
        initialValues={{mobile: ''}}
        onSubmit={submitValues}
        validationSchema={yup.object().shape({
          mobile: yup
            .string()
            .min(10)
            .max(15)
            .required('Mobile Number is Required'),
        })}>
        {({
          values,
          handleChange,
          errors,
          setFieldTouched,
          touched,
          handleSubmit,
          dirty,
          isValid,
        }) => (
          <>
            <Block onStartShouldSetResponder={() => Keyboard.dismiss()} white>
              <ImageBackground
                source={images.background}
                style={{
                  height: hp(55),
                  width: wp(100),
                  alignItems: 'center',
                }}>
                <Block flex={false} margin={[t3, 0, 0]}>
                  {/* <ImageComponent
                    name="logo"
                    height={100}
                    width={100}
                    radius={20}
                  /> */}
                  <Animatable.Image
                    // onAnimationEnd={() => this.setState({SlideImage: true})}
                    animation={logoanimation}
                    delay={500}
                    duration={1200}
                    source={images.logo}
                    style={{
                      borderRadius: 20,
                    }}
                  />
                </Block>
              </ImageBackground>
              <Block
                primary
                padding={[hp(2), wp(4), hp(2), wp(4)]}
                flex={false}>
                <Input
                  placeholder="Sign Up with Mobile"
                  keyboardType="number-pad"
                  value={values.mobile}
                  onChangeText={handleChange('mobile')}
                  onBlur={() => setFieldTouched('mobile')}
                  error={touched.mobile && errors.mobile}
                  errorText={touched.mobile && errors.mobile}
                  style={{paddingVertical: hp(1.5)}}
                />
              </Block>
              <Block margin={[0, w1]} flex={false} row space={'around'}>
                <CustomButton
                  onPress={() => signIn()}
                  shadow
                  borderRadius={10}
                  row
                  center
                  middle
                  borderWidth={1}
                  margin={[0, w1, 0, wp(6)]}
                  padding={[hp(1.3), wp(1)]}
                  borderColorDeafult
                  color="primary">
                  <ImageComponent name="google_icon" height={20} width={20} />
                  {googleLoader ? (
                    <ActivityIndicator
                      size="small"
                      color="#F34336"
                      style={{marginLeft: w3}}
                    />
                  ) : (
                    <Text regular size={14} margin={[0, 0, 0, w3]}>
                      Google
                    </Text>
                  )}
                </CustomButton>
                <CustomButton
                  borderRadius={10}
                  onPress={() => handleFacebookLogin()}
                  shadow
                  row
                  center
                  middle
                  borderColorDeafult
                  margin={[0, wp(6), 0, w1]}
                  padding={[hp(1)]}
                  borderWidth={1}
                  color="primary">
                  <ImageComponent name="fb_icon" height={20} width={20} />
                  {fbLoader ? (
                    <ActivityIndicator
                      size="small"
                      color="#3D5898"
                      style={{marginLeft: w3}}
                    />
                  ) : (
                    <Text regular size={14} margin={[0, 0, 0, w3]}>
                      Facebook
                    </Text>
                  )}
                </CustomButton>
              </Block>
              <Block
                margin={[t3, 0]}
                style={{width: wp(85)}}
                alignSelf="center">
                <Text size={14}>
                  By continuing, you agree that you have read and accept out{' '}
                  <Text size={14} underline>
                    T&C
                  </Text>
                  s and{' '}
                  <Text size={14} underline>
                    Privacy Policy
                  </Text>
                </Text>
              </Block>
            </Block>

            <Block primary padding={[0, wp(3), 0, wp(3)]} flex={false}>
              <Button
                isLoading={isLoad}
                disabled={!isValid || !dirty}
                onPress={handleSubmit}
                color="secondary">
                CONTINUE
              </Button>
            </Block>
          </>
        )}
      </Formik>
    </KeyboardAwareScrollView>
  );
};

export default Login;
