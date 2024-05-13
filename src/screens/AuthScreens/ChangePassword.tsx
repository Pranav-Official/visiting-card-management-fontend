import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import MainLogoComponent from '../../components/MainLogoComponent';
import InputComponent from '../../components/InputComponent';
import {
  changePassword,
  changePasswordProp,
} from '../../network/changePasswordAPI';
import { RouteProp, useNavigation } from '@react-navigation/native';
import TopBackButton from '../../components/BackButton';
import { isValidPassword } from '../../utils/regexCheck';
import colors from '../../utils/colorPallete';
import PrimaryButtonComponent from '../../components/PrimaryButtonComponent';
import Toast from 'react-native-root-toast';

type ChangePasswordRouteProps = {
  ChangePassword: {
    email: string;
    jwtToken: string;
  };
};

type BorderTypes = 'Danger' | 'Auth' | 'Normal';
type Props = {
  route: RouteProp<ChangePasswordRouteProps, 'ChangePassword'>;
};

const ChangePassword: React.FC<Props> = ({ route }) => {
  const { email, jwtToken } = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordBorder, setPasswordBorder] = useState<BorderTypes>('Normal');
  const navigation = useNavigation();

  //check password matches confirm password field
  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    setPasswordMatch(value === confirmPassword);
  };

  //check confirm password matches new password
  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setPasswordMatch(value === newPassword);
  };

  //function to handle password change
  const handleChangePassword = async () => {
    if (!passwordMatch) {
      Toast.show('Passwords do not match!')
      setPasswordBorder('Danger');
      return;
    }
    if (!isValidPassword(newPassword)) {
      Toast.show(
        'Password must be at least 8 characters with uppercase, lowercase, digit, and special character.',
      );
      setPasswordBorder('Danger');
      return;
    }

    const changePasswordProps: changePasswordProp = {
      email,
      new_password: newPassword,
      jwt_token: jwtToken,
    };
    try {
      const response = await changePassword(changePasswordProps);
      console.log('changepassword response', response);
      Toast.show('Password changed successfully!');
      // Clear the password fields after successful change
      setNewPassword('');
      setConfirmPassword('');
      if (response.statusCode == '200') {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error changing password:', error);
      Toast.show('Error changing password!');
    }
  };

  return (
    <SafeAreaView>
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={styles.main_container}
    >
      <View style={styles.back_button_container}>
        <TopBackButton color="black"></TopBackButton>
      </View>
      <View style={styles.logo_container}>
        <MainLogoComponent />
      </View>
      <View style={styles.change_password_container}>
        <InputComponent
          hidden={true}
          header="New Password"
          value={newPassword}
          setter={handlePasswordChange}
          borderType={passwordBorder}
          placeholder="Enter New Password"
        />
      </View>

      <View style={styles.confirm_password_container}>
        <InputComponent
          hidden={true}
          header="Confirm New Password"
          value={confirmPassword}
          setter={handleConfirmPasswordChange}
          borderType={passwordBorder}
          placeholder="Confirm New Password"
        />
      </View>
      <View style={styles.button_container}>
        <PrimaryButtonComponent
          title={'Change Password'}
          onPressing={handleChangePassword}
        ></PrimaryButtonComponent>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main_container: {
    width: '100%',
    height: 1500,
    backgroundColor: colors['secondary-light'],
  },
  logo_container: {
    alignItems: 'center',
    marginTop: 70,
  },
  change_password_container: {
    marginTop: 120,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  confirm_password_container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button_container: {
    paddingHorizontal: 20,
    height: 100,
  },
  back_button_container: {
    alignItems: 'flex-start',
    paddingTop: 5,
  },
});

export default ChangePassword;
