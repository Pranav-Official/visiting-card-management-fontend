import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../utils/colorPallete';
import Modal from 'react-native-modal';

interface Option {
  label: string;
  onSelect?: () => void;
}

interface Props {
  options: Option[];
}

const TopMenuButton = ({ options }: Props) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleOptionClick = (option: Option) => {
    if (option.onSelect) {
      option.onSelect();
    }
    toggleModal();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleModal}>
        <MaterialIcons
          name="more-vert"
          color={'black'}
          size={34}
          style={styles.icon}
        />
      </TouchableOpacity>
      <Modal
        isVisible={isModalVisible}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropOpacity={0}
        onBackdropPress={toggleModal}
        style={styles.modal}
      >
        <TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => handleOptionClick(option)}
              >
                <Text style={styles.optionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: colors['accent-grey'],
    zIndex: 1,
  },
  modal: {
    position: 'absolute',
    top: '10%',
    left: '60%',
    right: 5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#DFDFDF',
    padding: 10,
    borderRadius: 10,
  },
  optionButton: {
    marginBottom: 8,
  },
  optionText: {
    color: colors['primary-text'],
    fontSize: 20,
  },
});

export default TopMenuButton;
