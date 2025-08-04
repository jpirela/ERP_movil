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
        // Cargar modelos
        const [
          categoriasData,
          preguntasData,
          formasPagoData,
          condicionesPagoData,
          clientesData,
          respuestasCompletas,
        ] = await Promise.all([
          leerModeloFS('categorias'),
          leerModeloFS('preguntas'),
          leerModeloFS('formas-pago'),
          leerModeloFS('condiciones-pago'),
          leerModeloFS('clientes'),
          leerModeloFS('respuestas'), // Modelo de respuestas del cliente
        ]);

        // Procesar modelos
        const categorias = Array.isArray(categoriasData) ? categoriasData : (categoriasData?.rows ?? []);
        const preguntas = Array.isArray(preguntasData) ? preguntasData : (preguntasData?.rows ?? []);
        const formasPago = Array.isArray(formasPagoData) ? formasPagoData : (formasPagoData?.rows ?? []);
        const condicionesPago = Array.isArray(condicionesPagoData) ? condicionesPagoData : (condicionesPagoData?.rows ?? []);

        setCategoriasModelo(categorias);
        setPreguntasModelo(preguntas);
        setFormasPagoModelo(formasPago);
        setCondicionesPagoModelo(condicionesPago);

        // Buscar datos del cliente
        const clientes = Array.isArray(clientesData) ? clientesData : (clientesData?.rows ?? []);
        
        // Debug: Mostrar todos los IDs de clientes disponibles
        console.log('=== DEBUG: IDs de clientes disponibles ===');
        console.log('Clientes encontrados:', clientes.length);
        clientes.forEach((cliente, index) => {
          console.log(`Cliente ${index + 1}: ID = ${cliente.idCliente}, Nombre = ${cliente.nombre}`);
        });
        console.log('ID buscado:', idCliente, 'Tipo:', typeof idCliente);
        console.log('==========================================');
        
        const cliente = clientes.find(c => c.idCliente === parseInt(idCliente));
        console.log('Cliente encontrado:', cliente ? `Sí - ${cliente.nombre}` : 'No encontrado');
        setClienteData(cliente);

        // Buscar respuestas del cliente
        const respuestas = respuestasCompletas || {};
        console.log('\n=== DEBUG: Verificación de datos del cliente', idCliente, '===');
        console.log('Estructura de respuestas (claves disponibles):', Object.keys(respuestas));
        
        // Verificar si existe el cliente en respuestas
        const respuestasCliente = respuestas[idCliente];
        console.log('\n--- Respuestas del cliente', idCliente, '---');
        if (respuestasCliente) {
          console.log('✅ Cliente encontrado en respuestas');
          console.log('Estructura:', Object.keys(respuestasCliente));
          
          // Verificar cada sección
          if (respuestasCliente.categorias) {
            console.log('✅ Tiene categorias:', Object.keys(respuestasCliente.categorias).length, 'items');
            console.log('Categorias data:', respuestasCliente.categorias);
          } else {
            console.log('❌ NO tiene categorias');
          }
          
          if (respuestasCliente.preguntas) {
            console.log('✅ Tiene preguntas:', Object.keys(respuestasCliente.preguntas).length, 'items');
            console.log('Preguntas data:', respuestasCliente.preguntas);
          } else {
            console.log('❌ NO tiene preguntas');
          }
          
          if (respuestasCliente.formaPago) {
            console.log('✅ Tiene formaPago:', Object.keys(respuestasCliente.formaPago).length, 'items');
            console.log('FormaPago data:', respuestasCliente.formaPago);
          } else {
            console.log('❌ NO tiene formaPago');
          }
          
          if (respuestasCliente.condicionPago) {
            console.log('✅ Tiene condicionPago:', Object.keys(respuestasCliente.condicionPago).length, 'items');
            console.log('CondicionPago data:', respuestasCliente.condicionPago);
          } else {
            console.log('❌ NO tiene condicionPago');
          }
          
          if (respuestasCliente.diasCredito) {
            console.log('✅ Tiene diasCredito:', respuestasCliente.diasCredito);
          } else {
            console.log('❌ NO tiene diasCredito');
          }
          
        } else {
          console.log('❌ Cliente NO encontrado en respuestas');
          console.log('Claves disponibles en respuestas:', Object.keys(respuestas));
          console.log('Tipo de idCliente:', typeof idCliente);
          console.log('IDs como string:', Object.keys(respuestas).map(k => String(k)));
          console.log('IDs como número:', Object.keys(respuestas).map(k => parseInt(k)));
        }
        
        console.log('\n--- Modelos cargados ---');
        console.log('Categorias modelo:', categoriasModelo.length, 'items');
        console.log('Preguntas modelo:', preguntasModelo.length, 'items');
        console.log('FormasPago modelo:', formasPagoModelo.length, 'items');
        console.log('CondicionesPago modelo:', condicionesPagoModelo.length, 'items');
        
        console.log('\n\n📁 === CONTENIDO COMPLETO DE RESPUESTAS.JSON ===');
        console.log(JSON.stringify(respuestasCompletas, null, 2));
        console.log('🔚 === FIN DEL CONTENIDO DE RESPUESTAS.JSON ===\n\n');
        console.log('===============================================\n');
        
        setRespuestasData(respuestasCliente);

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
        <StaticText labelTitle="Nombre" value={clienteData.nombre} labelPosition="top" />
        <StaticText labelTitle="Razón Social" value={clienteData.razonSocial} labelPosition="top" />
        <StaticText labelTitle="RIF" value={clienteData.rif} labelPosition="top" />
        <StaticText labelTitle="Contacto" value={clienteData.contacto} labelPosition="top" />
        <StaticText labelTitle="Correo" value={clienteData.correo} labelPosition="top" />
        <StaticText labelTitle="Teléfono" value={clienteData.telefono} labelPosition="top" />
        <StaticText labelTitle="Dirección" value={clienteData.direccion} labelPosition="top" />
        <StaticText labelTitle="Estado" value={clienteData.estado} labelPosition="top" />
        <StaticText labelTitle="Municipio" value={clienteData.municipio} labelPosition="top" />
        <StaticText labelTitle="Parroquia" value={clienteData.parroquia} labelPosition="top" />
        <StaticText labelTitle="Ciudad" value={clienteData.ciudad} labelPosition="top" />
      </View>
    );
  };

  const renderCategorias = () => {
    console.log('\n=== RENDER DEBUG: Categorias ===');
    console.log('respuestasData?.categorias existe:', !!respuestasData?.categorias);
    if (!respuestasData?.categorias) {
      console.log('❌ No hay datos de categorias para renderizar');
      return null;
    }
    console.log('Datos de categorias:', respuestasData.categorias);
    console.log('Categorias modelo disponibles:', categoriasModelo.length);

    return (
      <View>
        <Divider text="Numero de Cajas" containerStyle={{ marginVertical: 10 }} />
        {categoriasModelo.map(categoria => {
          const key = `cat_${categoria.idCategoria}`;
          const valor = respuestasData.categorias[key];
          console.log(`Categoria ${key}: valor = ${valor}`);
          if (valor) {
            return (
              <StaticText
                key={key}
                labelTitle={`${categoria.nombre} (${categoria.descripcion})`}
                value={valor}
                labelPosition="left"
              />
            );
          }
          return null;
        })}
      </View>
    );
  };

  const renderPreguntas = () => {
    console.log('\n=== RENDER DEBUG: Preguntas ===');
    console.log('respuestasData?.preguntas existe:', !!respuestasData?.preguntas);
    if (!respuestasData?.preguntas) {
      console.log('❌ No hay datos de preguntas para renderizar');
      return null;
    }
    console.log('Datos de preguntas:', respuestasData.preguntas);
    console.log('Preguntas modelo disponibles:', preguntasModelo.length);

    return (
      <View>
        <Divider text="Preguntas sobre el pedido" containerStyle={{ marginVertical: 10 }} />
        {preguntasModelo.map(pregunta => {
          const key = pregunta.idPregunta.toString();
          const valor = respuestasData.preguntas[key];
          console.log(`Pregunta ${key} (${pregunta.descripcion}): valor = ${valor}`);
          if (valor) {
            return (
              <StaticText
                key={key}
                labelTitle={pregunta.descripcion}
                value={valor}
                labelPosition="top"
              />
            );
          }
          return null;
        })}
      </View>
    );
  };

  const renderFormasPago = () => {
    if (!respuestasData?.formaPago) return null;

    return (
      <View>
        <Divider text="Formas de pago" containerStyle={{ marginVertical: 10 }} />
        {formasPagoModelo.map(forma => {
          const key = `forma_${forma.idFormaPago}`;
          const valor = respuestasData.formaPago[key];
          if (valor) {
            return (
              <StaticText
                key={key}
                labelTitle={forma.descripcion}
                value={valor === '1' ? 'Sí' : valor === '2' ? 'No' : valor}
                labelPosition="left"
              />
            );
          }
          return null;
        })}
      </View>
    );
  };

  const renderCondicionesPago = () => {
    if (!respuestasData?.condicionPago) return null;

    return (
      <View>
        <Divider text="Condiciones de pago" containerStyle={{ marginVertical: 10 }} />
        {Object.entries(respuestasData.condicionPago).map(([key, valor]) => {
          if (key === 'condicion_pago_select' && valor) {
            // Buscar la descripción de la condición de pago seleccionada
            const condicionId = parseInt(valor);
            const condicion = condicionesPagoModelo.find(c => c.idCondicionPago === condicionId);
            return (
              <StaticText
                key={key}
                labelTitle="Condición de Pago"
                value={condicion?.descripcion || valor}
                labelPosition="top"
              />
            );
          }
          return null;
        })}
        
        {/* Mostrar días de crédito si existe */}
        {respuestasData.diasCredito && (
          <StaticText
            labelTitle="Días de Crédito"
            value={respuestasData.diasCredito}
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
