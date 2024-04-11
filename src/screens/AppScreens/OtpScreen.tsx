import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputKeyPressEventData,
  ToastAndroid,
  Alert,
} from 'react-native';
import PrimaryButtonComponent from '../../components/PrimaryButtonComponent';
import MainLogoComponent from '../../components/MainLogoComponent';
import { SignUpUser } from '../../network/AuthenticationAPI';
import { setLocalItem } from '../../utils/Utils';
import Constants from '../../utils/Constants';
import { userLogin } from '../../store/userSlice';
import { userDetails } from '../../store/userDetailsSlice';
import { useDispatch } from 'react-redux';

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
    if (enteredOTP === route.params.receivedOtp) {
      const response = await SignUpUser(route.params.userDetails);
      if (response.status) {
        setLocalItem(Constants.IS_LOGGED_IN, 'true');
        dispatch(
          userDetails({
            token: response.data?.token ?? '',
            user_id: response.data?.user_id ?? '',
          }),
        );
        setLocalItem(Constants.USER_JWT, response.data?.token ?? '');
        setLocalItem(Constants.USER_ID, response.data?.user_id ?? '');
        dispatch(userLogin(true));
        dispatch(
          userDetails({
            token: response.data?.token ?? '',
            user_id: response.data?.user_id ?? '',
          }),
        );
      } else {
        const message = response.message || 'Unknown error occurred';
        ToastAndroid.showWithGravity(
          message,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    } else {
      Alert.alert('Invalid OTP');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <MainLogoComponent />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
    margin: 10,
  },
  logo: {
    alignItems: 'center',
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
});

export default OtpScreen;
