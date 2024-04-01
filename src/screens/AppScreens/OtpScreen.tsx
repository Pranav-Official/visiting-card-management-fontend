import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputKeyPressEventData,
  Alert,
} from 'react-native';
import PrimaryButtonComponent from '../../components/PrimaryButtonComponent';
import MainLogoComponent from '../../components/MainLogoComponent';

const OtpScreen = () => {
  // Refs for each TextInput field
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

  const handleGetOTP = () => {
    const enteredOTP = otpValues.join('');
    setOTPValues(Array(6).fill(''));
    inputRefs.current[0]?.focus();
    Alert.alert('OTP', enteredOTP);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <MainLogoComponent />
      </View>
      <View style={styles.otp}>
        {/* Map over each TextInput with respective ref */}
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
          handleGetOTP(); // Call the function to verify otp
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
