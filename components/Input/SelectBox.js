import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function SelectBox({
  id,
  labelTitle,
  value,
  options,
  onChange,
  labelPosition = 'top', // "top" o "left"
  hasError = false,
  enabled = true, // nuevo
}) {
  const dataArray = Array.isArray(options)
    ? options
    : options && typeof options === 'object'
    ? Object.values(options)
    : [];

  const isLeft = labelPosition === 'left';

  const handleChange = (itemValue) => {
    if (onChange) {
      onChange(id, itemValue);
    }
  };

  return (
    <View style={[styles.container, isLeft ? styles.leftAlign : styles.topAlign]}>
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

      <View
        style={[
          styles.pickerWrapper,
          isLeft ? styles.pickerLeft : styles.pickerTop,
          hasError && styles.errorBorder,
        ]}
      >
        <Picker
          selectedValue={value?.toString() ?? ''}
          onValueChange={handleChange}
          style={styles.picker}
          enabled={enabled}
        >
          <Picker.Item
            label="Seleccionar opción"
            value=""
            enabled={false}
            key="placeholder"
          />

          {dataArray.map((o, index) => {
            const itemId = (o.id || o.id_estado || o.value || index).toString();
            const itemLabel = o.texto || o.nombre || o.label || `Item ${index + 1}`;
            const uniqueKey = `${labelTitle || 'select'}-${itemId}-${index}`;

            return (
              <Picker.Item
                label={itemLabel}
                value={itemId}
                key={uniqueKey}
              />
            );
          })}
        </Picker>
      </View>
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  pickerTop: {
    width: '100%',
  },
  pickerLeft: {
    flex: 1,
  },
  picker: {
    height: 48,
  },
  errorText: {
    color: 'red',
  },
  errorBorder: {
    borderColor: 'red',
  },
});
