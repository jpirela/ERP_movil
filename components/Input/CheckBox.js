import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

export default function CheckBox({
  id,
  labelTitle,
  value,
  onChange,
  labelPosition = 'left', // "top" o "left"
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

      <Switch
        value={value}
        onValueChange={(val) => onChange(id, val)}
        style={isLeft ? styles.switchLeft : styles.switchTop}
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
    alignItems: 'flex-start',
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
  },
  labelLeft: {
    marginRight: 12,
  },
  switchTop: {
    alignSelf: 'flex-start',
  },
  switchLeft: {
    flex: 1,
  },
  errorText: {
    color: 'red',
  },
});
