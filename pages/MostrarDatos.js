import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRoute, useNavigation } from '@react-navigation/native';

import StaticText from '../components/Input/StaticText';
import Divider from '../components/Input/Divider';

import { leerModeloFS } from '../utils/syncDataFS';
import * as FileSystem from 'expo-file-system';

// Función para leer respuestas.json directamente
const leerRespuestasDirecto = async () => {
  try {
    const DATA_DIR = FileSystem.documentDirectory + 'data/';
    const RESPUESTAS_PATH = `${DATA_DIR}Respuestas.json`;
    
    const respuestasInfo = await FileSystem.getInfoAsync(RESPUESTAS_PATH);
    if (!respuestasInfo.exists) {
      console.log('📄 Archivo Respuestas.json no encontrado');
      return {};
    }
    
    const contenido = await FileSystem.readAsStringAsync(RESPUESTAS_PATH);
    if (!contenido || contenido.trim() === '') {
      console.log('📄 Archivo Respuestas.json está vacío');
      return {};
    }
    
    const datos = JSON.parse(contenido);
    console.log(`✅ Respuestas.json leído correctamente - ${Object.keys(datos).length} clientes`);
    return datos;
  } catch (error) {
    console.warn(`❌ Error al leer Respuestas.json:`, error.message);
    return {};
  }
};

export default function MostrarDatos() {
  const route = useRoute();
  const navigation = useNavigation();
  const { idCliente } = route.params;

  const [loading, setLoading] = useState(true);
  const [clienteData, setClienteData] = useState(null);
  const [respuestasData, setRespuestasData] = useState(null);
  const [categoriasModelo, setCategoriasModelo] = useState([]);
  const [preguntasModelo, setPreguntasModelo] = useState([]);
  const [formasPagoModelo, setFormasPagoModelo] = useState([]);
  const [condicionesPagoModelo, setCondicionesPagoModelo] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [
          categoriasData,
          preguntasData,
          formasPagoData,
          condicionesPagoData,
          clientesData,
        ] = await Promise.all([
          leerModeloFS('categorias'),
          leerModeloFS('preguntas'),
          leerModeloFS('formas-pago'),
          leerModeloFS('condiciones-pago'),
          leerModeloFS('clientes'),
        ]);
        
        // Leer respuestas.json directamente
        const respuestasCompletas = await leerRespuestasDirecto();

        const categorias = Array.isArray(categoriasData) ? categoriasData : categoriasData?.rows ?? [];
        const preguntas = Array.isArray(preguntasData) ? preguntasData : preguntasData?.rows ?? [];
        const formasPago = Array.isArray(formasPagoData) ? formasPagoData : formasPagoData?.rows ?? [];
        const condicionesPago = Array.isArray(condicionesPagoData) ? condicionesPagoData : condicionesPagoData?.rows ?? [];
        const clientes = Array.isArray(clientesData) ? clientesData : clientesData?.rows ?? [];

        setCategoriasModelo(categorias);
        setPreguntasModelo(preguntas);
        setFormasPagoModelo(formasPago);
        setCondicionesPagoModelo(condicionesPago);

        const cliente = clientes.find(c => c.idCliente === parseInt(idCliente));
        setClienteData(cliente);

        const respuestas = respuestasCompletas || {};
        const clavesRespuestas = Object.keys(respuestas);
        console.log(`🔎 respuestas.json contiene ${clavesRespuestas.length} registros`);

        const respuestasCliente = respuestas[idCliente];
        console.log(`🎯 Coincidencias con cliente ${idCliente}: ${respuestasCliente ? 1 : 0}`);
        if (!respuestasCliente) {
          console.log('⚠️ No se encontraron respuestas para este cliente.');
        }

        setRespuestasData(respuestasCliente);
        
        console.log('\n\n📁 === CONTENIDO COMPLETO DE CLIENTES.JSON ===');
        console.log(JSON.stringify(clientesData, null, 2));
        console.log('🔚 === FIN DEL CONTENIDO DE CLIENTES.JSON ===\n\n');
        
        console.log('\n\n📁 === CONTENIDO COMPLETO DE RESPUESTAS.JSON ===');
        console.log(JSON.stringify(respuestasCompletas, null, 2));
        console.log('🔚 === FIN DEL CONTENIDO DE RESPUESTAS.JSON ===\n\n');

        setLoading(false);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setLoading(false);
      }
    };

    cargarDatos();
  }, [idCliente]);

  const renderClienteData = () => {
    if (!clienteData) return null;

    return (
      <View>
        <Divider text="Datos del Cliente" containerStyle={{ marginVertical: 10 }} />
        {Object.entries(clienteData).map(([key, value]) => (
          <StaticText
            key={key}
            labelTitle={key}
            value={typeof value === 'object' ? JSON.stringify(value) : String(value)}
            labelPosition="top"
          />
        ))}
      </View>
    );
  };

  const renderCategorias = () => {
    if (!respuestasData?.categorias) return null;

    return (
      <View>
        <Divider text="Número de Cajas" containerStyle={{ marginVertical: 10 }} />
        {categoriasModelo.map(categoria => {
          const item = respuestasData.categorias.find(c => c.idCategoria === categoria.idCategoria);
          if (!item) return null;
          return (
            <StaticText
              key={categoria.idCategoria}
              labelTitle={`${categoria.nombre} (${categoria.descripcion})`}
              value={item.cantidad}
              labelPosition="left"
            />
          );
        })}
      </View>
    );
  };

  const renderPreguntas = () => {
    if (!respuestasData?.preguntas) return null;

    return (
      <View>
        <Divider text="Preguntas sobre el pedido" containerStyle={{ marginVertical: 10 }} />
        {preguntasModelo.map(pregunta => {
          const item = respuestasData.preguntas.find(p => p.idPregunta === pregunta.idPregunta);
          if (!item) return null;
          return (
            <StaticText
              key={pregunta.idPregunta}
              labelTitle={pregunta.descripcion}
              value={item.respuesta}
              labelPosition="top"
            />
          );
        })}
      </View>
    );
  };

  const renderFormasPago = () => {
    if (!respuestasData?.['forma-pago']) return null;

    return (
      <View>
        <Divider text="Formas de pago" containerStyle={{ marginVertical: 10 }} />
        {formasPagoModelo.map(forma => {
          const existe = respuestasData['forma-pago'].some(f => f.idFormaPago === forma.idFormaPago);
          if (!existe) return null;
          return (
            <StaticText
              key={forma.idFormaPago}
              labelTitle={forma.descripcion}
              value="Sí"
              labelPosition="left"
            />
          );
        })}
      </View>
    );
  };

  const renderCondicionesPago = () => {
    const condicion = respuestasData?.['condicion-pago'];
    if (!condicion) return null;

    const descripcion = condicionesPagoModelo.find(
      c => c.idCondicionPago === condicion.idCondicionPago
    )?.descripcion;

    return (
      <View>
        <Divider text="Condiciones de pago" containerStyle={{ marginVertical: 10 }} />
        <StaticText
          labelTitle="Condición de Pago"
          value={descripcion || `ID ${condicion.idCondicionPago}`}
          labelPosition="top"
        />
        {'diaCredito' in condicion && (
          <StaticText
            labelTitle="Días de Crédito"
            value={condicion.diaCredito}
            labelPosition="top"
          />
        )}
        {'diaContado' in condicion && (
          <StaticText
            labelTitle="Pago Contado"
            value="Sí"
            labelPosition="top"
          />
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.flex, styles.center]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Datos del Cliente #{idCliente}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator
        keyboardShouldPersistTaps="handled"
      >
        {renderClienteData()}
        {renderCategorias()}
        {renderPreguntas()}
        {renderFormasPago()}
        {renderCondicionesPago()}

        <StatusBar style="auto" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});