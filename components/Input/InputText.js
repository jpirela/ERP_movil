import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const InputText = ({ id, labelTitle, value, placeholder, onChange, type = 'text' }) => {
  const getSecureEntry = () => type === 'password';
  const getKeyboardType = () => {
    switch (type) {
      case 'email':
        return 'email-address';
      case 'numeric':
      case 'number':
        return 'numeric';
      case 'phone':
        return 'phone-pad';
      default:
        return 'default';
    }
  };

  return (
    <View style={styles.container}>
      {labelTitle ? <Text style={styles.label}>{labelTitle}</Text> : null}
      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        secureTextEntry={getSecureEntry()}
        keyboardType={getKeyboardType()}
        onChangeText={(text) => onChange(id, text)}
        autoCapitalize="none"
        autoCorrect={false}
        id={id}
      />
    </View>
  );
};

export default InputText;

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { marginBottom: 4, fontWeight: 'bold', color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});
