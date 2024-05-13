/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import PrimaryButtonComponent from '../../components/PrimaryButtonComponent';
import InputComponent from '../../components/InputComponent';
import MainLogoComponent from '../../components/MainLogoComponent';
import BottomDialougeTouchable from '../../components/BottomDialougeTouchable';
import { loginUser } from '../../network/AuthenticationAPI';
import { setLocalItem } from '../../utils/Utils';
import Constants from '../../utils/Constants';
import { useDispatch } from 'react-redux';
import { userLogin } from '../../store/userSlice';
import { userDetails } from '../../store/userDetailsSlice';
import colors from '../../utils/colorPallete';
import { validateEmail } from '../../utils/regexCheck';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-root-toast';

type response = {
  status: boolean;
  message: string;
  data: {
    token: string;
    user_id: string;
  };
};
type BorderTypes = 'Danger' | 'Auth' | 'Normal';

const Login = () => {
  const dispatch = useDispatch();

  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailBorder, setEmailBorder] = useState<BorderTypes>('Normal');
  const [passwordBorder, setPasswordBorder] = useState<BorderTypes>('Normal');
  const [inputChanged, setInputChanged] = useState(false);

  const LoginMain = async () => {
    if (email === '' || password === '') {
      Toast.show(
        'Please enter email and password'
      );
      setEmailBorder('Danger');
      setPasswordBorder('Danger');
      return;
    } else if (validateEmail(email) === false) {
      Toast.show(
        'Please enter valid email'
      );
      setEmailBorder('Danger');
      setLoading(false);
      return;
    }

    setLoading(true);

    if (validateEmail(email)) {
      try {
        const response = await loginUser({
          loginUsername: email,
          loginPassword: password,
        });
        // console.log('LoginMain', response);
        if (response && response.status === false) {
          setEmailBorder('Danger');
          setPasswordBorder('Danger');
          setLoading(false);
          const message = 'Error while logging in: ' + response.message;
          Toast.show(
            message
          );
        }
        if (response.status) {
          setLocalItem(Constants.IS_LOGGED_IN, 'true');
          dispatch(
            userDetails({
              token: response.data.token,
              user_id: response.data.user_id,
            }),
          );
          setLocalItem(Constants.USER_JWT, response.data.token);
          setLocalItem(Constants.USER_ID, response.data.user_id);
          await setLocalItem(Constants.SAVE_SHARES_LATER, 'false');
          dispatch(userLogin(true));
          dispatch(
            userDetails({
              token: response.data.token,
              user_id: response.data.user_id,
            }),
          );
        } else if (response.status === false) {
          const message = response.message;
          Toast.show(
            message
          );
          setEmailBorder('Danger');
          setPasswordBorder('Danger');
          setLoading(false);
        }
      } catch (error) {
        const message = 'Error while logging in: Network error';
        Toast.show(
          message
        );
        setEmailBorder('Danger');
        setPasswordBorder('Danger');
        setLoading(false);
      }
    } else {
      // If the email format is invalid, reset the loading state
      setLoading(false);
    }
    setInputChanged(false);
  };

  useEffect(() => {
    if (inputChanged) {
      setEmailBorder('Normal');
      setPasswordBorder('Normal');
    }
  }, [email, password]);
  const { t } = useTranslation();
  return (
    <View style={styles.safeAreaView}>
      <MainLogoComponent />
      <View style={styles.midSection}>
        <InputComponent
          hidden={false}
          header={t("Email")}
          value={email}
          setter={(val) => {
            setInputChanged(true);
            setEmail(val);
          }}
          borderType={emailBorder}
          placeholder={t("Enter Email")}
        />
        <InputComponent
          header={t("Password")}
          hidden={true}
          value={password}
          setter={(val) => {
            setInputChanged(true);
            setPassword(val);
          }}
          borderType={passwordBorder}
          placeholder={t("Enter Password")}
        />
        <View style={styles.buttonContainer}>
          {!loading ? (
            <PrimaryButtonComponent
              onPressing={() => LoginMain()}
              title={t("Login")}
            />
          ) : (
            <PrimaryButtonComponent title="">
              <ActivityIndicator
                size="large"
                color={colors['secondary-light']}
              />
            </PrimaryButtonComponent>
          )}
        </View>
        {/* <TouchableOpacity style={styles.forgotPassword}>
          <Text>Forgot Password?</Text>
        </TouchableOpacity> */}
      </View>
      <BottomDialougeTouchable
        label={t("Don't have an account?")}
        mainText={t("Sign Up")}
        navigateTo="SignUp"
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginTop: -80,
    width: '100%',
    gap: 15,
    flexDirection: 'column',
  },
  buttonContainer: {
    marginTop: 12,
    height: 50,
    flexDirection: 'column',
  },
  forgotPassword: {
    marginTop: 10,
    alignSelf: 'center',
  },
  loading: {
    backgroundColor: colors['primary-accent'],
    width: '100%',
    height: 50,
    borderRadius: 5,
    marginTop: 15,
  },
});

export default Login;
