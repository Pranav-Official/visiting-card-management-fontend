import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { setLocalItem } from "../../utils/Utils";
import { changeLanguage } from "i18next";
import colors from "../../utils/colorPallete";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


const SettingsScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { i18n } = useTranslation();

  const languages = [
    { name: "en", label: "English" },
    { name: "ja", label: "Japanese" },
  ];

  const LanguageItem = ({ name, label }: { name: string; label: string }) => (
    <TouchableOpacity
      style={styles.languageItem}
      onPress={() => {
        setLocalItem("lang", name);
        changeLanguage(name);
        setModalVisible(!modalVisible);
      }}
    >
      <Text style={styles.languageText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Select your app language</Text>
      </View>
      <TouchableOpacity
        style={styles.languageButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.languageButtonText}>
          {i18n.language === "en" ? "English" : "日本語"}
        </Text>
        <MaterialCommunityIcons
      name='earth'
      size={25}
      color={colors["primary-text"]}
    
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
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHead}>Choose your app language</Text>
            {languages.map((lang) => (
              <LanguageItem {...lang} key={lang.name} />
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors["accent-white"],
  },
  header: {
    backgroundColor: colors["primary-accent"],
    paddingVertical: 20,
    alignItems: "center",
  },
  headerText: {
    color: colors["primary-text"],
    fontSize: 24,
    fontWeight: "bold",
  },
  languageButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors["primary-accent"],
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
  },
  languageButtonText: {
    color: colors["primary-text"],
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    
  },
  modalHead :{
   fontSize:21,
   fontWeight:'bold',
   color:colors["primary-text"],
   marginBottom:'5%'
  },
  modalContent: {
    backgroundColor: colors["accent-white"],
    padding: 20,
    borderRadius: 10,
    width: '80%',
    
  },
  languageItem: {
    
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: colors["primary-accent"],
    
  },
  languageText: {
    fontSize: 21,
    color:colors["primary-text"],
    alignSelf:'center',
    fontWeight:'bold'
  },
});

export default SettingsScreen;
