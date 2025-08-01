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

      // Los datos del JSON son arrays directos, no objetos con propiedad 'rows'
      const categorias = Array.isArray(categoriasData) ? categoriasData : (categoriasData?.rows ?? []);
      const preguntas = Array.isArray(preguntasData) ? preguntasData : (preguntasData?.rows ?? []);
      const formasPago = Array.isArray(formaPagoData) ? formaPagoData : (formaPagoData?.rows ?? []);
      const condicionesPago = Array.isArray(condicionPagoData) ? condicionPagoData : (condicionPagoData?.rows ?? []);


      const catTransformadas = categorias
        .filter(categoria => categoria && categoria.idCategoria != null)
        .map((categoria) => ({
          id_pregunta: `cat_${categoria.idCategoria}`,
          tipo: 'text',
          descripcion: `${categoria.nombre || 'Sin nombre'} (${categoria.descripcion || 'Sin descripción'})`,
          labelPosition: 'left',
        }));

      const pregTransformadas = preguntas
        .filter(pregunta => pregunta && pregunta.idPregunta != null)
        .map((pregunta) => {
          let transformedPregunta = {
            id_pregunta: pregunta.idPregunta,
            tipo: pregunta.tipo || 'text',
            descripcion: pregunta.descripcion || 'Sin descripción',
            options: pregunta.options,
            labelPosition: 'top',
          };

          // Agregar opciones específicas para pregunta sobre flete
          if (pregunta.descripcion && pregunta.descripcion.includes('¿Paga flete?')) {
            transformedPregunta.tipo = 'select';
            transformedPregunta.options = [
              { id: 1, nombre: 'Si' },
              { id: 2, nombre: 'No' }
            ];
          }

          // Agregar opciones específicas para pregunta sobre búsqueda de huevos
          if (pregunta.descripcion && pregunta.descripcion.includes('¿Usted busca los huevos o se los traen?')) {
            transformedPregunta.tipo = 'select';
            transformedPregunta.options = [
              { id: 1, nombre: 'Me los traen' },
              { id: 2, nombre: 'Los busco' }
            ];
          }

          // Agregar opciones específicas para pregunta sobre ser proveedor
          if (pregunta.descripcion && pregunta.descripcion.includes('¿Estaria dispuesto a darnos la oportunidad de ser su proveedor de huevos?')) {
            transformedPregunta.tipo = 'select';
            transformedPregunta.options = [
              { id: 1, nombre: 'Si' },
              { id: 2, nombre: 'No' }
            ];
          }

          return transformedPregunta;
        });

      const formaPagoTransformada = formasPago
        .filter(item => item && item.idFormaPago != null)
        .map((item) => ({
          id_pregunta: `forma_${item.idFormaPago}`,
          tipo: 'select',
          descripcion: item.descripcion || 'Sin descripción',
          labelPosition: 'left',
          options: [
            { id: 1, nombre: 'Si' },
            { id: 2, nombre: 'No' },
          ],
        }));

      const condPagoTransformada = condicionesPago
        .filter(item => item && item.idCondicionPago != null)
        .map((item) => ({
          id_pregunta: `cond_${item.idCondicionPago}`,
          tipo: 'text',
          descripcion: item.descripcion || 'Sin descripción',
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
