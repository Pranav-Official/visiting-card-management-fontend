import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, StyleSheet, View ,Text} from "react-native";
import { setLocalItem } from "../../utils/Utils";
import { changeLanguage } from "i18next";
import colors from "../../utils/colorPallete";


const SettingsScreen= () => {
    
    const [modalVisible, setModalVisible] = useState(false);
    const { i18n } = useTranslation(); //i18n instance
  
    //array with all supported languages
    const languages = [
    { name: "en", label: "English" },
    { name: "ja", label: "Japanese" },
      
    ];
    const LanguageItem = ({ name, label }: { name: string; label: string }) => (
      <Pressable
        style={styles.button}
        onPress={() => {setLocalItem('lang',name)
            changeLanguage(name);
            setModalVisible(!modalVisible)
        }}
      >
        <Text style={styles.textStyle}>{label}</Text>
      </Pressable>
    );
  
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {languages.map((lang) => (
                <LanguageItem {...lang} key={lang.name} />
              ))}
            </View>
          </View>
        </Modal>
        <Pressable
          style={styles.button}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.textStyle}>App Language : {i18n.language}</Text>
        </Pressable>
      </View>
    );
  };
  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalView: {
      backgroundColor: "white",
      paddingHorizontal:50,
      paddingVertical:20,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderBottomColor:colors['label-text'],
      borderBottomWidth:1,
      paddingVertical:10
    },
    textStyle: {
      fontWeight: "bold",
      textAlign: "center",
    },
  });
export default SettingsScreen;