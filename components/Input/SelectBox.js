import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function SelectBox({ id, labelTitle, value, options, onChange }) {
  let dataArray = [];
  if (Array.isArray(options)) {
    dataArray = options;
  } else if (options && typeof options === 'object') {
    dataArray = Object.values(options);
  }

  // Convertir el valor seleccionado a string para que coincida con el tipo del Picker
  const selectedValue = value !== undefined && value !== null ? String(value) : "";

  return (
    <View style={styles.container}>
      {labelTitle ? <Text style={styles.label}>{labelTitle}</Text> : null}
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue) => onChange && onChange(id, itemValue)}
        style={styles.picker}
      >
        <Picker.Item
          label="Seleccionar opción"
          value=""
          enabled={false}
          key={`${labelTitle || 'select'}-placeholder`}
        />
        {dataArray.map((o, index) => {
          const itemId = String(o.id || o.id_estado || index);
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
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { marginBottom: 4, fontWeight: 'bold' },
  picker: { height: 50, borderWidth: 1 },
});
