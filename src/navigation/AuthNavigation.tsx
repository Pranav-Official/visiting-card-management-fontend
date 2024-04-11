import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/AuthScreens/Login';
import SignUp from '../screens/AuthScreens/SignUp';
import OtpScreen from '../screens/AppScreens/OtpScreen';
// import SignUp from '../screens/AuthScreens/SignUp';

const StackNav = createNativeStackNavigator();
const AuthNavigationStack = () => {
  return (
    <StackNav.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <StackNav.Screen name="Login" component={Login} />
      <StackNav.Screen name="SignUp" component={SignUp} />
      <StackNav.Screen name = "OtpScreen" component={OtpScreen}/>
    </StackNav.Navigator>
  );
};

export default AuthNavigationStack;
