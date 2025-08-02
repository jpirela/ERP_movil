import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import InputText from '../components/Input/InputText';
import TextArea from '../components/Input/TextArea';
import SelectBox from '../components/Input/SelectBox';

import { leerModeloFS } from '../utils/syncDataFS';

const Cliente = forwardRef((props, ref) => {
  const INITIAL_OBJECT = {
    nombre: "",
    razonSocial: "",
    rif: "",
    contacto: "",
    correo: "",
    telefono: "",
    contacto2: "",
    correo2: "",
    telefono2: "",
    direccion: "",
    ubicacionMap: "",
    local: "",
    puntoReferencia: "",
    diaRecepcion: "",
    tipoComercio: "",
    estado: "",
    municipio: "",
    parroquia: "",
    ciudad: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    paginaWeb: "",
  };

  const [object, setObject] = useState(INITIAL_OBJECT);
  
  // Variables de estado para los modelos completos
  const [modeloEstados, setModeloEstados] = useState([]);
  const [modeloCiudades, setModeloCiudades] = useState([]);
  
  // Variables de estado para llenar los SelectBox
  const [estados, setEstados] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [parroquias, setParroquias] = useState([]);

  // Estados de habilitación de SelectBox
  const [enabledCiudad, setEnabledCiudad] = useState(false);
  const [enabledMunicipio, setEnabledMunicipio] = useState(false);
  const [enabledParroquia, setEnabledParroquia] = useState(false);

  // Estado para manejo de errores de validación
  const [camposConError, setCamposConError] = useState({});

  // Referencias para todos los campos
  const fieldRefs = {
    nombre: useRef(),
    razonSocial: useRef(),
    rif: useRef(),
    contacto: useRef(),
    correo: useRef(),
    telefono: useRef(),
    direccion: useRef(),
    estado: useRef(),
    municipio: useRef(),
    parroquia: useRef(),
    ciudad: useRef(),
  };

  // Exponer datos y funciones al componente padre
  useImperativeHandle(ref, () => ({
    getData: () => object,
    validateData: () => {
      const requiredFields = ['nombre', 'razonSocial', 'rif', 'contacto', 'correo', 'telefono', 'direccion', 'estado', 'municipio', 'parroquia', 'ciudad'];
      const errores = {};
      requiredFields.forEach(field => {
        if (!object[field] || object[field].trim() === '') {
          errores[field] = true;
        }
      });
      setCamposConError(errores);
      
      // Enfocar el primer campo con error
      if (Object.keys(errores).length > 0) {
        const primerCampoConError = Object.keys(errores)[0];
        const fieldRef = fieldRefs[primerCampoConError];
        if (fieldRef && fieldRef.current) {
          setTimeout(() => {
            if (fieldRef.current.focus) {
              fieldRef.current.focus();
            }
          }, 100);
        }
      }
      
      return Object.keys(errores).length === 0;
    },
    clearErrors: () => setCamposConError({})
  }));

  useEffect(() => {
    const cargarDatos = async () => {
      const [dataEstados, , dataCiudades] = await Promise.all([
        leerModeloFS('estados'),
        null,
        leerModeloFS('ciudades'),
      ]);
      
      // Guardar los modelos completos
      setModeloEstados(dataEstados || []);
      setModeloCiudades(dataCiudades || []);
      
      // Crear variable Estados solo con idEstado y nombre
      const estadosSimplificados = (dataEstados || []).map(estado => ({
        idEstado: estado.idEstado,
        nombre: estado.nombre
      }));
      setEstados(estadosSimplificados);
      
      // Inicializar variables vacías para los demás SelectBox
      setCiudades([]);
      setMunicipios([]);
      setParroquias([]);
    };

    cargarDatos();
  }, []);

  const updateFormValue = (id, value) => {
    setObject((prev) => ({ ...prev, [id]: value }));
  };

  const handleEstadoSelect = (id, idEstado) => {
    updateFormValue('estado', idEstado);

    // Reset niveles dependientes primero
    setMunicipios([]);
    setParroquias([]);
    setCiudades([]);
    setEnabledMunicipio(false);
    setEnabledParroquia(false);
    setEnabledCiudad(false);
    updateFormValue('municipio', '');
    updateFormValue('parroquia', '');
    updateFormValue('ciudad', '');

    if (idEstado && idEstado !== '') {
      // Convertir a número para asegurar comparación correcta
      const idEstadoNum = parseInt(idEstado, 10);
      // Buscar el estado en el modelo completo con comparación flexible
      const estadoCompleto = modeloEstados.find((e) => {
        const match = e.idEstado === idEstado || e.idEstado === idEstadoNum;
        return match;
      });
      
      if (estadoCompleto) {
        // Llenar municipios del estado seleccionado
        const municipiosDelEstado = estadoCompleto.municipios || [];
        setMunicipios(municipiosDelEstado);
        setEnabledMunicipio(true);
        // Filtrar ciudades por idEstado usando comparación flexible
        const ciudadesDelEstado = modeloCiudades.filter(ciudad => 
          ciudad.idEstado === idEstado || ciudad.idEstado === idEstadoNum
        );
        setCiudades(ciudadesDelEstado);
        setEnabledCiudad(true);
      }
    }
  };

  const handleMunicipioSelect = (id, idMunicipio) => {
    updateFormValue('municipio', idMunicipio);

    // Reset parroquias
    setParroquias([]);
    setEnabledParroquia(false);
    updateFormValue('parroquia', '');

    if (idMunicipio && idMunicipio !== '') {
      // Convertir a número para asegurar comparación correcta
      const idMunicipioNum = parseInt(idMunicipio, 10);
      // Buscar el municipio en la lista actual con comparación flexible
      const municipio = municipios.find((m) => {
        const match = m.idMunicipio === idMunicipio || m.idMunicipio === idMunicipioNum;
        return match;
      });
      
      if (municipio) {
        // Llenar parroquias del municipio seleccionado
        const parroquiasDelMunicipio = municipio.parroquias || [];
        setParroquias(parroquiasDelMunicipio);
        setEnabledParroquia(true);
      }
    }
  };

  const handleParroquiaSelect = (id, idParroquia) => {
    updateFormValue('parroquia', idParroquia);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 100}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
      >
        <View>
          {/* Inputs de texto */}
          <InputText ref={fieldRefs.nombre} id="nombre" value={object.nombre} placeholder="Nombre del negocio" onChange={(id, value) => { updateFormValue(id, value); fieldRefs[id].current.focus(); }} hasError={camposConError.nombre} />
          <InputText ref={fieldRefs.razonSocial} id="razonSocial" value={object.razonSocial} placeholder="Razón Social" onChange={(id, value) => { updateFormValue(id, value); fieldRefs[id].current.focus(); }} hasError={camposConError.razonSocial} />
          <InputText ref={fieldRefs.rif} id="rif" value={object.rif} placeholder="RIF o CI" onChange={(id, value) => { updateFormValue(id, value); fieldRefs[id].current.focus(); }} hasError={camposConError.rif} />
          <InputText ref={fieldRefs.contacto} id="contacto" value={object.contacto} placeholder="Persona de contacto" onChange={(id, value) => { updateFormValue(id, value); fieldRefs[id].current.focus(); }} hasError={camposConError.contacto} />
          <InputText ref={fieldRefs.correo} id="correo" value={object.correo} placeholder="Correo electrónico" type="email" onChange={(id, value) => { updateFormValue(id, value); fieldRefs[id].current.focus(); }} hasError={camposConError.correo} />
          <InputText ref={fieldRefs.telefono} id="telefono" value={object.telefono} placeholder="Teléfono" type="phone" onChange={(id, value) => { updateFormValue(id, value); fieldRefs[id].current.focus(); }} hasError={camposConError.telefono} />
          <InputText id="contacto2" value={object.contacto2} placeholder="Persona de contacto 2" onChange={updateFormValue} />
          <InputText id="correo2" value={object.correo2} placeholder="Correo electrónico 2" type="email" onChange={updateFormValue} />
          <InputText id="telefono2" value={object.telefono2} placeholder="Teléfono 2" type="phone" onChange={updateFormValue} />
          <TextArea ref={fieldRefs.direccion} id="direccion" value={object.direccion} placeholder="Dirección" onChange={(id, value) => { updateFormValue(id, value); fieldRefs[id].current.focus(); }} hasError={camposConError.direccion} />
          <InputText id="ubicacionMap" value={object.ubicacionMap} placeholder="URL Google Maps" onChange={updateFormValue} />
          <InputText id="local" value={object.local} placeholder="Local" onChange={updateFormValue} />
          <InputText id="puntoReferencia" value={object.puntoReferencia} placeholder="Punto de referencia" onChange={updateFormValue} />
          <InputText id="diaRecepcion" value={object.diaRecepcion} placeholder="Día de recepción" onChange={updateFormValue} />
          <InputText id="tipoComercio" value={object.tipoComercio} placeholder="Tipo de comercio" onChange={updateFormValue} />
          <InputText id="facebook" value={object.facebook} placeholder="Facebook" onChange={updateFormValue} />
          <InputText id="instagram" value={object.instagram} placeholder="Instagram" onChange={updateFormValue} />
          <InputText id="tiktok" value={object.tiktok} placeholder="Tiktok" onChange={updateFormValue} />
          <InputText id="paginaWeb" value={object.paginaWeb} placeholder="Página web" onChange={updateFormValue} />
          <InputText ref={fieldRefs.razonSocial} id="razonSocial" value={object.razonSocial} placeholder="Razón Social" onChange={updateFormValue} hasError={camposConError.razonSocial} />
          <InputText ref={fieldRefs.rif} id="rif" value={object.rif} placeholder="RIF o CI" onChange={updateFormValue} hasError={camposConError.rif} />
          <InputText ref={fieldRefs.contacto} id="contacto" value={object.contacto} placeholder="Persona de contacto" onChange={updateFormValue} hasError={camposConError.contacto} />
          <InputText ref={fieldRefs.correo} id="correo" value={object.correo} placeholder="Correo electrónico" type="email" onChange={updateFormValue} hasError={camposConError.correo} />
          <InputText ref={fieldRefs.telefono} id="telefono" value={object.telefono} placeholder="Teléfono" type="phone" onChange={updateFormValue} hasError={camposConError.telefono} />
          <InputText id="contacto2" value={object.contacto2} placeholder="Persona de contacto 2" onChange={updateFormValue} />
          <InputText id="correo2" value={object.correo2} placeholder="Correo electrónico 2" type="email" onChange={updateFormValue} />
          <InputText id="telefono2" value={object.telefono2} placeholder="Teléfono 2" type="phone" onChange={updateFormValue} />
          <TextArea ref={fieldRefs.direccion} id="direccion" value={object.direccion} placeholder="Dirección" onChange={updateFormValue} hasError={camposConError.direccion} />
          <InputText id="ubicacionMap" value={object.ubicacionMap} placeholder="URL Google Maps" onChange={updateFormValue} />
          <InputText id="local" value={object.local} placeholder="Local" onChange={updateFormValue} />
          <InputText id="puntoReferencia" value={object.puntoReferencia} placeholder="Punto de referencia" onChange={updateFormValue} />
          <InputText id="diaRecepcion" value={object.diaRecepcion} placeholder="Día de recepción" onChange={updateFormValue} />
          <InputText id="tipoComercio" value={object.tipoComercio} placeholder="Tipo de comercio" onChange={updateFormValue} />
          <InputText id="facebook" value={object.facebook} placeholder="Facebook" onChange={updateFormValue} />
          <InputText id="instagram" value={object.instagram} placeholder="Instagram" onChange={updateFormValue} />
          <InputText id="tiktok" value={object.tiktok} placeholder="Tiktok" onChange={updateFormValue} />
          <InputText id="paginaWeb" value={object.paginaWeb} placeholder="Página web" onChange={updateFormValue} />

          <SelectBox
            ref={fieldRefs.estado}
            id="estado"
            value={object.estado}
            labelTitle="Estado"
            onChange={handleEstadoSelect}
            options={estados.map((e) => ({
              id: `estado-${e.idEstado}`,
              realId: e.idEstado,
              nombre: e.nombre,
            }))}
            enabled={estados.length > 0}
            hasError={camposConError.estado}
          />

          <SelectBox
            ref={fieldRefs.municipio}
            id="municipio"
            value={object.municipio}
            labelTitle="Municipio"
            onChange={handleMunicipioSelect}
            options={municipios.map((m) => ({
              id: `mun-${object.estado}-${m.idMunicipio}`,
              realId: m.idMunicipio,
              nombre: m.nombre,
            }))}
            enabled={enabledMunicipio}
            hasError={camposConError.municipio}
          />

          <SelectBox
            ref={fieldRefs.parroquia}
            id="parroquia"
            value={object.parroquia}
            labelTitle="Parroquia"
            onChange={handleParroquiaSelect}
            options={parroquias.map((p) => ({
              id: `parr-${object.estado}-${object.municipio}-${p.idParroquia}`,
              realId: p.idParroquia,
              nombre: p.nombre,
            }))}
            enabled={enabledParroquia}
            hasError={camposConError.parroquia}
          />

          <SelectBox
            ref={fieldRefs.ciudad}
            id="ciudad"
            value={object.ciudad}
            labelTitle="Ciudad"
            onChange={updateFormValue}
            options={ciudades.map((c) => ({
              id: `ciudad-${c.idCiudad || c.id_ciudad}`,
              realId: c.idCiudad || c.id_ciudad,
              nombre: c.nombre,
            }))}
            enabled={enabledCiudad}
            hasError={camposConError.ciudad}
          />

          <StatusBar style="auto" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 80,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
  },
});

export default Cliente;
