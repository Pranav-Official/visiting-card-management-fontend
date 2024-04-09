import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import colors from '../utils/colorPallete';
import ContactsPage from '../screens/AppScreens/Contacts';
import CardListScreen from '../screens/AppScreens/CardListScreen';
import CardDetailsScreen from '../screens/AppScreens/CardDetailsScreen';
import EditCardScreen from '../screens/AppScreens/EditCardScreen';
import SetContactNameScreen from '../screens/AppScreens/SetContactNameScreen';
import AddToContactScreen from '../screens/AppScreens/AddToContactScreen';
import CardOverwriteScreen from '../screens/AppScreens/CardOverwriteScreen';
import ProfileScreen from '../screens/AppScreens/ProfileScreen';
import CropConfirmationScreen from '../screens/AppScreens/CropConfirmationScreen';
import SaveShareCardScreen from '../screens/AppScreens/SaveShareCardScreen';
import SearchScreen from '../screens/AppScreens/SearchScreen';
import SharedContactsScreen from '../screens/AppScreens/SharedContactsScreen';
import ViewSharedContactsScreen from '../screens/AppScreens/ViewSharedContactsScreen';
import ChangePassword from '../screens/AuthScreens/ChangePassword';
import AddProfileDetailsScreen from '../screens/AppScreens/AddProfileDetailsScreen';
import "../i18n/i18n"; 
import { useTranslation } from 'react-i18next';
import SettingsScreen from '../screens/AppScreens/SettingsScreen';
const StackNav = createNativeStackNavigator();
const HomeStackNavigation = () => {
  return (
    <StackNav.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <StackNav.Screen name="Home" component={HomeBottomBarNavigation} />
      <StackNav.Screen name="SearchScreen" component={SearchScreen} />
      <StackNav.Screen name="CardStack" component={CardStackNavigation} />
      <StackNav.Screen name="ChangePassword" component={ChangePassword} />
    </StackNav.Navigator>
  );
};

const BottomBarNavigation = createBottomTabNavigator();
const HomeBottomBarNavigation = () => {
  const { t } = useTranslation();
  return (
    <BottomBarNavigation.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 15,
          borderWidth: 0,
        },
        tabBarStyle: {
          backgroundColor: colors['accent-white'],
          borderColor: colors['secondary-light'],
          shadowColor: colors['secondary-light'],
          paddingBottom: 14,
          paddingTop: 10,
          zIndex: 10,
          height: 90,
          marginTop: -30,
        },
        tabBarActiveTintColor: colors['secondary-accent'],
        tabBarInactiveTintColor: colors['accent-grey'],
      }}
    >
      <BottomBarNavigation.Screen
        name={t("Contacts")}
        component={ContactsPage}
        options={{
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="contacts"
              size={36}
              color={
                useIsFocused()
                  ? colors['secondary-accent']
                  : colors['accent-grey']
              }
            />
          ),
        }}
      />
      <BottomBarNavigation.Screen
        name={t("Profile")}
        component={ProfileScreen}
        options={{
          tabBarIcon: () => (
            <Ionicons
              name="person-circle-outline"
              size={36}
              color={
                useIsFocused()
                  ? colors['secondary-accent']
                  : colors['accent-grey']
              }
            />
          ),
        }}
      />
    </BottomBarNavigation.Navigator>
  );
};

const CardStackNav = createNativeStackNavigator();

const CardStackNavigation = () => {
  return (
    <CardStackNav.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <StackNav.Screen name="CardListScreen" component={CardListScreen} />
      <StackNav.Screen name="CardDetailsScreen" component={CardDetailsScreen} />
      <StackNav.Screen name="EditCardScreen" component={EditCardScreen} />
      <StackNav.Screen name="SettingsScreen" component={SettingsScreen} />
      <StackNav.Screen
        name="CardOverwriteScreen"
        component={CardOverwriteScreen}
      />
      <StackNav.Screen
        name="SetContactNameScreen"
        component={SetContactNameScreen}
      />
      <StackNav.Screen
        name="SaveShareCardScreen"
        component={SaveShareCardScreen}
      />
      <StackNav.Screen
        name="AddToContactScreen"
        component={AddToContactScreen}
      />
      <StackNav.Screen
        name="CropConfirmationScreen"
        component={CropConfirmationScreen}
      />
      <StackNav.Screen
        name="ViewSharedContactsScreen"
        component={ViewSharedContactsScreen}
      />
      <StackNav.Screen
        name="SharedContactsScreen"
        component={SharedContactsScreen}
      />
      <StackNav.Screen
        name="AddProfileDetailsScreen"
        component={AddProfileDetailsScreen}
      />
    </CardStackNav.Navigator>
  );
};

export default HomeStackNavigation;
