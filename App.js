import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Inicio from './pages/Inicio';
import AgregarCliente from './pages/AgregarCliente';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Image, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

// ✅ Encabezado personalizado
const CustomHeader = ({ title }) => (
  <View style={styles.headerContainer}>
    <View style={styles.leftCell}>
      <Image source={require('./assets/logo.png')} style={styles.logo} />
    </View>
  </View>
);

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Inicio" // ✅ Aquí se define la pantalla inicial
        screenOptions={({ route }) => ({
          headerTitle: () => <CustomHeader title={route.name} />,
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Inicio') iconName = 'home';
            else if (route.name === 'Agregar Cliente') iconName = 'account-plus-outline';

            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#e91e63',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Inicio" component={Inicio} />
        <Tab.Screen name="Agregar Cliente" component={AgregarCliente} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    width: '100%',
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: 'contain',
  },
});
