import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import InputText from '../components/InputText';
import CheckBox from '../components/CheckBox';

const tiposHuevos = [
  { tipo: 'Extra grande', detalle: 'Jumbo > 78g' },
  { tipo: 'Más grande', detalle: 'AAA > 70g < 78g' },
  { tipo: 'Grandes', detalle: 'AA > 65 < 70' },
  { tipo: 'Medianos', detalle: 'A > 56g < 65g' },
  { tipo: 'Pequeño', detalle: 'B > 46g < 56g' },
  { tipo: 'Pigui', detalle: 'C < 48g' },
];

export default function FichaHuevos() {
  const [formState, setFormState] = useState({});

  const updateField = (seccion, campo, valor) => {
    setFormState(prev => ({
      ...prev,
      [seccion]: {
        ...prev[seccion],
        [campo]: valor,
      },
    }));
  };

  const toggleSwitch = (campo) => {
    setFormState(prev => ({
      ...prev,
      formasPago: {
        ...prev.formasPago,
        [campo]: !prev?.formasPago?.[campo],
      },
    }));
  };

  return (
    <ScrollView style={styles.container}>
      {tiposHuevos.map(({ tipo, detalle }) => (
        <View key={tipo} style={styles.card}>
          <Text style={styles.title}>{tipo}</Text>
          <Text style={styles.detail}>{detalle}</Text>
        </View>
      ))}

      <View style={styles.section}>
        <InputText
          labelTitle="¿Cuántas cajas compra por semana?"
          value={formState?.general?.cantidadCajas || ''}
          onChange={(v) => updateField('general', 'cantidadCajas', v)}
        />
        <InputText
          labelTitle="¿Dónde compra las cajas de huevos?"
          value={formState?.general?.lugarCompra || ''}
          onChange={(v) => updateField('general', 'lugarCompra', v)}
        />
        <InputText
          labelTitle="¿Cuántos proveedores tiene?"
          value={formState?.general?.cantidadProveedores || ''}
          onChange={(v) => updateField('general', 'cantidadProveedores', v)}
        />
        <InputText
          labelTitle="¿Cuáles?"
          value={formState?.general?.nombresProveedores || ''}
          onChange={(v) => updateField('general', 'nombresProveedores', v)}
        />
        <InputText
          labelTitle="¿Cuál es su proveedor de confianza?"
          value={formState?.general?.proveedorConfianza || ''}
          onChange={(v) => updateField('general', 'proveedorConfianza', v)}
        />
        <InputText
          labelTitle="¿Usted busca los huevos o se los traen?"
          value={formState?.general?.quienTrae || ''}
          onChange={(v) => updateField('general', 'quienTrae', v)}
        />
        <InputText
          labelTitle="¿Paga flete?"
          value={formState?.general?.pagaFlete || ''}
          onChange={(v) => updateField('general', 'pagaFlete', v)}
        />
        <InputText
          labelTitle="¿Cuánto paga de flete?"
          value={formState?.general?.montoFlete || ''}
          onChange={(v) => updateField('general', 'montoFlete', v)}
        />
        <InputText
          labelTitle="¿Estaría dispuesto a darnos la oportunidad de ser su proveedor de huevos?"
          value={formState?.general?.dispuestoProveedor || ''}
          onChange={(v) => updateField('general', 'dispuestoProveedor', v)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Formas de pago:</Text>
        {['efectivo', 'pagoMovil', 'transferenciaBS', 'zelle', 'transferenciaInt'].map(metodo => (
          <CheckBox
            key={metodo}
            labelTitle={labelForMetodo(metodo)}
            value={formState?.formasPago?.[metodo] || false}
            onChange={() => toggleSwitch(metodo)}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Condición de pago:</Text>
        <InputText
          labelTitle="Crédito"
          value={formState?.condicionPago?.credito || ''}
          placeholder="Ej. Sí o No"
          onChange={(v) => updateField('condicionPago', 'credito', v)}
        />
        <InputText
          labelTitle="Contado"
          value={formState?.condicionPago?.contado || ''}
          placeholder="Ej. Sí o No"
          onChange={(v) => updateField('condicionPago', 'contado', v)}
        />
        <InputText
          labelTitle="Días de crédito"
          value={formState?.condicionPago?.diasCredito || ''}
          onChange={(v) => updateField('condicionPago', 'diasCredito', v)}
        />
        <InputText
          labelTitle="Días de pago"
          value={formState?.condicionPago?.diasPago || ''}
          onChange={(v) => updateField('condicionPago', 'diasPago', v)}
        />
      </View>

      <View style={styles.section}>
        <InputText
          labelTitle="Días de recepción de mercancía"
          value={formState?.general?.recepcionDias || ''}
          onChange={(v) => updateField('general', 'recepcionDias', v)}
        />
      </View>
    </ScrollView>
  );
}

function labelForMetodo(key) {
  switch (key) {
    case 'efectivo': return 'Dólares en efectivo';
    case 'pagoMovil': return 'Pago móvil';
    case 'transferenciaBS': return 'Bs. Transferencia (Banco)';
    case 'zelle': return 'Zelle';
    case 'transferenciaInt': return 'Transferencia Bancaria';
    default: return key;
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  detail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  section: {
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 1,
  },
  subtitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 12,
    color: '#444',
  },
});
