import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import colors from '../../utils/colorPallete';
import InputComponent from '../../components/InputComponent';
import PrimaryButtonComponent from '../../components/PrimaryButtonComponent';
import {
  RouteProp,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import { addProfileDetails } from '../../network/addProfileDetailsAPI';
import Toast from 'react-native-root-toast';
import { validatePhoneNumber } from '../../utils/regexCheck';

type RouteType = {
  route: RouteProp<
    {
      params: {
        userId: string;
        jwtToken: string;
        phone: string;
        jobTitle: string;
        companyName: string;
      };
    },
    'params'
  >;
};

const AddProfileDetailsScreen = ({ route }: RouteType) => {
  const { userId, jwtToken, phone, jobTitle, companyName } = route.params;
  const [newPhone, setPhone] = useState(phone);
  const [newJobTitle, setJobTitle] = useState(jobTitle);
  const [newCompanyName, setCompanyName] = useState(companyName);
  const navigation = useNavigation();

  const handleSave = async () => {
    if (!newPhone || !newJobTitle || !newCompanyName) {
      Toast.show('Please fill all the fields');
      return;
    }
    if (!validatePhoneNumber(newPhone)) {
      Toast.show('Please enter valid phone number');
      return;
    }

    const updatedDetails = await addProfileDetails(
      userId,
      jwtToken,
      newPhone,
      newJobTitle,
      newCompanyName,
    );

    console.log('\nUpdated Details: ', updatedDetails);
    if (updatedDetails === 200) {
      Toast.show('Details Updated Successfully');
      navigation.dispatch(StackActions.pop(1));
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.mainContainer}>
        <View style={styles.inputContainer}>
          <View style={styles.headingTextContainer}>
            <Text style={styles.headingText}>Enter the Details</Text>
          </View>
          <InputComponent
            header={'Phone'}
            value={newPhone}
            placeholder="Enter Phone Number"
            setter={(value: string) => {
              setPhone(value);
            }}
          />
          <InputComponent
            header={'Job Title'}
            value={newJobTitle}
            placeholder="Enter Job Title"
            setter={(value: string) => {
              setJobTitle(value);
            }}
          />
          <InputComponent
            header={'Company Name'}
            value={newCompanyName}
            placeholder="Enter Company Name"
            setter={(value: string) => {
              setCompanyName(value);
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <PrimaryButtonComponent
            title={'Save'}
            onPressing={handleSave}
          ></PrimaryButtonComponent>
          <PrimaryButtonComponent
            title={'Go Back'}
            backgroundColor={colors['accent-white']}
            isHighlighted={true}
            onPressing={() => {
              navigation.dispatch(StackActions.pop(1));
            }}
          ></PrimaryButtonComponent>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors['secondary-light'],
    paddingHorizontal: 20,
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 0,
    backgroundColor: colors['secondary-light'], // Adjust this value according to the height of the button container
  },
  headingTextContainer: {
    alignItems: 'center',
  },
  headingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors['primary-text'],
  },
  inputContainer: {
    flexDirection: 'column',
    marginTop: 200,
    gap: 10,
  },
  buttonContainer: {
    position: 'relative',
    top: 220,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 10,
  },
});

export default AddProfileDetailsScreen;
