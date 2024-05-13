import React, { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ContactListComponent from '../../components/ContactListComponent';
import { getContactList } from '../../network/contactListAPI';
import { getLocalItem, setLocalItem } from '../../utils/Utils';
import Constants from '../../utils/Constants';
import ImagePicker from 'react-native-image-crop-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import colors from '../../utils/colorPallete';
import SearchBarComponent from '../../components/SearchBarComponent';
import ContactShimmer from '../../components/Shimmers/ContactShimmer';
import { getPendingCards } from '../../network/getPendingCardsAPI';
import BottomSheetComponent from '../../components/BottomSheetComponent';
import PrimaryButtonComponent from '../../components/PrimaryButtonComponent';
import CardComponent from '../../components/CardComponent';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { setCards } from '../../store/pendingCardsSlice';
import { RootState } from '../../store';
import { useTranslation } from 'react-i18next';

type Contact = {
  card_id: string;
  contact_name: string;
  cardListCount: number;
};

type Card = {
  card_id: string;
  card_name: string;
  img_front_link: string;
  img_back_link: string;
  job_title: string;
  email: string;
  phone: string;
  company_name: string;
  company_website: string;
  contact_name: string;
  user_id: string;
};

type UserData = {
  user_id: string;
  user_fullname: string;
  user_email: string;
  cards: Card[];
};

const ContactsPage = () => {
  const [secondaryButtonVisibility, setSecondaryButtonVisibility] =
    useState(false);
  const navigation = useNavigation<NavigationProp<any>>();
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [pendingCardList, setPendingCardList] = React.useState<UserData[]>();

  const [modalVisibility, setModalVisibility] = React.useState(false);

  const dispatch = useDispatch();
  const reduxPendingCardList = useSelector(
    (state: RootState) => state.pendingCardsReducer.pendingCardList,
  );

  const get = async () => {
    const user_id = (await getLocalItem(Constants.USER_ID)) || '';
    const response = await getContactList(user_id);
    if (response.status === false) {
      return;
    } else {
      setContactList(
        response.data.sort((a: Contact, b: Contact) =>
          a.contact_name.localeCompare(b.contact_name),
        ),
      );
      setLoading(false);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.pendingCardsContainer}>
      <Text style={styles.userNameInModal}>From {item.user_fullname}</Text>

      {item.cards.map((card: Card) => (
        <View style={styles.singleCard} key={card.user_id + card.card_id}>
          <CardComponent
            key={card.card_id}
            alignToSides={false}
            job_position={card.job_title}
            name={card.card_name}
            email={card.email}
            phone_number={card.phone}
            company_name={card.company_name}
          />
        </View>
      ))}
    </View>
  );

  //calling get pending cards function
  const getPendingCardsList = async () => {
    try {
      const SAVE_SHARES_LATER = await getLocalItem(Constants.SAVE_SHARES_LATER);
      if (SAVE_SHARES_LATER === 'true') {
        return;
      }
      const user_id = (await getLocalItem(Constants.USER_ID)) || '';
      const jwtToken = (await getLocalItem(Constants.USER_JWT)) || '';
      const pendingCards = await getPendingCards({ user_id, jwtToken });

      if (pendingCards.statusCode !== '200') {
        return;
      }

      if (
        pendingCards.pendingCardList &&
        pendingCards.pendingCardList.length > 0
      ) {
        setModalVisibility(true);
        setPendingCardList(pendingCards.pendingCardList);
        dispatch(setCards(pendingCards.pendingCardList));
      } else {
        setModalVisibility(false);
      }
    } catch (error) {
      console.log('\n\nCatch Error\n\n ', error);
    }
  };

  const takeImage = async () => {
    ImagePicker.openCamera({
      cropping: true,
      width: 1600,
      height: 900,
      freeStyleCropEnabled: true,
    })
      .then(async (image) => {
        navigation.navigate('CardStack', {
          screen: 'CropConfirmationScreen',
          params: { image },
        });
      })
      .catch((err) => {
        console.log('Error occured', err);
      });
    console.log('redux state log ', reduxPendingCardList);
  };
  const chooseImage = async () => {
    ImagePicker.openPicker({
      cropping: true,
      width: 3000,
      height: 1500,
      freeStyleCropEnabled: true,
    })
      .then(async (image) => {
        navigation.navigate('CardStack', {
          screen: 'CropConfirmationScreen',
          params: { image, isComingFromCamera: false },
        });
      })
      .catch((err) => {
        console.log('Error occured', err);
      });
  };
  useEffect(() => {
    try {
      getPendingCardsList();
    } catch (error) {
      console.log('\n\nCatch Error\n\n');
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setSecondaryButtonVisibility(false);
      const fetchData = async () => {
        try {
          await get();
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }, []),
  );

  const contactPage = async (id: string, name: string) => {
    const contact = contactList.find((contact) => contact.card_id === id);

    if (contact?.cardListCount === 1) {
      const cardId = contact.card_id;
      navigation.navigate('CardStack', {
        screen: 'CardDetailsScreen',
        params: { card_id: cardId },
      });
    } else {
      navigation.navigate('CardStack', {
        screen: 'CardListScreen',
        params: { card_id: id, name: name },
      });
    }
  };
  const cardListPage = (id: string, name: string) => {
    navigation.navigate('CardStack', {
      screen: 'CardListScreen',
      params: { card_id: id, name: name },
    });
  };
  const goToSearchScreen = () => {
    navigation.navigate('SearchScreen');
  };

  return (
    <SafeAreaView>
      <View style={styles.SafeAreaView}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{t('Contacts')}</Text>
      </View>
      <TouchableOpacity onPress={goToSearchScreen}>
        <SearchBarComponent editable={false} />
      </TouchableOpacity>

      {loading ? (
        <ContactShimmer />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 20 }}
          data={contactList}
          renderItem={({ item }) => (
            <ContactListComponent
              contactName={item.contact_name}
              onPress={() => contactPage(item.card_id, item.contact_name)}
              onLongPress={() => cardListPage(item.card_id, item.contact_name)}
            />
          )}
          keyExtractor={(item) => item.card_id + item.contact_name}
          scrollEventThrottle={16}
        />
      )}
      <View style={styles.ActionButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.secondaryButtons,
            { display: secondaryButtonVisibility ? 'flex' : 'none' },
          ]}
          onPress={() => {
            navigation.navigate('CardStack', {
              screen: 'EditCardScreen',
              params: {
                create: true,
                cardDetails: {
                  card_name: '',
                  job_title: '',
                  email: '',
                  phone: '',
                  company_name: '',
                  company_website: '',
                },
              },
            });
          }}
        >
          <MaterialCommunityIcons
            style={{ alignSelf: 'center' }}
            name="file-document-edit-outline"
            size={35}
            color={colors['secondary-accent']}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.secondaryButtons,
            { display: secondaryButtonVisibility ? 'flex' : 'none' },
          ]}
          onPress={chooseImage}
        >
          <MaterialIcons
            style={{ alignSelf: 'center' }}
            name="photo-library"
            size={35}
            color={colors['secondary-accent']}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={takeImage}
          onLongPress={() => {
            setSecondaryButtonVisibility(!secondaryButtonVisibility);
          }}
          style={styles.cameraButton}
        >
          <Ionicons
            name="camera"
            size={48}
            color={colors['secondary-accent']}
          />
        </TouchableOpacity>
      </View>

      <BottomSheetComponent
        visibility={modalVisibility}
        visibilitySetter={setModalVisibility}
      >
        <View style={styles.modalView}>
          <Text style={styles.pendingCardsText}>
            The following cards have been shared with you.
          </Text>

          <FlatList
            data={pendingCardList}
            renderItem={renderItem}
            keyExtractor={(item) =>
              item.user_id + JSON.stringify(item).slice(0, 5)
            }
          />
          <View style={styles.buttonContainer}>
            <Text style={styles.pendingCardsText}>Choose an Option</Text>
            <PrimaryButtonComponent
              title="Save shared cards"
              onPressing={() => {
                setModalVisibility(false);
                navigation.navigate('CardStack', {
                  screen: 'SaveShareCardScreen',
                  params: { pendingCardList },
                });
              }}
            ></PrimaryButtonComponent>
            <PrimaryButtonComponent
              title="I'll do it later"
              onPressing={async () => {
                setModalVisibility(false);
                await setLocalItem(Constants.SAVE_SHARES_LATER, 'true');
              }}
              textColor={colors['primary-text']}
              backgroundColor={colors['accent-white']}
              isHighlighted={true}
            ></PrimaryButtonComponent>
          </View>
        </View>
      </BottomSheetComponent>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  SafeAreaView: {
    padding: 28,
    paddingTop: 36,
    backgroundColor: colors['secondary-light'],
    height: '100%',
    overflow: 'scroll',
  },
  headerContainer: {},
  headerTitle: {
    fontSize: 50,
    marginTop: 60,
    color: colors['primary-text'],
  },
  ActionButtonsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
    position: 'absolute',
    bottom: 0,
    marginBottom: 70,
    right: 30,
  },
  cameraButton: {
    backgroundColor: colors['primary-accent'],
    borderRadius: 18,
    padding: 9,
    paddingTop: 7,
  },
  secondaryButtons: {
    height: 50,
    width: 50,
    backgroundColor: colors['primary-accent'],
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  //Modal Stylings
  modalView: {
    marginHorizontal: 25,
    height: '100%',
  },
  pendingCardsText: {
    textAlign: 'center',
    color: colors['primary-text'],
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  pendingCardsContainer: {
    borderWidth: 2,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingBottom: 10,
    marginBottom: 20,
  },
  userNameInModal: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors['primary-text'],
    paddingVertical: 10,
    marginLeft: 10,
  },
  singleCard: {
    paddingBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 10,
    height: 200,
    marginBottom: 25,
  },
});

export default ContactsPage;
