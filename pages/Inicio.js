import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

// Ejemplo de datos de clientes
const clientes = [
    { id: 1, nombre: 'Verduritas Sabrosas, S.R.L.' },
    { id: 2, nombre: 'Carnita Rica y Divina, C.A.' },
    { id: 3, nombre: 'Bodegas Unidas' },
];

// Iconos referenciados en App.js (ajusta según tu App.js)
const icons = {
    cliente: <MaterialCommunityIcons name="account-circle" size={24} color="gray" />,
    cerdos: <MaterialCommunityIcons name="pig" size={24} color="gray" />,
    carnes: <MaterialCommunityIcons name="food-turkey" size={24} color="gray" />,
    huevos: <MaterialCommunityIcons name="egg" size={24} color="gray" />,
};

const Inicio = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.table}>
                <View style={styles.headerRow}>
                    <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>Clientes</Text>
                    <Text style={[styles.cell, styles.headerCell, { width: '25%' }]}>Acciones</Text>
                </View>
                {clientes.map(cliente => (
                    <View key={cliente.id} style={styles.row}>
                        <Text style={[styles.cell, { width: '25%' }]}>{cliente.nombre}</Text>
                        <View style={[styles.actionsCell, { flex: 1 }]}>
                            <TouchableOpacity style={styles.actionBtn}>
                                {icons.cliente}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionBtn}>
                                {icons.cerdos}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionBtn}>
                                {icons.carnes}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionBtn}>
                                {icons.huevos}
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
    },
    table: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#f7f7f7',
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#eee',
        alignItems: 'center',
    },
    cell: {
        flex: 1,
        padding: 12,
        fontSize: 16,
    },
    headerCell: {
        fontWeight: 'bold',
        backgroundColor: '#f0f0f0',
    },
    actionsCell: {
        flex: 2,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        padding: 8,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e9ecef',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 8,
        marginBottom: 4,
    },
    actionText: {
        marginLeft: 4,
        fontSize: 14,
        color: '#333',
    },
});

export default Inicio;