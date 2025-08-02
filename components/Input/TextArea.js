import React, { forwardRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const TextArea = forwardRef(({
  id,
  labelTitle,
  value = '',
  placeholder,
  onChange,
  numberOfLines = 4,
  labelPosition = 'top', // 'top' o 'left'
  hasError = false,
}, ref) => {
  const isLeft = labelPosition === 'left';

  return (
    <View style={[styles.container, isLeft ? styles.leftAlign : styles.topAlign]}>
      {labelTitle && (
        <Text
          style={[
            styles.label,
            isLeft ? styles.labelLeft : styles.labelTop,
            hasError && styles.errorText,
          ]}
        >
          {labelTitle}
        </Text>
      )}

      <TextInput
        ref={ref}
        style={[
          styles.textArea,
          isLeft ? styles.textAreaLeft : styles.textAreaTop,
          { height: numberOfLines * 24 },
          hasError && styles.errorBorder,
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={(text) => onChange(id, text)}
        multiline
        textAlignVertical="top"
      />
    </View>
  );
});

export default TextArea;

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
