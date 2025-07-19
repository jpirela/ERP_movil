// components/SelectBox.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function SelectBox({ labelTitle, value, options, onChange }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{labelTitle}</Text>
      <Picker
        selectedValue={value}
        onValueChange={(itemValue) => onChange(itemValue)}
        style={styles.picker}
      >
        {options.map((o, i) => (
          <Picker.Item label={o.label} value={o.value || o.label} key={i} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { marginBottom: 4, fontWeight: 'bold' },
  picker: { height: 50, borderWidth: 1 },
});
