import React, { useEffect, useState } from 'react';
import colors from '../../utils/colorPallete';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import PrimaryButtonComponent from '../../components/PrimaryButtonComponent';
import {
  CommonActions,
  NavigationProp,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import { getLocalItem } from '../../utils/Utils';
import Constants from '../../utils/Constants';
import { newCardDetails } from '../../network/createCardAPI';
import { acceptNewCard } from '../../network/acceptCardAPI';
import Toast from 'react-native-root-toast';
import cloudinaryUpload from '../../network/cloudinaryUpload';
import CardComponent from '../../components/CardComponent';
import { useDispatch } from 'react-redux';
import {
  removeAllSelectedCards,
  removeSelectedCardId,
} from '../../store/selectedCardsSlice';
import { removeCardById } from '../../store/pendingCardsSlice';
import { setSharingProcess } from '../../store/sharingProcessSlice';
import InputComponent from '../../components/InputComponent';
import { SafeAreaView } from 'react-native-safe-area-context';

const SetContactNameScreen = ({ route }: any) => {
  const dispatch = useDispatch();
  const { cardDetails, sharing } = route.params;
  const [imageUploadProcessing, setImageUploadProcessing] = useState(false);
  console.log('\n\nSharing Status = ', sharing);
  const navigation = useNavigation<NavigationProp<any>>();
  const [newContactName, setNewContactName] = useState(
    route.params.cardDetails.card_name,
  );

  useEffect(() => {
    console.log('Card Name from Set contact Screen :', cardDetails);
  }, []);

  //Calling create card hook
  const createCard = async (sharing: boolean) => {
    try {
      if (!newContactName.trim()) {
        Toast.show('Please enter a name for the new contact', {
          position: Toast.positions.BOTTOM,
          duration: Toast.durations.LONG,
        });
        return;
      }
      const user_id = (await getLocalItem(Constants.USER_ID)) ?? '{}';
      const jwtToken = (await getLocalItem(Constants.USER_JWT)) ?? '{}';

      // Set the new contact name in the cardDetails
      let updatedCardDetails = {
        ...cardDetails,
        contact_name: newContactName,
      };

      // calling createNewCard Hook
      let response;
      if (sharing == true) {
        response = await acceptNewCard({
          user_id,
          jwtToken,
          card_id: route.params.card_id,
          newData: updatedCardDetails,
        });
      } else {
        if (cardDetails.img_front_link) {
          setImageUploadProcessing(true);
          const frontImgURL = await cloudinaryUpload({
            uri: cardDetails.img_front_link,
            type: 'image/jpeg',
            name: 'frontImg.jpg',
          });

          updatedCardDetails = {
            ...updatedCardDetails,
            img_front_link: frontImgURL,
          };
        }
        if (cardDetails.img_back_link) {
          const backImgURL = await cloudinaryUpload({
            uri: cardDetails.img_back_link,
            type: 'image/jpeg',
            name: 'backImg.jpg',
          });

          updatedCardDetails = {
            ...updatedCardDetails,
            img_back_link: backImgURL,
          };
        }
        response = await newCardDetails({
          user_id,
          jwtToken,
          card_id: route.params.card_id,
          newData: updatedCardDetails,
        });
      }

      const newStatus = response.statusCode;

      // if save successful, navigating to home screen
      if (newStatus === '200') {
        if (sharing === true) {
          navigation.dispatch(StackActions.pop(1));
          dispatch(removeSelectedCardId(cardDetails.card_id));
          dispatch(removeCardById({ card_id: cardDetails.card_id }));
        } else {
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{ name: 'Home' }],
            }),
          );
          navigation.navigate('Home', {});
        }
      }
    } catch (error) {
      console.error('Error creating new card:', error);
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* <Text style={styles.headerText}>Current Card</Text> */}
      <View style={styles.newCardContainer}>
        <CardComponent
          name={cardDetails.card_name}
          job_position={cardDetails.job_title}
          phone_number={cardDetails.phone}
          email={cardDetails.email}
          company_name={cardDetails.company_name}
        ></CardComponent>
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.chooseText}>Choose a Name for the</Text>
        <Text style={styles.newContact}>New Contact</Text>
        <View style={styles.inputText}>
          <InputComponent
            placeholder="Contact Name"
            value={newContactName}
            setter={setNewContactName}
            header="Contact Name"
          />
        </View>
        <View style={styles.buttonContainer}>
          {!imageUploadProcessing ? (
            <PrimaryButtonComponent
              title="Save"
              onPressing={() =>
                sharing ? createCard(true) : createCard(false)
              }
            />
          ) : (
            <PrimaryButtonComponent
              children={
                <ActivityIndicator
                  style={styles.loading}
                  size="large"
                  color={colors['secondary-light']}
                />
              }
              title={''}
            />
          )}
          <PrimaryButtonComponent
            title={'Go Back'}
            onPressing={() => {
              dispatch(setSharingProcess(false));
              dispatch(removeAllSelectedCards());
              navigation.dispatch(StackActions.pop(1));
            }}
            backgroundColor={colors['accent-white']}
            textColor={colors['primary-text']}
            isHighlighted={true}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 30,
    color: colors['primary-text'],
    alignSelf: 'center',
  },
  mainContainer: {
    backgroundColor: colors['primary-accent'],
    flex: 1,
  },
  newCardContainer: {
    paddingVertical: 50,
    padding: 25,
  },
  bottomContainer: {
    position: 'relative',
    backgroundColor: colors['secondary-light'],
    padding: 18,
    paddingHorizontal: 30,
    flex: 1,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,

    shadowColor: colors['primary-text'],
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  container: {
    backgroundColor: colors['secondary-light'],
    flex: 1,
    padding: 40,
    paddingTop: '40%',
  },
  chooseText: {
    marginTop: 20,
    alignSelf: 'center',
    color: colors['primary-text'],
    fontSize: 30,
  },
  newContact: {
    color: colors['primary-text'],
    fontSize: 30,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  buttonContainer: {
    // position: 'absolute',
    // marginTop: 400,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    // height: 50,
    width: '100%',
    gap: 10,
    alignSelf: 'center',
  },
  inputText: {
    marginTop: 30,
  },
  contactName: {
    fontSize: 22,
    color: colors['primary-text'],
  },
  loading: {},
});

export default SetContactNameScreen;
