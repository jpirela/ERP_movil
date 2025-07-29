import { useState, useEffect } from 'react';
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

export default function Cliente() {
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
    formaPago: "",
    condicionPago: "",
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
  const [estados, setEstados] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [filteredCiudades, setFilteredCiudades] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [parroquias, setParroquias] = useState([]);

  const [enabledMunicipio, setEnabledMunicipio] = useState(false);
  const [enabledParroquia, setEnabledParroquia] = useState(false);
  const [enabledCiudad, setEnabledCiudad] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      const [dataEstados, , dataCiudades] = await Promise.all([
        leerModeloFS('estados'),
        null,
        leerModeloFS('ciudades'),
      ]);
      setEstados(dataEstados || []);
      setCiudades(dataCiudades || []);
    };

    cargarDatos();
  }, []);

  const updateFormValue = (id, value) => {
    setObject((prev) => ({ ...prev, [id]: value }));
  };

  const handleEstadoSelect = (idEstado) => {
    updateFormValue('estado', idEstado);

    const estado = estados.find((e) => e.idEstado === idEstado);
    if (estado) {
      setMunicipios(estado.municipios || []);
      setEnabledMunicipio(true);
    } else {
      setMunicipios([]);
      setEnabledMunicipio(false);
    }

    // Reset niveles dependientes
    setParroquias([]);
    setEnabledParroquia(false);
    setEnabledCiudad(false);
    updateFormValue('municipio', '');
    updateFormValue('parroquia', '');
    updateFormValue('ciudad', '');

    const ciudadesFiltradas = ciudades.filter(c => c.id_estado === idEstado);
    setFilteredCiudades(ciudadesFiltradas);
    setEnabledCiudad(true);
  };

  const handleMunicipioSelect = (idMunicipio) => {
    updateFormValue('municipio', idMunicipio);

    const municipio = municipios.find((m) => m.idMunicipio === idMunicipio);
    if (municipio) {
      setParroquias(municipio.parroquias || []);
      setEnabledParroquia(true);
    } else {
      setParroquias([]);
      setEnabledParroquia(false);
    }

    updateFormValue('parroquia', '');
  };

  const handleParroquiaSelect = (idParroquia) => {
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
          <InputText id="nombre" value={object.nombre} placeholder="Nombre del negocio" onChange={updateFormValue} />
          <InputText id="razonSocial" value={object.razonSocial} placeholder="Razón Social" onChange={updateFormValue} />
          <InputText id="rif" value={object.rif} placeholder="RIF o CI" onChange={updateFormValue} />
          <InputText id="contacto" value={object.contacto} placeholder="Persona de contacto" onChange={updateFormValue} />
          <InputText id="correo" value={object.correo} placeholder="Correo electrónico" type="email" onChange={updateFormValue} />
          <InputText id="telefono" value={object.telefono} placeholder="Teléfono" type="phone" onChange={updateFormValue} />
          <InputText id="contacto2" value={object.contacto2} placeholder="Persona de contacto 2" onChange={updateFormValue} />
          <InputText id="correo2" value={object.correo2} placeholder="Correo electrónico 2" type="email" onChange={updateFormValue} />
          <InputText id="telefono2" value={object.telefono2} placeholder="Teléfono 2" type="phone" onChange={updateFormValue} />
          <TextArea id="direccion" value={object.direccion} placeholder="Dirección" onChange={updateFormValue} />
          <InputText id="ubicacionMap" value={object.ubicacionMap} placeholder="URL Google Maps" onChange={updateFormValue} />
          <InputText id="local" value={object.local} placeholder="Local" onChange={updateFormValue} />
          <InputText id="puntoReferencia" value={object.puntoReferencia} placeholder="Punto de referencia" onChange={updateFormValue} />
          <InputText id="diaRecepcion" value={object.diaRecepcion} placeholder="Día de recepción" onChange={updateFormValue} />
          <InputText id="tipoComercio" value={object.tipoComercio} placeholder="Tipo de comercio" onChange={updateFormValue} />
          <InputText id="facebook" value={object.facebook} placeholder="Facebook" onChange={updateFormValue} />
          <InputText id="instagram" value={object.instagram} placeholder="Instagram" onChange={updateFormValue} />
          <InputText id="tiktok" value={object.tiktok} placeholder="Tiktok" onChange={updateFormValue} />
          <InputText id="paginaWeb" value={object.paginaWeb} placeholder="Página web" onChange={updateFormValue} />

          {/* Selectores de Ubicación */}
          <Text style={styles.label}>Ubicación: Estado → Municipio → Parroquia</Text>

          <SelectBox
            id="estado"
            value={object.estado}
            labelTitle="Estado"
            onChange={handleEstadoSelect}
            options={estados.map((e) => ({ id: e.idEstado, nombre: e.nombre }))}
            enabled={estados.length > 0}
          />

          <SelectBox
            id="municipio"
            value={object.municipio}
            labelTitle="Municipio"
            onChange={handleMunicipioSelect}
            options={municipios.map((m) => ({ id: m.idMunicipio, nombre: m.nombre }))}
            enabled={enabledMunicipio}
          />

          <SelectBox
            id="parroquia"
            value={object.parroquia}
            labelTitle="Parroquia"
            onChange={handleParroquiaSelect}
            options={parroquias.map((p) => ({ id: p.idParroquia, nombre: p.nombre }))}
            enabled={enabledParroquia}
          />

          <SelectBox
            id="ciudad"
            value={object.ciudad}
            labelTitle="Ciudad"
            onChange={updateFormValue}
            options={filteredCiudades.map((c) => ({ id: c.idCiudad, nombre: c.nombre }))}
            enabled={enabledCiudad}
          />

          <StatusBar style="auto" />
        </View>
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
