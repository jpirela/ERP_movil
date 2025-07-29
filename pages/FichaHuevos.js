import { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  View,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import InputText from '../components/Input/InputText';
import SelectBox from '../components/Input/SelectBox';
import Divider from '../components/Input/Divider';

import { leerModeloFS } from '../utils/syncDataFS';

export default function FichaHuevos() {
  const [categoriasTransformadas, setCategoriasTransformadas] = useState([]);
  const [preguntasTransformadas, setPreguntasTransformadas] = useState([]);
  const [formaPagoTransformada, setFormaPagoTransformada] = useState([]);
  const [condicionPagoTransformada, setCondicionPagoTransformada] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categorias, setCategorias] = useState({});
  const [preguntas, setPreguntas] = useState({});
  const [formaPago, setFormaPago] = useState({});
  const [condicionPago, setCondicionPago] = useState({});

  useEffect(() => {
    const cargarModelos = async () => {
      const [
        preguntasData,
        categoriasData,
        formaPagoData,
        condicionPagoData,
      ] = await Promise.all([
        leerModeloFS('preguntas'),
        leerModeloFS('categorias'),
        leerModeloFS('formas-pago'),
        leerModeloFS('condiciones-pago'),
      ]);

      const categorias = categoriasData?.rows ?? [];
      const preguntas = preguntasData?.rows ?? [];
      const formasPago = formaPagoData?.rows ?? [];
      const condicionesPago = condicionPagoData?.rows ?? [];

      const catTransformadas = categorias.map((categoria) => ({
        id_pregunta: `cat_${categoria.id_categoria}`,
        tipo: 'text',
        descripcion: `${categoria.nombre} (${categoria.descripcion})`,
        labelPosition: 'left',
      }));

      const pregTransformadas = preguntas.map((pregunta) => ({
        ...pregunta,
        labelPosition: 'top',
      }));

      const formaPagoTransformada = formasPago.map((item) => ({
        id_pregunta: `forma_${item.id_forma_pago}`,
        tipo: 'select',
        descripcion: item.descripcion,
        labelPosition: 'left',
        options: [
          { id: 1, nombre: 'Sí' },
          { id: 2, nombre: 'No' },
        ],
      }));

      const condPagoTransformada = condicionesPago.map((item) => ({
        id_pregunta: `cond_${item.id_condicion_pago}`,
        tipo: 'text',
        descripcion: item.descripcion,
        labelPosition: 'left',
      }));

      setCategoriasTransformadas(catTransformadas);
      setPreguntasTransformadas(pregTransformadas);
      setFormaPagoTransformada(formaPagoTransformada);
      setCondicionPagoTransformada(condPagoTransformada);

      // Inicializar valores de formularios
      setCategorias(catTransformadas.reduce((acc, item) => ({ ...acc, [item.id_pregunta]: '' }), {}));
      setPreguntas(pregTransformadas.reduce((acc, item) => ({ ...acc, [item.id_pregunta]: '' }), {}));
      setFormaPago(formaPagoTransformada.reduce((acc, item) => ({ ...acc, [item.id_pregunta]: '' }), {}));
      setCondicionPago(condPagoTransformada.reduce((acc, item) => ({ ...acc, [item.id_pregunta]: '' }), {}));

      setLoading(false);
    };

    cargarModelos();
  }, []);

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
    paddingBottom: 100,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
