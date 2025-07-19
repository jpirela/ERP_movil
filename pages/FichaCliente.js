// pages/Cliente.js
import React, { useState } from 'react';
import { StyleSheet, Text, Image, ScrollView, View } from 'react-native';
import InputText from '../components/InputText';
import TextArea from '../components/TextArea';
import { StatusBar } from 'expo-status-bar';

export default function Cliente() {
  const [textValue, setTextValue] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <InputText value={textValue} placeholder="Indique la Razón Social" onChange={setTextValue} />
      <InputText value={textValue} placeholder="Indique el RIF o CI" onChange={setTextValue} />
      <InputText value={textValue} placeholder="Indique el correo electrónico" onChange={setTextValue} />
      <InputText value={textValue} placeholder="Persona de contacto" onChange={setTextValue} />
      <InputText value={textValue} placeholder="Cargo" onChange={setTextValue} />
      <InputText value={textValue} placeholder="Teléfono 1" onChange={setTextValue} />
      <InputText value={textValue} placeholder="Teléfono 2" onChange={setTextValue} />
      <TextArea value={textValue} placeholder="Dirección" onChange={setTextValue} />
      <InputText value={textValue} placeholder="Instagram" onChange={setTextValue} />
      <InputText value={textValue} placeholder="Facebook" onChange={setTextValue} />
      <InputText value={textValue} placeholder="Página Web" onChange={setTextValue} />
      <TextArea value={textValue} placeholder="Ramo de la empresa" onChange={setTextValue} />
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
  header: {
    alignItems: 'center',
    marginBottom: 10,
  }
});
