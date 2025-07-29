import * as FileSystem from 'expo-file-system';

const DATA_DIR = FileSystem.documentDirectory + 'data/';

export const MODELOS = {
  clientes: `${DATA_DIR}clientes.json`,
  categoria: `${DATA_DIR}categoria.json`,
  pregunta: `${DATA_DIR}pregunta.json`,
};

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
