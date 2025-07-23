import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import InputText from '../components/Input/InputText';
import SelectBox from '../components/Input/SelectBox';
import preguntasData from '../data/pregunta.json';

import estado from '../data/estado.json';
import formaPago from '../data/forma_pago.json';
import condicionPago from '../data/condicion_pago.json';

const opcionesExternas = {
  estado,
  formaPago,
  condicionPago,
};

export default function FichaHuevos() {
  const preguntas = preguntasData.rows;

  // Usar id_pregunta para construir el estado inicial
  const INITIAL_OBJECT = preguntas.reduce((acc, pregunta) => {
    acc[pregunta.id_pregunta] = '';
    return acc;
  }, {});

  const [formData, setFormData] = useState(INITIAL_OBJECT);

  const updateFormValue = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const renderPregunta = (pregunta) => {
    const {
      id_pregunta: id,
      tipo: type,
      descripcion: labelTitle,
      options: options,
    } = pregunta;

    if (type === 'select') {
      let resolvedOptions = [];

      if (typeof options === 'string') {
        const key = options.replace('.json', '');
        resolvedOptions = opcionesExternas[key] || [];
      } else if (Array.isArray(options) && options.length > 0) {
        resolvedOptions = options;
      }

      return (
        <SelectBox
          key={id}
          id={id}
          value={formData[id]}
          labelTitle={labelTitle}
          onChange={updateFormValue}
          options={resolvedOptions}
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
        onChange={updateFormValue}
        type={type}
      />
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {preguntas.map(renderPregunta)}
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 20,
    flexGrow: 1,
    backgroundColor: '#fff',
  },
});
