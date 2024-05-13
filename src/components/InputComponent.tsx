import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ClosedEyeIcon from '../assets/images/eye-closed.svg';
import OpenEyeIcon from '../assets/images/eye-open.svg';
import colors from '../utils/colorPallete';

type BorderTypes = 'Danger' | 'Auth' | 'Normal';

type InputProps = {
  placeholder?: string;
  hidden?: boolean;
  header: string;
  borderType?: BorderTypes;
  value: string;
  setter: (value: string) => void;
};
const InputComponent = ({
  placeholder = '',
  hidden = false,
  borderType = 'Normal',
  header,
  value,
  setter,
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const toggleShowHide = () => {
    setShowSecret(!showSecret);
  };
  const inputContainerStyle = {
    ...styles.inputContainer,
    ...(borderType === 'Auth' && styles.authBorder),
    ...(borderType === 'Danger' && styles.dangerBorder),
    ...(borderType === 'Normal' && styles.normalBorder),
  };

  return (
    <View>
      <View>
        <Text style={styles.label}>{header}</Text>
      </View>
      <View style={inputContainerStyle}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors['label-text']}
          value={value}
          secureTextEntry={hidden ? !showSecret : false}
          caretHidden={!isFocused}
          onChangeText={(val) => setter(val)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        ></TextInput>
        {isFocused && hidden == false ? (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setter('')}
            testID="close-icon"
          >
            <MaterialIcons
              name="close"
              size={25}
              color={colors['label-text']}
            />
          </TouchableOpacity>
        ) : null}
        {hidden && isFocused ? (
          showSecret ? (
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={toggleShowHide}
              testID="openEye"
            >
              <OpenEyeIcon
                width={24}
                height={24}
                color={colors['label-text']}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={toggleShowHide}
              testID="closedEye"
            >
              <ClosedEyeIcon
                width={24}
                height={24}
                color={colors['label-text']}
              />
            </TouchableOpacity>
          )
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors['primary-text'],
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: Platform.OS === 'ios' ? 8 : 2,
    paddingStart: 10,
    marginTop: -10,
    zIndex: -1,
  },
  input: {
    flex: 8,
    color: colors['primary-text'],
    fontSize: 18,
  },
  label: {
    backgroundColor: colors['secondary-light'],
    alignSelf: 'flex-start',
    marginLeft: 15,
    color: colors['accent-grey'],
    paddingHorizontal: 5,
    fontWeight: '500',
  },
  iconContainer: {
    paddingLeft: 8,
    flex: 1,
  },
  hiddenIcon: {
    pointerEvents: 'none',
  },
  authBorder: {
    borderColor: colors['primary-accent'],
  },
  dangerBorder: {
    borderColor: colors['primary-danger'],
  },
  normalBorder: {
    borderColor: colors['primary-text'],
  },
});

export default InputComponent;
