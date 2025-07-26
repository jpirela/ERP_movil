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
        style={styles.switch}
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
  switch: {
    // Puedes ajustar tamaño o margen si deseas
  },
  errorText: {
    color: 'red',
  },
});
