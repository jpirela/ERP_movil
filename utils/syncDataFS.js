// utils/syncDataFS.js
import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';
import NetInfo from '@react-native-community/netinfo';

const { API_BASE_URL, MODELOS } = Constants.expoConfig.extra;
const DATA_DIR = FileSystem.documentDirectory + 'data/';

/**
 * Asegura que el directorio de datos exista
 */
const asegurarDataDir = async () => {
  const dirInfo = await FileSystem.getInfoAsync(DATA_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(DATA_DIR, { intermediates: true });
  }
};

/**
 * Devuelve el nombre del modelo y su ruta de archivo
 */
const getModeloPathPairs = () => {
  return Object.entries(MODELOS).map(([modelo, filePath]) => ({
    modelo,
    filePath,
  }));
};

/**
 * Sincroniza un modelo: descarga desde API o crea archivo vacío si no hay datos
 */
export const syncModeloFS = async (modelo, filePath) => {
  const url = `${API_BASE_URL}/${modelo}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Estado HTTP ${response.status}`);

    const data = await response.json();
    const json = JSON.stringify(data ?? [], null, 2);

    await FileSystem.writeAsStringAsync(filePath, json, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    console.log(`✅ ${modelo}.json actualizado correctamente`);
  } catch (error) {
    console.warn(`⚠️ Error al sincronizar ${modelo}: ${error.message}`);
    // Si el archivo no existe, crear archivo vacío
    const archivoExiste = await FileSystem.getInfoAsync(filePath);
    if (!archivoExiste.exists) {
      await FileSystem.writeAsStringAsync(filePath, '[]', {
        encoding: FileSystem.EncodingType.UTF8,
      });
      console.log(`📄 ${modelo}.json creado vacío por primera vez`);
    }
  }
};

/**
 * Sincroniza todos los modelos si hay conexión
 */
export const syncTodosLosModelosFS = async () => {
  try {
    await asegurarDataDir();

    const netInfo = await NetInfo.fetch();
    const conectado = netInfo.isConnected;

    for (const { modelo, filePath } of getModeloPathPairs()) {
      if (conectado) {
        console.log(`🌐 Sincronizando ${modelo} desde la API...`);
        await syncModeloFS(modelo, filePath);
      } else {
        const archivoExiste = await FileSystem.getInfoAsync(filePath);
        if (!archivoExiste.exists) {
          // Crear archivo vacío si no hay conexión y archivo no existe
          await FileSystem.writeAsStringAsync(filePath, '[]', {
            encoding: FileSystem.EncodingType.UTF8,
          });
          console.log(`📁 ${modelo}.json creado vacío sin conexión`);
        } else {
          console.log(`📄 ${modelo}.json ya existe, no se modifica`);
        }
      }
    }
  } catch (error) {
    console.warn('❌ Error al sincronizar modelos:', error.message);
  }
};

/**
 * Lee un archivo local con los datos del modelo
 */
export const leerModeloFS = async (modelo) => {
  const filePath = MODELOS[modelo];
  try {
    const archivoExiste = await FileSystem.getInfoAsync(filePath);
    if (!archivoExiste.exists) {
      throw new Error(`Archivo ${modelo}.json no encontrado`);
    }

    const contenido = await FileSystem.readAsStringAsync(filePath);
    return JSON.parse(contenido);
  } catch (err) {
    console.warn(`❌ Error al leer ${modelo}.json:`, err.message);
    return [];
  }
};
