import React, { useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';

import ButtonComponent from '../../components/PrimaryButtonComponent';
import InputComponent from '../../components/InputComponent';
import MainLogoComponent from '../../components/MainLogoComponent';
import BottomDialougeTouchable from '../../components/BottomDialougeTouchable';
import colors from '../../utils/colorPallete';
import { isValidPassword, validateEmail } from '../../utils/regexCheck';
import { useTranslation } from 'react-i18next';
import { SendOtp } from '../../network/sendOTPAPI';
import { NavigationProp } from '@react-navigation/native';

type BorderTypes = 'Danger' | 'Auth' | 'Normal';
type SignUpNavigationProp = NavigationProp<
  Record<string, object>,
  string,
  any,
  any,
  any
>;

const SignUp = ({ navigation }: { navigation: SignUpNavigationProp }) => {
  // const navigation = useNavigation();

  const [fullname, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [emailBorder, setEmailBorder] = useState<BorderTypes>('Normal');
  const [fullnameBorder, setNameBorder] = useState<BorderTypes>('Normal');
  const [passwordBorder, setPasswordBorder] = useState<BorderTypes>('Normal');
  const [confirmPasswordBorder, setConfirmPasswordBorder] =
    useState<BorderTypes>('Normal');
  const [loading, setLoading] = useState(false);

  const otpMain = async () => {
    if (
      email === '' ||
      password === '' ||
      fullname === '' ||
      confirmPassword === ''
    ) {
      if (email === '') setEmailBorder('Danger');
      if (password === '') setPasswordBorder('Danger');
      if (fullname === '') setNameBorder('Danger');
      if (confirmPassword === '') setConfirmPasswordBorder('Danger');
      ToastAndroid.showWithGravity(
        'Please enter all fields',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }
    if (!validateEmail(email)) {
      setEmailBorder('Danger');
      ToastAndroid.showWithGravity(
        'Please enter a valid email',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }
    if (!isValidPassword(password)) {
      setPasswordBorder('Danger');
      ToastAndroid.showWithGravity(
        'Password must be at least 8 characters with uppercase, lowercase, digit, and special character.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }
    if (password !== confirmPassword) {
      setPasswordBorder('Danger');
      setConfirmPasswordBorder('Danger');
      ToastAndroid.showWithGravity(
        'Passwords do not match',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }
    setNameBorder('Normal');
    setEmailBorder('Normal');
    setPasswordBorder('Normal');
    setConfirmPasswordBorder('Normal');
    setLoading(true);

    try {
      const otpResponse = await SendOtp({ user_email: email });
      const receivedOtp = otpResponse.otp?.toString();
      navigation.navigate({
        name: 'OtpScreen',
        params: {
          receivedOtp,
          userDetails: {
            signUpUsername: fullname,
            signUpPassword: password,
            signUpEmail: email,
          },
        },
      });
    } catch (error) {
      ToastAndroid.showWithGravity(
        'Error occurred during signup',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } finally {
      setLoading(false);
    }
  };
  const { t } = useTranslation();
  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <SafeAreaView style={styles.safeAreaView}>
        <MainLogoComponent />
        <View style={styles.midSection}>
          <InputComponent
            hidden={false}
            header={t("Fullname")}
            value={fullname}
            setter={(val) => {
              setFullname(val);
              setNameBorder('Normal');
            }}
            borderType={fullnameBorder}
            placeholder={t("Enter Full Name")}
          />
          <InputComponent
            hidden={false}
            header={t("Email")}
            value={email}
            setter={setEmail}
            borderType={emailBorder}
            placeholder={t("Enter Email")}
          />
          <InputComponent
            header={t("Password")}
            hidden={true}
            value={password}
            setter={(val) => {
              setPassword(val);
              setPasswordBorder('Normal');
            }}
            borderType={passwordBorder}
            placeholder={t("Enter Password")}
          />
          <InputComponent
            header={t("Confirm Password")}
            hidden={true}
            value={confirmPassword}
            setter={(val) => {
              setConfirmPassword(val);
              setConfirmPasswordBorder('Normal');
            }}
            borderType={confirmPasswordBorder}
            placeholder={t("Confirm Password")}
          />
          {!loading ? (
            <View style={styles.buttonContainer}>
              <ButtonComponent onPressing={otpMain} title="Sign Up" />
            </View>
          ) : (
            <ActivityIndicator
              style={styles.loading}
              size="large"
              color={colors['secondary-light']}
            />
          )}
        </View>
        <BottomDialougeTouchable
          label={t("Already have an account?")}
          mainText={t("Login")+"!"}
          navigateTo="Login"
        />
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors['secondary-light'],
    flex: 1,
  },
  safeAreaView: {
    padding: 24,
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: colors['secondary-light'],
    gap: 10,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  midSection: {
    width: '100%',
    gap: 15,
    flexDirection: 'column',
    marginBottom: 50,
  },
  buttonContainer: {
    marginTop: 12,
    height: 50,
    flexDirection: 'column',
  },
  loading: {
    backgroundColor: colors['primary-accent'],
    width: '100%',
    height: 50,
    borderRadius: 5,
    marginTop: 15,
  },
});

export default SignUp;
