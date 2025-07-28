import { useState } from 'react';
import {StyleSheet, ScrollView, KeyboardAvoidingView, Platform, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import InputText from '../components/Input/InputText';
import TextArea from '../components/Input/TextArea';
import SelectBox from '../components/Input/SelectBox';

import ciudades from '../data/ciudades.json';
import estado from '../data/estado.json';
import municipio from '../data/municipio.json';
import parroquia from '../data/parroquia.json';

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

  const [filteredCiudades, setFilteredCiudades] = useState([]);
  const [filteredMunicipios, setFilteredMunicipios] = useState([]);
  const [filteredParroquias, setFilteredParroquias] = useState([]);

  const [enabled, setEnabled] = useState({
    ciudad: false,
    municipio: false,
    parroquia: false,
  });

  const updateFormValue = (id, value) => {
    const strValue = value?.toString?.() ?? '';
    setObject((prev) => {
      const updated = { ...prev, [id]: strValue };

      if (id === 'estado') {
        updated.ciudad = '';
        updated.municipio = '';
        updated.parroquia = '';

        const estadoId = parseInt(strValue, 10);
        const ciudadesFiltradas = ciudades.rows.filter((c) => c.id_estado === estadoId);
        const municipiosFiltrados = municipio.rows.filter((m) => m.id_estado === estadoId);

        setFilteredCiudades(ciudadesFiltradas);
        setFilteredMunicipios(municipiosFiltrados);
        setFilteredParroquias([]);
        setEnabled({
          ciudad: true,
          municipio: true,
          parroquia: false,
        });
      }

      if (id === 'municipio') {
        updated.parroquia = '';

        const municipioId = parseInt(strValue, 10);
        const parroquiasFiltradas = parroquia.rows.filter((p) => p.id_municipio === municipioId);

        setFilteredParroquias(parroquiasFiltradas);
        setEnabled((prev) => ({
          ...prev,
          parroquia: true,
        }));
      }

      return updated;
    });
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
        <View>
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

          <SelectBox
            id="estado"
            value={object.estado}
            labelTitle="Estado"
            onChange={updateFormValue}
            options={estado.rows}
          />
          <SelectBox
            id="ciudad"
            value={object.ciudad}
            labelTitle="Ciudad"
            onChange={updateFormValue}
            options={filteredCiudades}
            enabled={enabled.ciudad}
          />
          <SelectBox
            id="municipio"
            value={object.municipio}
            labelTitle="Municipio"
            onChange={updateFormValue}
            options={filteredMunicipios}
            enabled={enabled.municipio}
          />
          <SelectBox
            id="parroquia"
            value={object.parroquia}
            labelTitle="Parroquia"
            onChange={updateFormValue}
            options={filteredParroquias}
            enabled={enabled.parroquia}
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
    padding: 20,
    paddingBottom: 60,
  },
});
