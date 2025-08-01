import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    ScrollView,
    FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';

export default function Reservations() {
    const router = useRouter();
    const { reservations, getReservationsByRestaurantAndDate, updateReservationDate, deleteReservation } = useAppContext();
    
    const [selectedReservation, setSelectedReservation] = useState<any>(null);
    const [newDate, setNewDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadReservations();
    }, []);

    const loadReservations = async () => {
        setIsLoading(true);
        try {
            await getReservationsByRestaurantAndDate();
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar las reservas');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectReservation = (reservation: any) => {
        setSelectedReservation(reservation);
        setNewDate(reservation.date);
    };

    const handleUpdateDate = async () => {
        if (!selectedReservation || !newDate) return;

        try {
            console.log('Reservations: Updating reservation date', { id: selectedReservation.id, newDate });
            await updateReservationDate(selectedReservation.id, newDate);
            Alert.alert('Éxito', 'Fecha de reserva actualizada correctamente');
            
            await loadReservations();
            setSelectedReservation({ ...selectedReservation, date: newDate });
        } catch (error: any) {
            console.error('Reservations: Error updating reservation:', error);
            
            let errorMessage = 'No se pudo actualizar la fecha';
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            Alert.alert('Error', errorMessage);
        }
    };

    const handleDelete = async () => {
        if (!selectedReservation) return;

        Alert.alert(
            'Confirmar cancelación',
            '¿Estás seguro de que quieres cancelar esta reserva?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Sí, cancelar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            console.log('Reservations: Deleting reservation', { id: selectedReservation.id });
                            await deleteReservation(selectedReservation.id);
                            Alert.alert('Reserva cancelada', 'La reserva ha sido cancelada exitosamente');
                            setSelectedReservation(null);
                            await loadReservations();
                        } catch (error: any) {
                            console.error('Reservations: Error deleting reservation:', error);
                            
                            let errorMessage = 'No se pudo cancelar la reserva';
                            if (error.response?.data?.error) {
                                errorMessage = error.response.data.error;
                            } else if (error.message) {
                                errorMessage = error.message;
                            }
                            
                            Alert.alert('Error', errorMessage);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>Mis Reservas</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.pageTitle}>Todas las Reservas</Text>
                
                {isLoading ? (
                    <Text style={styles.loadingText}>Cargando reservas...</Text>
                ) : reservations.length === 0 ? (
                    <Text style={styles.emptyText}>No hay reservas registradas</Text>
                ) : (
                    <FlatList
                        data={reservations}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                style={[
                                    styles.reservationItem,
                                    selectedReservation?.id === item.id && styles.selectedReservation
                                ]}
                                onPress={() => handleSelectReservation(item)}
                            >
                                <View style={styles.reservationItemHeader}>
                                    <Text style={styles.customerName}>{item.customer_name}</Text>
                                    <Text style={styles.reservationCode}>#{item.code}</Text>
                                </View>
                                <Text style={styles.restaurantName}>{item.restaurant?.name || 'N/A'}</Text>
                                <Text style={styles.reservationDate}>{item.date}</Text>
                                <Text style={styles.customerContact}>{item.customer_email}</Text>
                            </TouchableOpacity>
                        )}
                        scrollEnabled={false}
                    />
                )}

                {selectedReservation && (
                    <View style={styles.reservationCard}>
                        <Text style={styles.cardTitle}>Detalles de la Reserva</Text>
                        
                        <View style={styles.reservationDetails}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Nombre:</Text>
                                <Text style={styles.detailValue}>{selectedReservation.customer_name}</Text>
                            </View>
                            
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Email:</Text>
                                <Text style={styles.detailValue}>{selectedReservation.customer_email}</Text>
                            </View>
                            
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>DNI:</Text>
                                <Text style={styles.detailValue}>{selectedReservation.customer_dni}</Text>
                            </View>
                            
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Restaurante:</Text>
                                <Text style={styles.detailValue}>{selectedReservation.restaurant?.name || 'N/A'}</Text>
                            </View>
                            
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Fecha actual:</Text>
                                <Text style={styles.detailValue}>{selectedReservation.date}</Text>
                            </View>
                            
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Código:</Text>
                                <Text style={styles.detailValue}>{selectedReservation.code}</Text>
                            </View>
                        </View>

                        <View style={styles.actionSection}>
                            <Text style={styles.actionTitle}>Cambiar Fecha</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="YYYY-MM-DD HH:MM"
                                value={newDate}
                                onChangeText={setNewDate}
                            />
                            
                            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateDate}>
                                <Text style={styles.updateButtonText}>Actualizar Fecha</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={styles.cancelButton} onPress={handleDelete}>
                                <Text style={styles.cancelButtonText}>Cancelar Reserva</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        backgroundColor: '#4F46E5',
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    placeholder: {
        width: 24,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 24,
        textAlign: 'center',
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#6B7280',
        marginTop: 50,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginTop: 50,
    },
    reservationItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedReservation: {
        borderColor: '#4F46E5',
        backgroundColor: '#F8FAFF',
    },
    reservationItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    customerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    reservationCode: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4F46E5',
        backgroundColor: '#E0E7FF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    restaurantName: {
        fontSize: 16,
        color: '#374151',
        marginBottom: 4,
        fontWeight: '500',
    },
    reservationDate: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    customerContact: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    searchForm: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#F9FAFB',
        color: '#1F2937',
    },
    searchButton: {
        backgroundColor: '#4F46E5',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    searchButtonDisabled: {
        backgroundColor: '#9CA3AF',
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    reservationCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 16,
        textAlign: 'center',
    },
    reservationDetails: {
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    detailLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 14,
        color: '#1F2937',
        fontWeight: '600',
    },
    actionSection: {
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 20,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
    },
    updateButton: {
        backgroundColor: '#10B981',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 8,
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#EF4444',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});