import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';
import NetInfo from '@react-native-community/netinfo';

// Datos embebidos para Snack
import estadosDefault from '../data/estados.json';
import municipiosDefault from '../data/municipios.json';
import parroquiasDefault from '../data/parroquias.json';
import ciudadesDefault from '../data/ciudades.json';

const { URL_BASE, MODELOS: MODELOS_NOMBRES } = Constants.expoConfig.extra;
const DATA_DIR = FileSystem.documentDirectory + 'data/';

const isRunningInSnack =
  Constants.appOwnership === 'expo' && Constants.executionEnvironment === 'storeClient';

// Mapas de respaldo para Snack
const MODELO_DEFAULTS = {
  estados: estadosDefault,
  municipios: municipiosDefault,
  parroquias: parroquiasDefault,
  ciudades: ciudadesDefault,
};

// Rutas de archivos por modelo
const MODELOS = {};
MODELOS_NOMBRES.forEach((modelo) => {
  MODELOS[modelo] = `${DATA_DIR}${modelo}.json`;
});

const asegurarDataDir = async () => {
  const dirInfo = await FileSystem.getInfoAsync(DATA_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(DATA_DIR, { intermediates: true });
  }
};

const getModeloPathPairs = () => {
  return Object.entries(MODELOS).map(([modelo, filePath]) => ({
    modelo,
    filePath,
  }));
};

export const syncModeloFS = async (modelo, filePath) => {
  if (isRunningInSnack) {
    console.log(`⚠️ Saltando sync de ${modelo} en Snack`);
    return;
  }

  const url = `${URL_BASE}/${modelo}`;

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
    const archivoExiste = await FileSystem.getInfoAsync(filePath);
    if (!archivoExiste.exists) {
      await FileSystem.writeAsStringAsync(filePath, '[]', {
        encoding: FileSystem.EncodingType.UTF8,
      });
      console.log(`📄 ${modelo}.json creado vacío por primera vez`);
    }
  }
};

export const syncTodosLosModelosFS = async () => {
  if (isRunningInSnack) {
    console.log('⚠️ Ejecutando en Snack: no se sincroniza FileSystem');
    return;
  }

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

export const leerModeloFS = async (modelo) => {
  if (isRunningInSnack) {
    console.log(`📦 Snack: leyendo ${modelo} desde código`);
    return MODELO_DEFAULTS[modelo] ?? [];
  }

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
