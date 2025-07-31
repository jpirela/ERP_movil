import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';
import NetInfo from '@react-native-community/netinfo';

const { URL_BASE, MODELOS: MODELOS_NOMBRES } = Constants.expoConfig.extra;
const DATA_DIR = FileSystem.documentDirectory + 'data/';

// Construimos un objeto con nombre de modelo -> ruta local
const MODELOS = {};
MODELOS_NOMBRES.forEach((modelo) => {
  MODELOS[modelo] = `${DATA_DIR}${modelo}.json`;
});

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
  const url = `${URL_BASE}/${modelo}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Estado HTTP ${response.status}`);

    const data = await response.json();
    const json = JSON.stringify(data ?? [], null, 2);

    await FileSystem.writeAsStringAsync(filePath, json, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    console.log(`✅ ${modelo}.json actualizado correctamente (${Array.isArray(data) ? data.length : 0} registros)`);
  } catch (error) {
    console.warn(`⚠️ Error al sincronizar ${modelo}: ${error.message}`);
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
  
  if (!filePath) {
    console.warn(`❌ Modelo '${modelo}' no está configurado en MODELOS`);
    return [];
  }
  
  try {
    const archivoExiste = await FileSystem.getInfoAsync(filePath);
    if (!archivoExiste.exists) {
      console.warn(`📄 Archivo ${modelo}.json no encontrado en: ${filePath}`);
      return [];
    }
    
    const contenido = await FileSystem.readAsStringAsync(filePath);
    
    if (!contenido || contenido.trim() === '') {
      console.warn(`📄 Archivo ${modelo}.json está vacío`);
      return [];
    }
    
    const datos = JSON.parse(contenido);
    console.log(`✅ ${modelo}.json leído correctamente - ${Array.isArray(datos) ? datos.length : 'N/A'} registros`);
    
    return datos;
  } catch (err) {
    console.warn(`❌ Error al leer ${modelo}.json:`, err.message);
    return [];
  }
};
