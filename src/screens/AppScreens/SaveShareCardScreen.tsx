import React, { useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../../utils/colorPallete';
import CardComponent from '../../components/CardComponent';
import PrimaryButtonComponent from '../../components/PrimaryButtonComponent';
import RadioButton from '../../components/RadioButton';
import { getLocalItem, setLocalItem } from '../../utils/Utils';
import Constants from '../../utils/Constants';
import {
  CommonActions,
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import BottomSheetComponent from '../../components/BottomSheetComponent';
import SimilarCardsComponent from '../../components/SimilarCardsComponent';
import { getSimilarCards } from '../../network/getSimilarCardsAPI';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedCardIds } from '../../store/selectedCardsSlice';
import { RootState } from '../../store';
import { setSharingProcess } from '../../store/sharingProcessSlice';
import { rejectCard } from '../../network/rejectCardAPI';

type Card = {
  card_id: string;
  card_name: string | '';
  company_name: string | '';
  company_website: string | '';
  contact_name: string | '';
  email: string | '';
  img_back_link: string | '';
  img_front_link: string | '';
  job_title: string | '';
  phone: string | '';
  user_id: string | '';
};

type UserData = {
  user_id: string;
  user_fullname: string;
  user_email: string;
  cards: Card[];
};

type ContactCards = {
  contact_name: string;
  cards: Card[];
};

type renderItemType = {
  item: UserData;
  selected: string[];
  setter: (cardIdList: string[]) => void;
};

const RenderItem = ({ item, selected, setter }: renderItemType) => {
  const handleCardPress = (
    selectedCardList: string[],
    currentCardId: string,
  ) => {
    if (selectedCardList.includes(currentCardId)) {
      setter(selectedCardList.filter((cardId) => cardId != currentCardId));
    } else {
      setter([...selected, currentCardId]);
    }
  };

  return (
    <SafeAreaView>
    <View
      style={[
        styles.similarCardsContainer,
        { flexDirection: 'column', marginBottom: 20, gap: 20 },
      ]}
    >
      <Text style={styles.contactName}> From User: {item.user_fullname}</Text>
      {item.cards.map((card: Card) => (
        <View style={{ flexDirection: 'row' }} key={card.card_id}>
          <TouchableOpacity
            style={{ flex: 1, paddingTop: 5 }}
            onPress={() => handleCardPress(selected, card.card_id)}
          >
            {selected?.includes(card.card_id) ? (
              <RadioButton selected={true} />
            ) : (
              <RadioButton selected={false} />
            )}
          </TouchableOpacity>
          <View style={{ flex: 6 }}>
            <CardComponent
              alignToSides={false}
              job_position={card.job_title}
              name={card.card_name}
              email={card.email}
              phone_number={card.phone}
              company_name={card.company_name}
            />
          </View>
        </View>
      ))}
    </View>
    </SafeAreaView>
  );
};

const SaveShareCardScreen = ({ route }: any) => {
  const dispatch = useDispatch();
  const reduxSharingProcess = useSelector(
    (state: RootState) => state.sharingProcessReducer.sharingProcess,
  );
  const [similarModalVisibility, setSimilarModalVisibility] =
    React.useState(false);
  const pendingCardList = useSelector(
    (state: RootState) => state.pendingCardsReducer.pendingCardList,
  );
  const [similarCardList, setSimilarCardList] = React.useState<ContactCards>({
    contact_name: '',
    cards: [],
  });
  const [cardDetails, setCardDetails] = useState<Card>();
  const [selected, setSelected] = useState<string[]>([]);
  const reduxSelectedCardIds = useSelector(
    (state: RootState) => state.selectedCardReducer.selectedCardIds,
  );
  const navigation = useNavigation<NavigationProp<any>>();
  // let cardIdsToBeRejected: string[] = [];
  const [cardIdsToBeRejected, setCardIdsToBeRejected] = useState<string[]>([]);

  const handleSave = async () => {
    console.log('reject value', reject);
    if (selected.length > 0) {
      try {
        dispatch(setSharingProcess(true));
        dispatch(setSelectedCardIds(selected));
        let tempCardsIds: string[] = [];
        pendingCardList.forEach((user) => {
          user.cards.forEach((card) => {
            selected.forEach((reduxCardID) => {
              if (card.card_id != reduxCardID) {
                tempCardsIds.push(card.card_id);
              }
            });
          });
        });
        setCardIdsToBeRejected(tempCardsIds);
        console.log('cards to be rejected', cardIdsToBeRejected);
      } catch (error) {
        console.log('Error while handling save:', error);
      }
    }
  };

  const saveMultipleCards = async (card_id: string) => {
    let selectCard: Card = {
      card_id: '',
      card_name: '',
      company_name: '',
      company_website: '',
      contact_name: '',
      email: '',
      img_back_link: '',
      img_front_link: '',
      job_title: '',
      phone: '',
      user_id: '',
    };
    pendingCardList.forEach((pendingCardItem) => {
      pendingCardItem.cards.forEach((card) => {
        if (card.card_id === card_id) {
          selectCard = card;
          setCardDetails(card);
        }
      });
    });
    const similarCard = await fetchSimilarCards(selectCard);
    console.log('\n\nSimilar Cards found: ', similarCard);
    console.log('\n\nSimilar CArd modal visibility: ', similarModalVisibility);

    if (similarCard === true) {
      setSimilarModalVisibility(true);
    } else {
      setSimilarCardList({ contact_name: '', cards: [] });
      setSimilarModalVisibility(false);
      const sharing = true;
      navigation.navigate('CardStack', {
        screen: 'SetContactNameScreen',
        params: { cardDetails: selectCard, sharing },
      });
    }
  };

  const handleRemoveCards = async () => {
    try {
      const response = await rejectCard({
        card_ids: cardIdsToBeRejected,
      });

      console.log('rejectCard API response:', response);
    } catch (error) {
      console.log('Error while rejecting cards:', error);
    }
  };

  const fetchSimilarCards = async (card: Card) => {
    try {
      const user_id = (await getLocalItem(Constants.USER_ID)) ?? '';
      const jwtToken = (await getLocalItem(Constants.USER_JWT)) ?? '';
      console.log('\ncardDetails = ', card);
      const result = await getSimilarCards({
        user_id,
        card_name: card.card_name,
        phone: card.phone,
        email: card.email,
        jwtToken,
      });

      console.log('Result Is: ', result);

      if (result.statusCode === '200') {
        setSimilarCardList(result.similarCardList);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('Error fetching SimilarCards:', error);
      return false;
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setCardDetails({});
      if (reduxSelectedCardIds.length > 0 && reduxSharingProcess === true) {
        console.log('\n\nUSE FOCUSS SHARED CARD SCREEN!!!');
        setSelected(reduxSelectedCardIds);
        saveMultipleCards(reduxSelectedCardIds[0]);
      } else if (
        reduxSelectedCardIds.length === 0 &&
        reduxSharingProcess === true
      ) {
        if (reject) {
          console.log(
            'final if reject cards to be rejected',
            cardIdsToBeRejected,
          );
          handleRemoveCards();
        }
        dispatch(setSharingProcess(false));
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: 'Home' }],
          }),
        );
        setLocalItem(Constants.SAVE_SHARES_LATER, 'true');
      }
    }, [reduxSelectedCardIds]),
  );

  const [reject, setReject] = useState(false);
  const handleReject = () => {
    setReject(!reject);
  };

  return (
    <View style={{ padding: 18, flex: 1 }}>
      <Text
        style={{
          fontSize: 28,
          color: colors['primary-text'],
          fontWeight: '600',
          marginBottom: 20,
          textAlign: 'center',
        }}
      >
        Choose the cards to save
      </Text>
      <View style={styles.delete_card}>
        <TouchableOpacity onPress={handleReject}>
          <RadioButton selected={reject}></RadioButton>
        </TouchableOpacity>
        <Text style={styles.delete_text}>Reject Unselected cards</Text>
      </View>
      <FlatList
        data={pendingCardList}
        renderItem={({ item }) => {
          return (
            <RenderItem item={item} selected={selected} setter={setSelected} />
          );
        }}
        keyExtractor={(item) => item.user_id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <View style={styles.buttonContainer}>
        <View style={{ flex: 1 }}>
          <PrimaryButtonComponent title="Save" onPressing={handleSave} />
        </View>
        <View style={{ flex: 1 }}>
          <PrimaryButtonComponent
            title="Later"
            backgroundColor={colors['accent-white']}
            textColor={colors['primary-text']}
            onPressing={async () => {
              await setLocalItem(Constants.SAVE_SHARES_LATER, 'true');
              navigation.goBack();
            }}
            isHighlighted={true}
          />
        </View>
      </View>

      <BottomSheetComponent
        visibility={similarModalVisibility}
        visibilitySetter={setSimilarModalVisibility}
      >
        <SimilarCardsComponent
          similarCardList={similarCardList}
          cardDetails={cardDetails}
          sharing={true}
          modalVisibilitySetter={setSimilarModalVisibility}
        ></SimilarCardsComponent>
      </BottomSheetComponent>
    </View>
  );
};
const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  bottomSheet: {
    width: '100%',
    height: '85%',
    alignItems: 'center',
    paddingTop: 25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors['secondary-light'],
  },
  similarCardsText: {
    marginTop: 10,
    fontSize: 26,
    fontWeight: 'bold',
  },
  similarCardsContainer: {
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 30,
    borderRadius: 14,
    width: '100%',
  },
  contactName: {
    paddingStart: 10,
    fontSize: 24,
    color: colors['secondary-accent'],
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    height: 100,
    paddingVertical: 10,
    width: '100%',
    paddingHorizontal: 10,
  },
  delete_card: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'center',
  },
  delete_text: {
    fontFamily: 'Roboto',
    fontSize: 20,
    marginLeft: 10,
    color: colors['primary-text'],
  },
});

export default SaveShareCardScreen;
