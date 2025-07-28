import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function SelectBox({
  id,
  labelTitle,
  value,
  options,
  onChange,
  labelPosition = 'top', // "top" o "left"
  hasError = false,
  enabled = true,
}) {
  const pickerRef = useRef();

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

  const handlePress = () => {
    if (pickerRef.current && Platform.OS === 'android') {
      pickerRef.current.focus();
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

      <TouchableWithoutFeedback onPress={handlePress} disabled={!enabled}>
        <View
          style={[
            styles.pickerWrapper,
            isLeft ? styles.pickerLeft : styles.pickerTop,
            hasError && styles.errorBorder,
          ]}
        >
          <Picker
            ref={pickerRef}
            selectedValue={value?.toString() ?? ''}
            onValueChange={handleChange}
            enabled={enabled}
            style={styles.picker}
            dropdownIconColor="#333"
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
      </TouchableWithoutFeedback>
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
    width: '100%',
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
    width: '30%',
    marginRight: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
    height: 48,
    justifyContent: 'center',
  },
  pickerTop: {
    width: '100%',
  },
  pickerLeft: {
    width: '70%',
  },
  picker: {
    width: '100%',
    color: '#000',
    paddingLeft: Platform.OS === 'android' ? 4 : 0,
    ...Platform.select({
      android: {
        marginTop: -4,
      },
      ios: {
        fontSize: 16,
      },
    }),
  },
  errorText: {
    color: 'red',
  },
  errorBorder: {
    borderColor: 'red',
  },
});
