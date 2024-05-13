import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ViewSharedButton from '../../components/ViewSharedButton';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import TopBackButton from '../../components/BackButton';
import colors from '../../utils/colorPallete';
import { getLocalItem } from '../../utils/Utils';
import Constants from '../../utils/Constants';
import { getPendingCards } from '../../network/getPendingCardsAPI';
import { setCards } from '../../store/pendingCardsSlice';
import { useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

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

type RouteType = {
  route: RouteProp<
    {
      params: {
        totalPendingCards: number;
        totalAcceptedCards: number;
      };
    },
    'params'
  >;
};

const ViewSharedContactsScreen = ({ route }: RouteType) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const handlePress = () => {
    if (totalAcceptedCards != 0) {
      navigation.navigate('CardStack', {
        screen: 'SharedContactsScreen',
      });
    }
  };
  const { totalPendingCards, totalAcceptedCards } = route.params;
  const [pendingCardList, setPendingCardList] = useState<UserData[]>();
  const dispatch = useDispatch();

  const handlePendingPress = async () => {
    const user_id = (await getLocalItem(Constants.USER_ID)) || '';
    const jwtToken = (await getLocalItem(Constants.USER_JWT)) || '';
    const pendingCards = await getPendingCards({ user_id, jwtToken });

    if (pendingCards.statusCode === '200') {
      if (
        pendingCards.pendingCardList &&
        pendingCards.pendingCardList.length > 0
      ) {
        setPendingCardList(pendingCards.pendingCardList);
        dispatch(setCards(pendingCards.pendingCardList));

        navigation.navigate('CardStack', {
          screen: 'SaveShareCardScreen',
          params: { pendingCardList },
        });
      }
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <TopBackButton color="black" />
        <Text style={styles.heading}>Shared Contacts</Text>
      </View>
      <View style={styles.shareContainer}>
        <ViewSharedButton
          title="Accepted Cards"
          number={totalAcceptedCards}
          onPressing={() => handlePress()}
        />
        <ViewSharedButton
          title="Pending Shares"
          number={totalPendingCards}
          onPressing={() => handlePendingPress()}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    backgroundColor: colors['secondary-light'],
    height: '100%',
  },
  shareContainer: {
    padding: 20,
    gap: 20,
    justifyContent: 'space-between',
  },
  headerContainer: {
    flexDirection: 'row',
    gap: 70,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingBottom: 20,
    paddingTop: 20,
    backgroundColor: colors['primary-accent'],
  },
  heading: {
    fontSize: 30,
    color: 'black',
  },
});
export default ViewSharedContactsScreen;
