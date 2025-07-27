import { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import clientesData from '../data/clientes.json'; // Ajusta la ruta si es necesario

const icons = {
  cliente: <MaterialCommunityIcons name="account-circle" size={24} color="gray" />,
  huevos: <MaterialCommunityIcons name="egg" size={24} color="gray" />,
};

const Inicio = () => {
  const [clientes, setClientes] = useState([]);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    if (clientesData && clientesData.rows) {
      setClientes(clientesData.rows);
    }
  }, []);

  const filteredClientes = useMemo(() => {
    if (!searchText.trim()) return clientes;
    return clientes.filter(cliente =>
      cliente.nombre.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, clientes]);

  const handleAgregarCliente = () => {
    navigation.navigate('AgregarCliente');
  };

  return (
    <View style={styles.container}>
      {/* Buscador y botón */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar cliente..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAgregarCliente}>
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Encabezado de tabla */}
      <View style={styles.headerRow}>
        <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>Clientes</Text>
        <Text style={[styles.cell, styles.headerCell, { width: '25%' }]}>Acciones</Text>
      </View>

      {/* Scroll solo para la tabla */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {filteredClientes.map(cliente => (
          <View key={cliente.idCliente} style={styles.row}>
            <Text style={[styles.cell, { flex: 1 }]}>{cliente.nombre}</Text>
            <View style={[styles.actionsCell, { width: '25%' }]}>
              <TouchableOpacity style={styles.actionBtn}>
                {icons.cliente}
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                {icons.huevos}
              </TouchableOpacity>
            </View>
          </View>
        ))}
        {filteredClientes.length === 0 && (
          <View style={styles.emptyRow}>
            <Text style={styles.emptyText}>No se encontraron clientes</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f7f7f7',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  scrollArea: {
    flex: 1,
    marginTop: 4,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  cell: {
    fontSize: 16,
  },
  headerCell: {
    fontWeight: 'bold',
  },
  actionsCell: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    backgroundColor: '#e9ecef',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  emptyRow: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default Inicio;
