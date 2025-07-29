// components/Input/TreeViewUbicacion.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TreeViewUbicacion({ data, onSelect }) {
  const [expandedEstado, setExpandedEstado] = useState(null);
  const [expandedMunicipio, setExpandedMunicipio] = useState(null);

  return (
    <View style={styles.container}>
      {data.map((estado) => (
        <View key={estado.idEstado}>
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              setExpandedEstado(
                expandedEstado === estado.idEstado ? null : estado.idEstado
              )
            }
          >
            <Text style={styles.estado}>{estado.nombre}</Text>
          </TouchableOpacity>

          {expandedEstado === estado.idEstado &&
            estado.municipios.map((municipio) => (
              <View key={municipio.idMunicipio} style={styles.subItem}>
                <TouchableOpacity
                  onPress={() =>
                    setExpandedMunicipio(
                      expandedMunicipio === municipio.idMunicipio
                        ? null
                        : municipio.idMunicipio
                    )
                  }
                >
                  <Text style={styles.municipio}>{municipio.nombre}</Text>
                </TouchableOpacity>

                {expandedMunicipio === municipio.idMunicipio &&
                  municipio.parroquias.map((parroquia) => (
                    <TouchableOpacity
                      key={parroquia.idParroquia}
                      onPress={() =>
                        onSelect({
                          idEstado: estado.idEstado,
                          idMunicipio: municipio.idMunicipio,
                          idParroquia: parroquia.idParroquia,
                          estado: estado.nombre,
                          municipio: municipio.nombre,
                          parroquia: parroquia.nombre,
                        })
                      }
                      style={styles.parroquiaItem}
                    >
                      <Text style={styles.parroquia}>
                        {parroquia.nombre}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  item: {
    paddingVertical: 8,
    backgroundColor: '#e0f7fa',
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  estado: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  subItem: {
    marginLeft: 16,
    marginTop: 4,
  },
  municipio: {
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: 4,
    color: '#00796b',
  },
  parroquiaItem: {
    marginLeft: 16,
    paddingVertical: 4,
  },
  parroquia: {
    fontSize: 14,
    color: '#004d40',
  },
});
