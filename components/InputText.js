// components/InputText.js
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function InputText({ labelTitle, value, placeholder, onChange }) {
  return (
    <View style={styles.container}>
      {labelTitle ? <Text style={styles.label}>{labelTitle}</Text> : null}
      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        onChangeText={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { marginBottom: 4, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
  },
});
