import React, { useCallback, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../../utils/colorPallete';
import Phone from '../../assets/images/phone.svg';
import Company from '../../assets/images/company.svg';
import Person from '../../assets/images/person.svg';
import PrimaryButtonComponent from '../../components/PrimaryButtonComponent';
import { getProfile } from '../../network/getProfileDetailsAPI';
import { getLocalItem, setLocalItem } from '../../utils/Utils';
import Constants from '../../utils/Constants';
import { userLogin } from '../../store/userSlice';
import { useDispatch } from 'react-redux';
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import ProfileShimmer from '../../components/Shimmers/ProfileShimmer';
import TopMenuButton from '../../components/MenuButton';
import { useTranslation } from 'react-i18next';

type UserData = {
  email: string;
  fullName: string;
  phone: string;
  job_title: string;
  company_name: string;
  totalAcceptedCards: number;
  totalContacts: number;
  totalPendingCards: number;
};

type ResponseType = {
  userData: UserData;
  status: boolean;
};

const ProfileScreen = () => {
  const [profileResponse, setProfileResponse] = useState<ResponseType>({
    userData: {
      email: '',
      fullName: '',
      phone: '',
      job_title: '',
      company_name: '',
      totalAcceptedCards: 0,
      totalContacts: 0,
      totalPendingCards: 0,
    },
    status: false,
  });
  const splittedName = profileResponse?.userData.fullName.split(' ');
  const firstName = splittedName ? splittedName[0] : '';
  const [userId, setUserId] = useState('');
  const [jwtToken, setJwtToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchProfileData = async () => {
        try {
          const user_id = (await getLocalItem(Constants.USER_ID)) ?? '';
          setUserId(user_id);
          const jwtToken = (await getLocalItem(Constants.USER_JWT)) ?? '';
          setJwtToken(jwtToken);

          const response = await getProfile(user_id, jwtToken);

          console.log('\nResponse Details: ', response);
          setProfileResponse(response);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
        }
      };
      fetchProfileData();
    }, []),
  );

  const dispatch = useDispatch();
  const Logout = () => {
    setLocalItem(Constants.IS_LOGGED_IN, 'false');
    setLocalItem(Constants.USER_JWT, '');
    setLocalItem(Constants.USER_ID, '');
    dispatch(userLogin(false));
  };
  const navigation = useNavigation<NavigationProp<any>>();

  const navigateSharedContactsScreen = () => {
    navigation.navigate('CardStack', {
      screen: 'ViewSharedContactsScreen',
      params: {
        totalPendingCards: profileResponse.userData.totalPendingCards,
        totalAcceptedCards: profileResponse.userData.totalAcceptedCards,
      },
    });
  };
  const handlePasswordReset = () => {
    navigation.navigate('ChangePassword', {
      email: profileResponse?.userData.email ?? '',
      jwtToken: Constants.USER_JWT,
    });
  };
  const navigateToSettingsPage=()=>{
    navigation.navigate('CardStack', {
      screen: 'SettingsScreen',})
  }
  const navigateToAddProfileDetails = () => {
    navigation.navigate('CardStack', {
      screen: 'AddProfileDetailsScreen',
      params: {
        userId: userId,
        jwtToken: jwtToken,
        phone: profileResponse?.userData.phone,
        jobTitle: profileResponse?.userData.job_title,
        companyName: profileResponse?.userData.company_name,
      },
    });
  };
  const { t } = useTranslation();
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={styles.profileMainContainer}
    ><View style={styles.topLayer}>
      <TopMenuButton
    options={[
      {
        label: 'Go To Settings',
        onSelect:navigateToSettingsPage,
      },
    ]}
  />
    </View>
      
      <View style={styles.profileContainer}>
        <View style={styles.profileDetailsContainer}>
          <View style={styles.profileImageContainer}>
            <Text style={styles.profileText}>
              {profileResponse?.userData.fullName[0]}
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={navigateToAddProfileDetails}
            >
              <Image
                source={require('../../assets/images/editIcon.png')}
                style={styles.editIcon}
              ></Image>
            </TouchableOpacity>
          </View>
          {isLoading ? (
            <ProfileShimmer />
          ) : (
            <View style={styles.details}>
              <Text style={styles.userName}>Hi {firstName}!</Text>
              <Text style={styles.userEmail}>
                {profileResponse?.userData.email}
              </Text>

              <View style={styles.contactInfoContainer}>
                {profileResponse?.userData.phone == null ||
                profileResponse?.userData.phone == '' ? (
                  <TouchableOpacity
                    style={styles.contactInfo}
                    onPress={navigateToAddProfileDetails}
                  >
                    <Phone color={'primary-text'} style={styles.icons} />
                    <Text style={styles.phoneText}>{t('Add Phone Number')}</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.contactInfo}>
                    <Phone color={'primary-text'} style={styles.icons} />
                    <Text style={styles.phoneTextFilled}>
                      {profileResponse?.userData.phone}
                    </Text>
                  </View>
                )}

                {profileResponse?.userData.job_title == null ||
                profileResponse?.userData.job_title == '' ? (
                  <TouchableOpacity
                    style={styles.contactInfo}
                    onPress={navigateToAddProfileDetails}
                  >
                    <Person color={'primary-text'} style={styles.icons} />
                    <Text style={styles.phoneText}>{t('Add Job Title')}</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.contactInfo}>
                    <Person color={'primary-text'} style={styles.icons} />
                    <Text style={styles.phoneTextFilled}>
                      {profileResponse?.userData.job_title}
                    </Text>
                  </View>
                )}

                {profileResponse?.userData.company_name == null ||
                profileResponse?.userData.company_name == '' ? (
                  <TouchableOpacity
                    style={styles.contactInfo}
                    onPress={navigateToAddProfileDetails}
                  >
                    <Company color={'primary-text'} style={styles.icons} />
                    <Text style={styles.phoneText}>{t('Add Company Name')}</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.contactInfo}>
                    <Company color={'primary-text'} style={styles.icons} />
                    <Text style={styles.phoneTextFilled}>
                      {profileResponse?.userData.company_name}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>

        <View style={styles.middleContainer}>
          <Text style={styles.number}>
            {profileResponse?.userData.totalContacts}
          </Text>
          <Text style={styles.numberText}>{t('Total Contacts')}</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <PrimaryButtonComponent
            title={t('View Shared Contacts')}
            backgroundColor={colors['accent-white']}
            isHighlighted={true}
            onPressing={() => navigateSharedContactsScreen()}
          />
          <PrimaryButtonComponent
            title={t('Change Password')}
            backgroundColor={colors['accent-white']}
            textColor={colors['primary-danger']}
            isHighlighted={true}
            onPressing={() => handlePasswordReset()}
          />
          <PrimaryButtonComponent
            title={t("Logout")}
            onPressing={Logout}
            backgroundColor={colors['primary-danger']}
            textColor={colors['accent-white']}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  topLayer:{
    alignItems:'flex-end'
  },
  profileMainContainer: {
    backgroundColor: colors['secondary-light'],
    height: '100%',
    flex: 1,
  },
  profileContainer: {
    marginTop: 110,
    marginHorizontal: 20,
    flexDirection: 'column',
    gap: 45,
  },
  editButton: {
    height: 30,
    width: 30,
    borderRadius: 50,
    position: 'absolute',
    left: 200,
    bottom: -10,
  },
  editIcon: {
    height: 30,
    width: 30,
  },
  profileImageContainer: {
    position: 'relative',
    marginTop: -80,
    alignItems: 'center',
    justifyContent: 'center',

    height: 110,
    width: 110,
    backgroundColor: '#C21045',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'white',

    shadowColor: colors['primary-text'],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  profileText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors['secondary-light'],
  },
  profileDetailsContainer: {
    alignItems: 'center',
    backgroundColor: colors['secondary-light'],
    borderRadius: 15,

    shadowColor: colors['primary-text'],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  details: {
    marginTop: 10,
    alignItems: 'center',
  },
  userName: {
    fontSize: 38,
    fontWeight: 'bold',
    color: colors['primary-text'],
  },
  userEmail: {
    fontSize: 20,
    color: colors['accent-grey'],
  },
  contactInfoContainer: {
    marginTop: 20,
    alignItems: 'center',
    paddingBottom: 20,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icons: {
    marginRight: 15,
  },
  phoneText: {
    fontSize: 18,
    color: colors['primary-text'],
    textDecorationLine: 'underline',
  },
  phoneTextFilled: {
    fontSize: 18,
    color: colors['primary-text'],
  },
  middleContainer: {
    alignItems: 'center',
  },
  number: {
    fontSize: 52,
    fontWeight: 'bold',
    color: colors['primary-text'],
  },
  numberText: {
    fontSize: 20,
    color: colors['primary-text'],
  },
  buttonsContainer: {
    flexDirection: 'column',
    gap: 10,
    marginBottom: 20,
    height: 200,
    flex: 1,
  },
});

export default ProfileScreen;
