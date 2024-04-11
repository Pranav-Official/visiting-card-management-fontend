import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../utils/colorPallete';
import nameToColor from '../network/nameToHex';
type Contact = { contactName: string; onPress?: () => void; onLongPress?: () => void };

const ContactListComponent = ({ contactName, onPress, onLongPress }: Contact) => {
  // Function to truncate the contact name to a maximum of 14 characters
  const truncateContactName = (name: string) => {
    if (name.length > 22) {
      return name.substring(0, 22) + '..'; // Add '..' if name exceeds 14 characters
    }
    return name;
  };

  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
      <View style={styles.container}>
        <View
          style={[styles.circle, { backgroundColor: nameToColor(contactName) }]}
        >
          <Text style={styles.alphabet}>{contactName[0]}</Text>
        </View>
        <View>
          <Text style={styles.nameText}>
            {truncateContactName(contactName)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 18,
    marginBottom: 16,
    alignItems: 'center',
  },
  alphabet: {
    color: colors['secondary-light'],
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 0,
  },
  nameText: {
    color: colors['primary-text'],
    fontSize: 25,
    fontFamily: 'roberto',
  },
  circle: {
    borderRadius: 27,
    height: 54,
    width: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ContactListComponent;
