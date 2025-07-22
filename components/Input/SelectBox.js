// components/SelectBox.js
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function SelectBox({ labelTitle, value, options, onChange }) {
  // Handle different data structures
  let dataArray = [];
  if (Array.isArray(options)) {
    dataArray = options;
  } else if (options && options.rows && Array.isArray(options.rows)) {
    dataArray = options.rows;
  } else if (options && typeof options === 'object') {
    dataArray = Object.values(options);
  }
  
  // Determine the selected value: if value is not empty, use it; otherwise, use ""
  const selectedValue =
    value !== "" && dataArray.some(
      (o, idx) => (o.id || o.id_estado || idx) === value
    )
      ? value
      : "";

  return (
    <View style={styles.container}>
      {labelTitle ? <Text style={styles.label}>{labelTitle}</Text> : null}
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue) => onChange(itemValue)}
        style={styles.picker}
      >
        <Picker.Item
          label="Seleccionar opción"
          value=""
          enabled={false}
          key={`${labelTitle || 'select'}-placeholder`}
        />
        {dataArray.map((o, index) => {
          // Handle different property names
          const itemId = o.id || o.id_estado || index;
          const itemLabel = o.texto || o.nombre || o.label || `Item ${index + 1}`;
          // Create unique key by combining labelTitle, itemId and index
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
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { marginBottom: 4, fontWeight: 'bold' },
  picker: { height: 50, borderWidth: 1 },
});
