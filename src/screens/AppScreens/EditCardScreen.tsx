import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PersonIcon from '../../assets/images/person.svg';
import CompanyIcon from '../../assets/images/company.svg';
import PhoneIcon from '../../assets/images/phone.svg';
import MailIcon from '../../assets/images/mail.svg';
import WebsiteIcon from '../../assets/images/website.svg';
import DesignationIcon from '../../assets/images/jobTitle.svg';
import colors from '../../utils/colorPallete';
import PrimaryButtonComponent from '../../components/PrimaryButtonComponent';
import CommonImageComponent from '../../components/CommonImageComponent';
import EditInputComponent from '../../components/InputComponent';
import EditCardNameComponent from '../../components/EditCardNameComponent';
import BackButtonIcon from '../../assets/images/Arrow.svg';
import { editCardDetails } from '../../network/editCardAPI';
import Constants from '../../utils/Constants';
import { getLocalItem } from '../../utils/Utils';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import BottomSheetComponent from '../../components/BottomSheetComponent';
import SimilarCardsComponent from '../../components/SimilarCardsComponent';
import { getSimilarCards } from '../../network/getSimilarCardsAPI';
import { validateEmail, validatePhoneNumber } from '../../utils/regexCheck';
import Toast from 'react-native-root-toast';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type Card = {
  card_id: string;
  card_name: string;
  email: string;
  phone: string;
  job_title: string;
  company_name: string;
  company_website: string;
  img_front_link: string;
  img_back_link: string;
};
type ContactCards = {
  contact_name: string;
  cards: Card[];
};
//To set border color for  mandatory fields
type BorderTypes = 'Danger' | 'Auth' | 'Normal';

//Edit Card Details Screen
const EditCardDetails = ({ route }: any) => {
  const [cardDetails, setCardDetails] = useState(route.params.cardDetails);
  const navigation = useNavigation<NavigationProp<any>>();
  const [nameBorder, setNameBorder] = useState<BorderTypes>('Normal');
  const [emailBorder, setEmailBorder] = useState<BorderTypes>('Normal');
  const [phoneBorder, setPhoneBorder] = useState<BorderTypes>('Normal');
  const [mandatoryFieldsEmpty, setMandatoryFieldsEmpty] = useState(false);

  const [similarCardList, setSimilarCardList] = React.useState<ContactCards>({
    contact_name: '',
    cards: [],
  });

  //To set similar card modal visibility state
  const [modalVisibility, setModalVisibility] = React.useState(false);
  //Pre-filling edit page card details
  useEffect(() => {
    if (route.params.cardDetails) {
      setCardDetails(route.params.cardDetails);
    }
  }, [route.params.cardDetails]);
  //If create flag is false, function to save the edits(Function for edit card page)
  const saveEditChanges = async () => {
    try {
      const user_id = (await getLocalItem(Constants.USER_ID)) ?? '{}';
      const token = (await getLocalItem(Constants.USER_JWT)) ?? '{}';

      if (cardDetails.phone) {
        cardDetails.phone = cardDetails.phone.replace(/[\s()-]+/g, '');
      }
      // Filtering out the edited fields
      const editedData = Object.keys(cardDetails)
        .filter((key) => cardDetails[key] !== route.params.cardDetails[key])
        .reduce((obj: any, key) => {
          obj[key] = cardDetails[key];
          return obj;
        }, {});

      if (Object.keys(editedData).length === 0) {
        // If no edits, navigate back to card details
        navigation.navigate('CardStack', {
          screen: 'CardDetailsScreen',
          params: { card_id: route.params.card_id },
        });
        return;
      }

      //calling editCardDetails Hook
      const response = await editCardDetails({
        user_id,
        token,
        card_id: route.params.card_id,
        updatedData: editedData,
      });

      const isSaved = response.statusCode;

      //if save successful,navigating to cardDetails screen
      if (isSaved === '200') {
        Toast.show('Card edited successfully');
        navigation.navigate('CardStack', {
          screen: 'CardDetailsScreen',
          params: { card_id: route.params.card_id },
        });
      }
    } catch (error) {
      console.error('Error editing card:', error);
    }
  };
  // function called when a newly created card or edited card is saved
  const handleSavePress = async () => {
    if (cardDetails.card_name != undefined && !cardDetails.card_name.trim()) {
      setNameBorder('Danger');
    }
    if (cardDetails.phone != undefined && !cardDetails.phone.trim()) {
      setPhoneBorder('Danger');
    }
    if (cardDetails.email != undefined && !cardDetails.email.trim()) {
      setEmailBorder('Danger');
    }
    if (
      (cardDetails.email != undefined && !cardDetails.email.trim()) ||
      (cardDetails.phone != undefined && !cardDetails.phone.trim()) ||
      (cardDetails.card_name != undefined && !cardDetails.card_name.trim())
    ) {
      setMandatoryFieldsEmpty(true);
      return;
    }
    // Initialize variables to track validation status
    const isValidPhone =
      validatePhoneNumber(cardDetails.phone, 'IN') ||
      validatePhoneNumber(cardDetails.phone, 'JP');
    const isValidEmail = validateEmail(cardDetails.email);

    // Check if both phone and email are invalid
    if (!isValidPhone && !isValidEmail) {
      setPhoneBorder('Danger');
      setEmailBorder('Danger');
      setMandatoryFieldsEmpty(true);
      return;
    }

    // Check if phone is invalid
    if (!isValidPhone) {
      setPhoneBorder('Danger');
      setMandatoryFieldsEmpty(true);
      return;
    }

    // Check if email is invalid
    if (!isValidEmail) {
      setEmailBorder('Danger');
      setMandatoryFieldsEmpty(true);
      return;
    }

    // checking whether edits are for creating a card
    if (route.params.create) {
      //Card name editable only on create a new card page
      if (!cardDetails.card_name.trim()) {
        setMandatoryFieldsEmpty(true);
        setNameBorder('Danger');
        return;
      }
      if (!mandatoryFieldsEmpty) {
        //calls the fetchSimilarCards api hook
        const SimilarCardsCheck = await fetchSimilarCards();

        //if similar cards exist, show the modal, else go to add contact screen
        if (SimilarCardsCheck) {
          setModalVisibility(true);
        } else {
          navigation.navigate('SetContactNameScreen', {
            cardDetails: cardDetails,
          });
        }
      }
    } else {
      // If create flag is false, call saveChanges function
      await saveEditChanges();
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setCardDetails({ ...cardDetails, [key]: value });
    //setting non empty states for mandatory fields for entries
    if (key === 'card_name') {
      if (cardDetails.card_name && !cardDetails.card_name.trim()) {
        setNameBorder('Danger');
        setMandatoryFieldsEmpty(true);
      }
      setMandatoryFieldsEmpty(false);
      setNameBorder('Normal');
    }
    if (key === 'email') {
      if (cardDetails.email && !cardDetails.email.trim()) {
        setEmailBorder('Danger');
        setMandatoryFieldsEmpty(true);
      }
      setMandatoryFieldsEmpty(false);
      setEmailBorder('Normal');
    }
    if (key === 'phone') {
      if (cardDetails.phone && !cardDetails.phone.trim()) {
        setPhoneBorder('Danger');
        setMandatoryFieldsEmpty(true);
      }
      setMandatoryFieldsEmpty(false);
      setPhoneBorder('Normal');
    }
  };
  //function to fetch similar cards from user's contacts
  const fetchSimilarCards = async () => {
    try {
      const user_id = (await getLocalItem(Constants.USER_ID)) ?? '';
      const jwtToken = (await getLocalItem(Constants.USER_JWT)) ?? '';
      const result = await getSimilarCards({
        user_id,
        card_name: cardDetails.card_name,
        phone: cardDetails.phone,
        email: cardDetails.email,
        jwtToken,
      });

      setSimilarCardList(result.similarCardList);

      if (result.statusCode === '200') {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('\n\nCatch Error\n\n', error);
    }
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={styles.editContainer}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <MaterialIcons
            name="arrow-back"
            color={'black'}
            size={34}

          />
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        <CommonImageComponent
          frontImageUri={cardDetails.img_front_link}
          backImageUri={cardDetails.img_back_link}
        />
      </View>
      {!route.params.create && (
        <View style={styles.cardNameHead}>
          <EditCardNameComponent
            value={cardDetails.card_name}
            setter={(value: string) => handleInputChange('card_name', value)}
            readonly={!route.params.create}
          />
        </View>
      )}
      <View style={styles.inputFieldsContainer}>
        {route.params.create && (
          <View style={styles.iconField}>
            <View style={styles.icon}>
              <PersonIcon width={30} height={20} />
            </View>
            <View style={styles.input}>
              <EditInputComponent
                placeholder="Card Name"
                header="Card Name"
                hidden={false}
                value={cardDetails.card_name}
                setter={(value: string) =>
                  handleInputChange('card_name', value)
                }
                borderType={nameBorder}
              />
            </View>
          </View>
        )}
        <View style={styles.iconField}>
          <View style={styles.icon}>
            <DesignationIcon width={30} height={20} />
          </View>
          <View style={styles.input}>
            <EditInputComponent
              placeholder="Job title"
              header="Job Title"
              hidden={false}
              value={cardDetails.job_title}
              setter={(value: string) => handleInputChange('job_title', value)}
            />
          </View>
        </View>
        <View style={styles.iconField}>
          <View style={styles.icon}>
            <CompanyIcon width={30} height={20} />
          </View>
          <View style={styles.input}>
            <EditInputComponent
              placeholder="Company Name"
              header="Company Name"
              hidden={false}
              value={cardDetails.company_name}
              setter={(value: string) =>
                handleInputChange('company_name', value)
              }
            />
          </View>
        </View>
        <View style={styles.iconField}>
          <View style={styles.icon}>
            <PhoneIcon width={30} height={20} />
          </View>
          <View style={styles.input}>
            <EditInputComponent
              placeholder="Phone Number"
              header="Phone Number"
              hidden={false}
              value={cardDetails.phone}
              setter={(value: string) => handleInputChange('phone', value)}
              borderType={phoneBorder}
            />
          </View>
        </View>
        <View style={styles.iconField}>
          <View style={styles.icon}>
            <MailIcon width={30} height={20} />
          </View>
          <View style={styles.input}>
            <EditInputComponent
              placeholder="E-mail"
              header="E-mail"
              hidden={false}
              value={cardDetails.email}
              setter={(value: string) => handleInputChange('email', value)}
              borderType={emailBorder}
            />
          </View>
        </View>
        <View style={styles.iconField}>
          <View style={styles.icon}>
            <WebsiteIcon width={30} height={20} />
          </View>
          <View style={styles.input}>
            <EditInputComponent
              placeholder="Website"
              header="Website"
              hidden={false}
              value={cardDetails.company_website}
              setter={(value: string) =>
                handleInputChange('company_website', value)
              }
            />
          </View>
        </View>
      </View>
      <View style={styles.save}>
        <View>
          {/* toggle indicating mandatory fields are empty or invalid data in fields*/}
          {mandatoryFieldsEmpty && (
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleMessage}>
                Please fill the above fields with valid data.
              </Text>
            </View>
          )}
        </View>
        <PrimaryButtonComponent title={'Save'} onPressing={handleSavePress} />
      </View>
      {/* Similar Cards displaying modal */}
      <BottomSheetComponent
        visibility={modalVisibility}
        visibilitySetter={setModalVisibility}
      >
        <SimilarCardsComponent
          cardDetails={cardDetails}
          similarCardList={similarCardList}
          modalVisibilitySetter={setModalVisibility}
        />
      </BottomSheetComponent>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  editContainer: {
    backgroundColor: colors['secondary-light'],
  },
  contactName: {
    paddingStart: 10,
    fontSize: 24,
    color: colors['primary-text'],
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: colors['secondary-light'],
    marginTop: 20,
  },
  cardName: {
    fontSize: 35,
    fontWeight: '700',
    color: colors['primary-text'],
  },
  iconField: {
    flexDirection: 'row',
    width: '100%',
  },
  icon: {
    flex: 1,
    alignSelf: 'center',
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: colors['secondary-grey'],
  },
  input: {
    flex: 10,
    paddingRight: 10,
  },
  save: {
    height: 170,
    padding: 30,
  },
  cardNameHead: {
    marginTop: 5,
    marginBottom: 5,
  },
  inputFieldsContainer: {
    marginRight: 25,
    marginLeft: 25,
  },
  backButton: {
    width: '100%',
    marginTop: 20,
    marginLeft: 20,
  },
  //mandatory fields -toggle styling
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
    marginBottom: 10,
    backgroundColor: colors['secondary-grey'],
  },
  toggleMessage: {
    color: colors['primary-danger'],
    fontSize: 15,
    marginTop: 10,
  },
});

export default EditCardDetails;
