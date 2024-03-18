import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import PrimaryButtonComponent from './PrimaryButtonComponent';
import CardComponent from './CardComponent';
import colors from '../utils/colorPallete';
import { NavigationProp, useNavigation } from '@react-navigation/native';

type Card = {
  card_id: string;
  card_name: string | null;
  company_name: string | null;
  company_website: string | null;
  contact_name: string | null;
  email: string | null;
  img_back_link: string | null;
  img_front_link: string | null;
  job_title: string | null;
  phone: string | null;
  user_id: string | null;
};
type ContactCards = {
  contact_name: string;
  cards: Card[];
};

const SimilarCardsComponent = (props: any) => {
  const cardDetails = props.cardDetails;
  const similarCardList: ContactCards = props.similarCardList;
  const sharing: boolean = props.sharing;

  const navigation = useNavigation<NavigationProp<any>>();
  console.log(
    '\n\nCONSOLE FOR similarCardList from Component: ',
    similarCardList,
  );

  //Render Item
  const renderItem = ({ item }: any) => (
    <View style={[styles.similarCardsContainer]}>
      <Text style={styles.contactNameInModal}>{item.contact_name}</Text>

      {item.cards.map((card: any) => (
        <View style={styles.singleCard} key={card.card_id}>
          <CardComponent
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

  return (
    <View style={styles.modalView}>
      <Text style={styles.similarCardsText}>Similar Cards Already Exists!</Text>

      <FlatList
        data={similarCardList}
        renderItem={renderItem}
        keyExtractor={(item) => item.cards}
      />
      <View style={styles.buttonContainer}>
        <Text style={styles.similarCardsText}>Choose an Option</Text>
        <PrimaryButtonComponent
          title="Overwrite Existing Card"
          onPressing={() => {
            props.modalVisibilitySetter(false);
            navigation.navigate('CardOverwriteScreen', {
              similarCardList,
              cardDetails,
              sharing,
            });
          }}
          textColor={colors['primary-text']}
        ></PrimaryButtonComponent>
        <PrimaryButtonComponent
          title="Add to Existing Contacts"
          onPressing={() => {
            props.modalVisibilitySetter(false);
            navigation.navigate('CardStack', {
              screen: 'AddToContactScreen',
              params: { similarCardList, cardDetails, sharing },
            });
          }}
          backgroundColor={colors['primary-accent']}
        ></PrimaryButtonComponent>
        <PrimaryButtonComponent
          title="Add as a New Contact"
          onPressing={() => {
            props.modalVisibilitySetter(false);
            navigation.navigate('CardStack', {
              screen: 'SetContactNameScreen',
              params: { cardDetails, sharing },
            });
          }}
          backgroundColor={colors['primary-accent']}
        ></PrimaryButtonComponent>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  //Modal Stylings
  modalView: {
    marginHorizontal: 25,
    height: '100%',
  },
  similarCardsText: {
    textAlign: 'center',
    color: colors['primary-text'],
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  similarCardsContainer: {
    borderWidth: 2,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingBottom: 10,
    marginBottom: 20,
  },
  contactNameInModal: {
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
    height: 250,
    marginBottom: 25,
  },
});

export default SimilarCardsComponent;
