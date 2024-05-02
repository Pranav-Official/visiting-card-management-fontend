import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputKeyPressEventData,
  ToastAndroid,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import PrimaryButtonComponent from '../../components/PrimaryButtonComponent';
import MainLogoComponent from '../../components/MainLogoComponent';
import { SignUpUser } from '../../network/AuthenticationAPI';
import { setLocalItem } from '../../utils/Utils';
import Constants from '../../utils/Constants';
import { userLogin } from '../../store/userSlice';
import { userDetails } from '../../store/userDetailsSlice';
import { useDispatch } from 'react-redux';
import colors from '../../utils/colorPallete';
import { verifyOTP } from '../../network/verifyOTPAPI';
import { SendOtp } from '../../network/sendOTPAPI';

const OtpScreen = ({ route }: any) => {
  // Refs for each TextInput field
  const dispatch = useDispatch();
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [otpValues, setOTPValues] = useState<string[]>(Array(6).fill(''));

  // Function to focus on the next TextInput field
  const focusNextInput = (index: number) => {
    if (index < inputRefs.current.length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Function to focus on the previous TextInput field
  const focusPreviousInput = (index: number) => {
    if (index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleChangeText = (text: string, index: number) => {
    const newOTPValues = [...otpValues];
    newOTPValues[index] = text;
    setOTPValues(newOTPValues);
  };

  const handleKeyPress = (
    event: React.BaseSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    const pressedKey = event.nativeEvent.key;
    if (pressedKey === 'Backspace') {
      if (otpValues[index].length === 1) {
        const newOTPValues = [...otpValues];
        newOTPValues[index] = '';
        setOTPValues(newOTPValues);
      } else if (index > 0) {
        const newOTPValues = [...otpValues];
        newOTPValues[index - 1] = '';
        setOTPValues(newOTPValues);
        focusPreviousInput(index);
      }
    }
    if (/[0-9]/.test(pressedKey)) {
      focusNextInput(index);
    }
  };
  //otp verification
  const handleGetOTP = async () => {
    const enteredOTP = otpValues.join('');
    setOTPValues(Array(6).fill(''));
    inputRefs.current[0]?.focus();
    if (enteredOTP) {
      try {
        const verificationResponse = await verifyOTP({
          email: route.params.userDetails.signUpEmail,
          enteredOtp: enteredOTP,
        });
        if (verificationResponse.statusCode === '200') {
          const response = await SignUpUser(route.params.userDetails);
          setLocalItem(Constants.IS_LOGGED_IN, 'true');
          dispatch(userLogin(true));
          dispatch(
            userDetails({
              token: response.data?.token ?? '',
              user_id: response.data?.user_id ?? '',
            }),
          );
          setLocalItem(Constants.USER_JWT, response.data?.token ?? '');
          setLocalItem(Constants.USER_ID, response.data?.user_id ?? '');
        } else {
          const message = verificationResponse.verificationResponse;
          ToastAndroid.showWithGravity(
            message.message,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        }
      } catch (error) {
        console.log('Error while verifying OTP ', error);
        Alert.alert('Error', 'An error occurred while verifying OTP.');
      }
    } else {
      Alert.alert('Invalid OTP');
    }
  };
  const resendOTP = async () => {
    try {
      const otpResponse = await SendOtp({
        user_email: route.params.userDetails.signUpEmail,
      });
      if (otpResponse.statusCode === '200') {
        console.log('Resend otp successfully');
      }
    } catch (error) {
      ToastAndroid.showWithGravity(
        'Error occurred during signup',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <MainLogoComponent />
      </View>
      <View>
        <Text style={styles.otpText}>
          An OTP was sent to your email, Please enter it here
        </Text>
      </View>
      <View style={styles.otp}>
        {otpValues.map((value, index) => (
          <TextInput
            key={index}
            style={styles.input}
            maxLength={1}
            keyboardType="numeric"
            value={value}
            ref={(ref) => (inputRefs.current[index] = ref)}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={(event) => handleKeyPress(event, index)}
          />
        ))}
      </View>
      <PrimaryButtonComponent
        title="VERIFY"
        onPressing={() => {
          handleGetOTP();
        }}
      />
      <TouchableOpacity onPress={resendOTP}>
        <Text style={styles.resendOtp}>Resend OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 20,
    margin: 10,
    gap: 10,
  },
  logo: {
    alignItems: 'center',
  },
  otpText: {
    fontSize: 20,
    textAlign: 'center',
    color: colors['primary-text'],
    marginBottom: 50,
  },
  input: {
    height: 50,
    width: 45,
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 20,
    textAlign: 'center',
  },
  otp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: '8%',
  },
  resendOtp: {
    color: colors['accent-grey'],
    alignSelf: 'center',
    fontSize: 20,
  },
});

export default OtpScreen;
