import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import InputText from '../components/Input/InputText';
import SelectBox from '../components/Input/SelectBox';
import Divider from '../components/Input/Divider';

import preguntasData from '../data/pregunta.json';
import categoriasData from '../data/categoria.json';
import formaPagoData from '../data/forma_pago.json';
import condicionPagoData from '../data/condicion_pago.json';

export default function FichaHuevos() {
  // 1. Transformar datos
  const categoriasTransformadas = categoriasData.rows.map((categoria) => ({
    id_pregunta: `cat_${categoria.id_categoria}`,
    tipo: 'text',
    descripcion: categoria.nombre + ' (' + categoria.descripcion + ')',
    labelPosition: 'left',
  }));

  const preguntasTransformadas = preguntasData.rows.map((pregunta) => ({
    ...pregunta,
    labelPosition: 'top',
  }));

  const formaPagoTransformada = formaPagoData.rows.map((item) => ({
    id_pregunta: `forma_${item.id_forma_pago}`,
    tipo: 'select',
    descripcion: item.descripcion,
    labelPosition: 'left',
    options: [
				{ id: 1, nombre: "Sí" },
				{ id: 2, nombre: "No" }
			]
  }));

  const condicionPagoTransformada = condicionPagoData.rows.map((item) => ({
    id_pregunta: `cond_${item.id_condicion_pago}`,
    tipo: 'text',
    descripcion: item.descripcion,
    labelPosition: 'left',
  }));

  // 2. Estados independientes
  const [categorias, setCategorias] = useState(
    categoriasTransformadas.reduce((acc, item) => {
      acc[item.id_pregunta] = '';
      return acc;
    }, {})
  );

  const [preguntas, setPreguntas] = useState(
    preguntasTransformadas.reduce((acc, item) => {
      acc[item.id_pregunta] = '';
      return acc;
    }, {})
  );

  const [formaPago, setFormaPago] = useState(
    formaPagoTransformada.reduce((acc, item) => {
      acc[item.id_pregunta] = '';
      return acc;
    }, {})
  );

  const [condicionPago, setCondicionPago] = useState(
    condicionPagoTransformada.reduce((acc, item) => {
      acc[item.id_pregunta] = '';
      return acc;
    }, {})
  );

  // 3. Renderizador reutilizable
  const renderPregunta = (pregunta, formData, updateFn) => {
    const {
      id_pregunta: id,
      tipo: type,
      descripcion: labelTitle,
      options,
      labelPosition,
    } = pregunta;

    const handleChange = (id, value) => {
      updateFn((prev) => ({
        ...prev,
        [id]: value,
      }));
    };

    if (type === 'select') {
      const resolvedOptions = Array.isArray(options) ? options : [];
      return (
        <SelectBox
          key={id}
          id={id}
          value={formData[id]}
          labelTitle={labelTitle}
          onChange={handleChange}
          options={resolvedOptions}
          labelPosition={labelPosition}
        />
      );
    }

    return (
      <InputText
        key={id}
        id={id}
        value={formData[id]}
        labelTitle={labelTitle}
        placeholder=""
        onChange={handleChange}
        type={type}
        labelPosition={labelPosition}
      />
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >
        <Divider text="Tipos de Huevo" containerStyle={{ marginVertical: 10 }} />
        <View>
          {categoriasTransformadas.map((p) => renderPregunta(p, categorias, setCategorias))}
        </View>

        <Divider text="Preguntas" containerStyle={{ marginVertical: 10 }} />
        <View>
          {preguntasTransformadas.map((p) => renderPregunta(p, preguntas, setPreguntas))}
        </View>

        <Divider text="Forma de Pago" containerStyle={{ marginVertical: 10 }} />
        <View>
          {formaPagoTransformada.map((p) => renderPregunta(p, formaPago, setFormaPago))}
        </View>

        <Divider text="Condición de Pago" containerStyle={{ marginVertical: 10 }} />
        <View>
          {condicionPagoTransformada.map((p) => renderPregunta(p, condicionPago, setCondicionPago))}
        </View>

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
  container: {
    padding: 20,
    paddingBottom: 60,
  },
});
