import { useState, useRef } from 'react';
import { View, useWindowDimensions, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import FichaCliente from './FichaCliente';
import FichaHuevos from './FichaHuevos';
import { useNavigation } from '@react-navigation/native';
import { guardarNuevoCliente, guardarRespuestas } from '../utils/syncDataFS';

export default function AgregarCliente() {
  const layout = useWindowDimensions();
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'cliente', title: 'Ficha Cliente' },
    { key: 'huevos', title: 'Ficha Huevos' },
  ]);

  const clienteRef = useRef();
  const huevosRef = useRef();

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'cliente':
        return <FichaCliente ref={clienteRef} />;
      case 'huevos':
        return <FichaHuevos ref={huevosRef} />;
      default:
        return null;
    }
  };

  const handleGuardar = async () => {
    try {
      const clienteValid = clienteRef.current?.validateData();
      const huevosValid = huevosRef.current?.validateData();

      if (!clienteValid || !huevosValid) {
        Alert.alert("Faltan datos por recolectar");
        return;
      }

      // Limpiar errores si la validación es exitosa
      clienteRef.current?.clearErrors();
      huevosRef.current?.clearErrors();

      // Obtener datos
      const clienteData = clienteRef.current?.getData();
      const huevosData = huevosRef.current?.getData();

      // 1. Guardar cliente y obtener idCliente
      const idCliente = await guardarNuevoCliente(clienteData);

      // 2. Preparar respuestas con estructura correcta
      const respuestasFormateadas = {
        categorias: huevosData.categorias,
        preguntas: huevosData.preguntas,
        formaPago: huevosData.formaPago,
        condicionPago: huevosData.condicionPago
      };

      // 3. Guardar respuestas en Respuestas.json usando idCliente como índice
      await guardarRespuestas(idCliente, respuestasFormateadas);

      Alert.alert("Datos guardados exitosamente");
      navigation.goBack();
    } catch (error) {
      console.error('Error al guardar:', error);
      Alert.alert("Error al guardar los datos");
    }
  };

  const renderTabBar = (props) => (
    <View style={styles.tabHeader}>
      <TabBar
        {...props}
        indicatorStyle={styles.indicator}
        style={styles.tabBar}
        labelStyle={styles.label}
        activeColor="#007bff"
        inactiveColor="#666"
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
        <Text style={styles.saveButtonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingRight: 10,
  },
  tabBar: {
    flex: 1,
    backgroundColor: '#fff',
    elevation: 0,
  },
  indicator: {
    backgroundColor: '#007bff',
    height: 3,
  },
  label: {
    color: '#000',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
