// pages/Cliente.js
import React, { useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import InputText from '../components/Input/InputText';
import TextArea from '../components/Input/TextArea';
import SelectBox from '../components/Input/SelectBox';
import condicion_pago from '../data/condicion_pago.json';
import forma_pago from '../data/forma_pago.json';
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

  const updateFormValue = (fieldName, value) => {
    setObject((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
      <SelectBox id="formaPago" value={object.formaPago} labelTitle="Forma de pago" onChange={updateFormValue} options={forma_pago} />
      <SelectBox id="condicionPago" value={object.condicionPago} labelTitle="Condición de pago" onChange={updateFormValue} options={condicion_pago} />
      <InputText id="facebook" value={object.facebook} placeholder="Facebook" onChange={updateFormValue} />
      <InputText id="instagram" value={object.instagram} placeholder="Instagram" onChange={updateFormValue} />
      <InputText id="tiktok" value={object.tiktok} placeholder="Tiktok" onChange={updateFormValue} />
      <InputText id="paginaWeb" value={object.paginaWeb} placeholder="Página web" onChange={updateFormValue} />
      <SelectBox id="estado" value={object.estado} labelTitle="Estado" onChange={updateFormValue} options={estado} />
      <SelectBox id="municipio" value={object.municipio} labelTitle="Municipio" onChange={updateFormValue} options={municipio} />
      <SelectBox id="parroquia" value={object.parroquia} labelTitle="Parroquia" onChange={updateFormValue} options={parroquia} />
      <SelectBox id="ciudad" value={object.ciudad} labelTitle="Ciudad" onChange={updateFormValue} options={ciudades} />
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
