import { useState } from 'react';
import { View, useWindowDimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import FichaCliente from './FichaCliente';
import FichaHuevos from './FichaHuevos';

export default function AgregarCliente() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'cliente', title: 'Ficha Cliente' },
    { key: 'huevos', title: 'Ficha Huevos' },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'cliente':
        return <FichaCliente />;
      case 'huevos':
        return <FichaHuevos />;
      default:
        return null;
    }
  };

  const handleGuardar = () => {
    navigation.goBack();
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
