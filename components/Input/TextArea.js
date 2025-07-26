import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function TextArea({
  id,
  labelTitle,
  value,
  placeholder,
  onChange,
  numberOfLines = 4,
  labelPosition = 'top', // "top" o "left"
  hasError = false,
}) {
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
          styles.textArea,
          isLeft ? styles.textAreaLeft : styles.textAreaTop,
          { height: numberOfLines * 24 },
          hasError && styles.errorBorder,
        ]}
        value={value}
        placeholder={placeholder}
        onChangeText={(text) => onChange(id, text)}
        multiline={true}
        textAlignVertical="top"
      />
    </View>
  );
}

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
    alignItems: 'flex-start',
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
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textAreaTop: {
    width: '100%',
  },
  textAreaLeft: {
    flex: 1,
  },
  errorText: {
    color: 'red',
  },
  errorBorder: {
    borderColor: 'red',
  },
});
