import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const InputText = ({
  id,
  labelTitle,
  value,
  placeholder,
  onChange,
  type = 'text',
  labelPosition = 'top', // "top" o "left"
  hasError = false,
}) => {
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

  const isLeft = labelPosition === 'left';

  return (
    <View
      style={[
        styles.container,
        isLeft ? styles.leftAlign : styles.topAlign,
      ]}
    >
      {labelTitle ? (
        <Text
          style={[
            styles.label,
            isLeft ? styles.labelLeft : styles.labelTop,
            hasError && styles.errorText,
          ]}
        >
          {labelTitle}
        </Text>
      ) : null}
      <TextInput
        style={[
          styles.input,
          isLeft ? styles.inputLeft : styles.inputTop,
          hasError && styles.errorBorder,
        ]}
        value={value}
        placeholder={placeholder}
        secureTextEntry={getSecureEntry()}
        keyboardType={getKeyboardType()}
        onChangeText={(text) => onChange(id, text)}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};

export default InputText;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  topAlign: {
    flexDirection: 'column',
  },
  leftAlign: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  labelTop: {
    marginBottom: 4,
    width: '100%',
  },
  labelLeft: {
    marginRight: 12,
    width: 80,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputTop: {
    width: '100%',
  },
  inputLeft: {
    flex: 1,
  },
  errorText: {
    color: 'red',
  },
  errorBorder: {
    borderColor: 'red',
  },
});
