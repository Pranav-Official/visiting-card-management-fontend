import React, { useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
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
import { SignUpUser } from '../../network/AuthenticationAPI';
import Toast from 'react-native-root-toast';

type BorderTypes = 'Danger' | 'Auth' | 'Normal';
type SignUpNavigationProp = NavigationProp<
  Record<string, object>,
  string,
  any,
  any,
  any
>;
type SignUpUserProp = {
  fullname: string;
  email: string;
  password: string;
};
const SignUp = ({ navigation }: { navigation: SignUpNavigationProp }) => {
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
      Toast.show(
        'Please enter all fields'
      );
      return;
    }
    if (!validateEmail(email)) {
      setEmailBorder('Danger');
      Toast.show(
        'Please enter a valid email'
      );
      return;
    }
    if (!isValidPassword(password)) {
      setPasswordBorder('Danger');
      Toast.show(
        'Password must be at least 8 characters with uppercase, lowercase, digit, and special character.'
      );
      return;
    }
    if (password !== confirmPassword) {
      setPasswordBorder('Danger');
      setConfirmPasswordBorder('Danger');
      Toast.show(
        'Passwords do not match'
      );
      return;
    }
    setNameBorder('Normal');
    setEmailBorder('Normal');
    setPasswordBorder('Normal');
    setConfirmPasswordBorder('Normal');
    setLoading(true);

    interface signUpUserProp {
      signUpUsername: string;
      signUpPassword: string;
      signUpEmail: string;
    }

    const userDetails: signUpUserProp = {
      signUpUsername: fullname,
      signUpPassword: password,
      signUpEmail: email,
    };

    try {
      const existingUser = await SignUpUser(userDetails);
      if (
        existingUser.message == 'User with same Email Id exists, Please Login!'
      ) {
        Toast.show(
          'User with same Email Id exists, Please Login!'
        );
        setLoading(false);
        return;
      }
      const otpResponse = await SendOtp({ user_email: email });
      if (otpResponse.statusCode === '200') {
        navigation.navigate({
          name: 'OtpScreen',
          params: {
            userDetails: {
              signUpUsername: fullname,
              signUpPassword: password,
              signUpEmail: email,
            },
          },
        });
      }
    } catch (error) {
      Toast.show(
        'Error occurred during signup'
      );
    } finally {
      setLoading(false);
    }
  };
  const { t } = useTranslation();
  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.safeAreaView}>
        <MainLogoComponent />
        <View style={styles.midSection}>
          <InputComponent
            hidden={false}
            header={t('Fullname')}
            value={fullname}
            setter={(val) => {
              setFullname(val);
              setNameBorder('Normal');
            }}
            borderType={fullnameBorder}
            placeholder={t('Enter Full Name')}
          />
          <InputComponent
            hidden={false}
            header={t('Email')}
            value={email}
            setter={setEmail}
            borderType={emailBorder}
            placeholder={t('Enter Email')}
          />
          <InputComponent
            header={t('Password')}
            hidden={true}
            value={password}
            setter={(val) => {
              setPassword(val);
              setPasswordBorder('Normal');
            }}
            borderType={passwordBorder}
            placeholder={t('Enter Password')}
          />
          <InputComponent
            header={t('Confirm Password')}
            hidden={true}
            value={confirmPassword}
            setter={(val) => {
              setConfirmPassword(val);
              setConfirmPasswordBorder('Normal');
            }}
            borderType={confirmPasswordBorder}
            placeholder={t('Confirm Password')}
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
          label={t('Already have an account?')}
          mainText={t('Login') + '!'}
          navigateTo="Login"
        />
      </View>
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
