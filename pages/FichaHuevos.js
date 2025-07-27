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
import preguntasData from '../data/pregunta.json';
import formaPago from '../data/forma_pago.json';
import condicionPago from '../data/condicion_pago.json';

const opcionesExternas = {
  formaPago,
  condicionPago,
};

export default function FichaHuevos() {
  const preguntas = preguntasData.rows;

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
      options,
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
        <View>{preguntas.map(renderPregunta)}</View>
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
