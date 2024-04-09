import React from 'react';
import { TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../utils/colorPallete';
import { useTranslation } from 'react-i18next';

type Props = {
  editable?: boolean;
  value?: string;
  setter?: (value: string) => void;
};

const SearchBarComponent = (props: Props) => {
  const onChangeText = (value: string) => {
    if (props.setter) {
      props.setter(value);
    }
  };
  const { t } = useTranslation();
  return (
    <View style={styles.searchContainer}>
      <TextInput
        editable={props.editable}
        placeholder={t("Search")}
        style={styles.searchBarView}
        value={props.value}
        onChangeText={onChangeText}
        placeholderTextColor={colors['primary-text']}
      ></TextInput>
      <TouchableOpacity style={styles.icon}>
        <MaterialIcons name="search" color={'grey'} size={30} />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    height: 45,
    backgroundColor: colors['secondary-grey'],
    borderRadius: 12,
  },
  searchBarView: {
    backgroundColor: colors['secondary-grey'],
    borderRadius: 12,
    flex: 9,
    paddingLeft: 30,
    fontSize: 18,
    color: colors['primary-text'],
  },
  icon: {
    flex: 1,
    alignSelf: 'center',
    marginRight: 10,
    color: colors['accent-grey'],
  },
});
export default SearchBarComponent;
