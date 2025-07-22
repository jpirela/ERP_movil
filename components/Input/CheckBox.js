// components/CheckBox.js
import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

export default function CheckBox({ labelTitle, value, onChange }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{labelTitle}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  label: { marginRight: 10, fontWeight: 'bold' },
});
