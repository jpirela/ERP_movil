import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function TextArea({ labelTitle, value, placeholder, onChange, numberOfLines = 4 }) {
  return (
    <View style={styles.container}>
      {labelTitle ? <Text style={styles.label}>{labelTitle}</Text> : null}
      <TextInput
        style={[styles.textArea, { height: numberOfLines * 24 }]}
        value={value}
        placeholder={placeholder}
        onChangeText={onChange}
        multiline={true}
        textAlignVertical="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 4,
    fontWeight: 'bold',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
  },
});
