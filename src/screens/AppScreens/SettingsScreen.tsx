import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { getLocalItem, setLocalItem } from '../../utils/Utils';
import { changeLanguage } from 'i18next';
import colors from '../../utils/colorPallete';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Constants from '../../utils/Constants';
import TopBackButton from '../../components/BackButton';
import { useFocusEffect } from '@react-navigation/native';

const SettingsScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [useReplicate, setUseReplicate] = useState<string | null>('');
  const { i18n } = useTranslation();

  const getReplicate = async () => {
    const useReplicate = (await getLocalItem(Constants.USE_REPLICATE)) ?? '';
    setUseReplicate(useReplicate);
  };

  const languages = [
    { name: 'en', label: 'English' },
    { name: 'ja', label: 'Japanese' },
  ];

  useFocusEffect(
    React.useCallback(() => {
      getReplicate();
    }, []),
  );

  const LanguageItem = ({ name, label }: { name: string; label: string }) => (
    <TouchableOpacity
      style={styles.languageItem}
      onPress={() => {
        setLocalItem('lang', name);
        changeLanguage(name);
        setModalVisible(!modalVisible);
      }}
    >
      <Text style={styles.languageText}>{label}</Text>
    </TouchableOpacity>
  );

  const DetailsExtractionMethodItem = ({
    boolean,
    label,
  }: {
    boolean: string;
    label: string;
  }) => (
    <TouchableOpacity
      style={styles.languageItem}
      onPress={() => {
        setLocalItem('USE_REPLICATE', boolean);
        setModalVisible(!modalVisible);
        setUseReplicate(boolean);
      }}
    >
      <Text style={styles.languageText}>{label}</Text>
    </TouchableOpacity>
  );

  const ModalContent = (modalContent: string) => {
    if (modalContent === 'Language') {
      return (
        <View style={styles.modalContent}>
          <Text style={styles.modalHead}>Choose your app language</Text>
          {languages.map((lang) => (
            <LanguageItem {...lang} key={lang.name} />
          ))}
        </View>
      );
    } else if (modalContent === 'DetailsExtractionMethod') {
      return (
        <View style={styles.modalContent}>
          <Text style={styles.modalHead}>
            Choose your Details Extraction Method
          </Text>
          <DetailsExtractionMethodItem boolean="true" label="Replicate AI" />
          <DetailsExtractionMethodItem boolean="false" label="Simple Regex" />
          <Text style={styles.modalFooterText}>
            Do note regex can only identify only email, phone number and website
          </Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ position: 'absolute', left: 0, top: 20 }}>
          <TopBackButton />
        </View>

        <Text style={styles.headerText}>App Settings</Text>
      </View>
      <TouchableOpacity
        style={styles.languageButton}
        onPress={() => {
          setModalVisible(true);
          setModalContent('Language');
        }}
      >
        <Text style={styles.languageButtonText}>
          App Language: {i18n.language === 'en' ? 'English' : '日本語'}
        </Text>
        <MaterialCommunityIcons
          name="earth"
          size={25}
          color={colors['primary-text']}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.languageButton}
        onPress={() => {
          setModalVisible(true);
          setModalContent('DetailsExtractionMethod');
        }}
      >
        <Text style={styles.languageButtonText}>
          Details Extraction{' '}
          {useReplicate === 'true' ? ': Replicate AI' : ': Simple Regex'}
        </Text>
        <MaterialCommunityIcons
          name="earth"
          size={25}
          color={colors['primary-text']}
        />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>{ModalContent(modalContent)}</View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors['accent-white'],
  },
  header: {
    backgroundColor: colors['primary-accent'],
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerText: {
    color: colors['primary-text'],
    fontSize: 24,
    fontWeight: 'bold',
  },
  languageButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors['primary-accent'],
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
  },
  languageButtonText: {
    color: colors['primary-text'],
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalHead: {
    fontSize: 21,
    fontWeight: 'bold',
    color: colors['primary-text'],
    marginBottom: '5%',
    textAlign: 'center',
  },
  modalContent: {
    backgroundColor: colors['accent-white'],
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  languageItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: colors['primary-accent'],
  },
  languageText: {
    fontSize: 21,
    color: colors['primary-text'],
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  modalFooterText: {
    color: colors['primary-text'],
    fontSize: 15,
    textAlign: 'center',
    marginTop: 5,
  },
});

export default SettingsScreen;
