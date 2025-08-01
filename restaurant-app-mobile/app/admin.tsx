import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    ScrollView,
    Alert,
    Image,
    Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { Restaurant } from '@/types';
import { Picker } from '@react-native-picker/picker';

export default function Admin() {
    const router = useRouter();
    const { 
        restaurants, 
        reservations, 
        addRestaurant, 
        updateRestaurant, 
        deleteRestaurant,
        getReservationsByRestaurantAndDate,
        updateReservationDate,
        deleteReservation
    } = useAppContext();
    
 
    const [activeTab, setActiveTab] = useState<'restaurants' | 'reservations'>('restaurants');
    

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        city: '',
        photo_url: '',
        is_active: true,
    });

    
    const [selectedReservation, setSelectedReservation] = useState<any>(null);
    const [newDate, setNewDate] = useState('');

    React.useEffect(() => {
        if (activeTab === 'reservations') {
            loadReservations();
        }
    }, [activeTab]);

    const loadReservations = async () => {
        try {
            await getReservationsByRestaurantAndDate();
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar las reservas');
        }
    };

   
    const resetForm = () => {
        setFormData({ name: '', address: '', description: '', city: '', photo_url: '', is_active: true });
        setEditingRestaurant(null);
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.address) {
            Alert.alert('Error', 'Nombre y dirección son obligatorios');
            return;
        }

        try {
            if (editingRestaurant) {
                await updateRestaurant(editingRestaurant.id, formData);
            } else {
                await addRestaurant(formData);
            }

            resetForm();
            setIsModalVisible(false);
            Alert.alert('Éxito', editingRestaurant ? 'Restaurante actualizado' : 'Restaurante creado');
        } catch (error) {
            Alert.alert('Error', 'No se pudo guardar el restaurante');
        }
    };

    const handleEdit = (restaurant: Restaurant) => {
        setFormData({
            name: restaurant.name,
            address: restaurant.address,
            description: restaurant.description || '',
            city: restaurant.city || '',
            photo_url: restaurant.photo_url || '',
            is_active: restaurant.is_active,
        });
        setEditingRestaurant(restaurant);
        setIsModalVisible(true);
    };

    const handleDelete = (restaurant: Restaurant) => {
        Alert.alert(
            'Confirmar eliminación',
            `¿Estás seguro de eliminar "${restaurant.name}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Eliminar', 
                    style: 'destructive', 
                    onPress: async () => {
                        try {
                            await deleteRestaurant(restaurant.id);
                            Alert.alert('Éxito', 'Restaurante eliminado correctamente');
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar el restaurante.');
                        }
                    }
                },
            ]
        );
    };

    const handleSelectReservation = (reservation: any) => {
        setSelectedReservation(reservation);
        setNewDate(reservation.date);
    };

    const handleUpdateDate = async () => {
        if (!selectedReservation || !newDate) return;

        try {
            console.log('Admin: Updating reservation date', { id: selectedReservation.id, newDate });
            await updateReservationDate(selectedReservation.id, newDate);
            Alert.alert('Éxito', 'Fecha de reserva actualizada correctamente');
            await loadReservations();
            setSelectedReservation({ ...selectedReservation, date: newDate });
        } catch (error: any) {
            console.error('Admin: Error updating reservation:', error);
            
            let errorMessage = 'No se pudo actualizar la fecha';
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            Alert.alert('Error', errorMessage);
        }
    };

    const handleDeleteReservation = async () => {
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
                            console.log('Admin: Deleting reservation', { id: selectedReservation.id });
                            await deleteReservation(selectedReservation.id);
                            Alert.alert('Reserva cancelada', 'La reserva ha sido cancelada exitosamente');
                            setSelectedReservation(null);
                            await loadReservations();
                        } catch (error: any) {
                            console.error('Admin: Error deleting reservation:', error);
                            
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

    const renderRestaurant = ({ item }: { item: Restaurant }) => (
        <View style={styles.restaurantCard}>
            {item.photo_url ? (
                <Image
                    source={{ uri: item.photo_url }}
                    style={styles.restaurantImage}
                    resizeMode="cover"
                />
            ) : null}
    
            <View style={styles.restaurantContent}>
                <View style={styles.restaurantInfo}>
                    <Text style={styles.restaurantName}>{item.name}</Text>
                    <Text style={styles.restaurantAddress}>{item.address}</Text>
                    {item.description ? (
                        <Text style={styles.restaurantDescription}>{item.description}</Text>
                    ) : null}
                    {item.city ? (
                        <Text style={styles.restaurantCity}>{item.city}</Text>
                    ) : null}
                </View>
        
                <View style={styles.restaurantActions}>
                    <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
                        <Feather name="edit" size={20} color="#4F46E5" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteButton}>
                        <Feather name="trash-2" size={20} color="#ef4444" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderReservation = ({ item }: { item: any }) => (
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
            <Text style={styles.restaurantNameReservation}>{item.restaurant?.name || 'N/A'}</Text>
            <Text style={styles.reservationDate}>{item.date}</Text>
            <Text style={styles.customerContact}>{item.customer_email}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>Panel de Administración</Text>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'restaurants' && styles.activeTab]}
                    onPress={() => setActiveTab('restaurants')}
                >
                    <Feather name="home" size={20} color={activeTab === 'restaurants' ? '#4F46E5' : '#6B7280'} />
                    <Text style={[styles.tabText, activeTab === 'restaurants' && styles.activeTabText]}>
                        Restaurantes
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tab, activeTab === 'reservations' && styles.activeTab]}
                    onPress={() => setActiveTab('reservations')}
                >
                    <Feather name="calendar" size={20} color={activeTab === 'reservations' ? '#4F46E5' : '#6B7280'} />
                    <Text style={[styles.tabText, activeTab === 'reservations' && styles.activeTabText]}>
                        Reservas
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {activeTab === 'restaurants' ? (
                    <>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Gestión de Restaurantes</Text>
                            <TouchableOpacity 
                                style={styles.addButton}
                                onPress={() => setIsModalVisible(true)}
                            >
                                <Feather name="plus" size={20} color="#fff" />
                                <Text style={styles.addButtonText}>Agregar</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={restaurants}
                            renderItem={renderRestaurant}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>No hay restaurantes registrados</Text>
                            }
                        />
                    </>
                ) : (
                    <>
                        <Text style={styles.sectionTitle}>Gestión de Reservas</Text>
                        
                        <FlatList
                            data={reservations}
                            renderItem={renderReservation}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>No hay reservas registradas</Text>
                            }
                        />

                        {selectedReservation && (
                            <View style={styles.reservationDetails}>
                                <Text style={styles.detailsTitle}>Detalles de la Reserva</Text>
                                
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

                                <View style={styles.actionSection}>
                                    <Text style={styles.actionTitle}>Cambiar Fecha</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="YYYY-MM-DD HH:MM"
                                        value={newDate}
                                        onChangeText={setNewDate}
                                    />
                                    
                                    <View style={styles.reservationActions}>
                                        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateDate}>
                                            <Text style={styles.updateButtonText}>Actualizar Fecha</Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity style={styles.cancelReservationButton} onPress={handleDeleteReservation}>
                                            <Text style={styles.cancelReservationButtonText}>Cancelar Reserva</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>

         
            {isModalVisible && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {editingRestaurant ? 'Editar Restaurante' : 'Nuevo Restaurante'}
                        </Text>

                        <TextInput
                            style={styles.modalInput}
                            placeholder="Nombre del restaurante"
                            value={formData.name}
                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                        />

                        <TextInput
                            style={styles.modalInput}
                            placeholder="Dirección"
                            value={formData.address}
                            onChangeText={(text) => setFormData({ ...formData, address: text })}
                        />

                        <TextInput
                            style={styles.modalInput}
                            placeholder="Descripción"
                            value={formData.description}
                            onChangeText={(text) => setFormData({ ...formData, description: text })}
                        />

                        <TextInput
                            style={styles.modalInput}
                            placeholder="Ciudad"
                            value={formData.city}
                            onChangeText={(text) => setFormData({ ...formData, city: text })}
                        />

                        <TextInput
                            style={styles.modalInput}
                            placeholder="URL de la foto"
                            value={formData.photo_url}
                            onChangeText={(text) => setFormData({ ...formData, photo_url: text })}
                        />

                        <View style={styles.switchContainer}>
                            <Text style={styles.switchLabel}>¿Está activo?</Text>
                            <Switch
                                value={formData.is_active}
                                onValueChange={(value) => setFormData({ ...formData, is_active: value })}
                                trackColor={{ false: '#D1D5DB', true: '#4F46E5' }}
                                thumbColor={formData.is_active ? '#fff' : '#9CA3AF'}
                            />
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.modalCancelButton} onPress={() => {
                                setIsModalVisible(false);
                                resetForm();
                            }}>
                                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalSaveButton} onPress={handleSubmit}>
                                <Text style={styles.modalSaveButtonText}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
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
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 8,
    },
    activeTab: {
        backgroundColor: '#F0F9FF',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },
    activeTabText: {
        color: '#4F46E5',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    addButton: {
        backgroundColor: '#4F46E5',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#6B7280',
        marginTop: 50,
        fontStyle: 'italic',
    },

    restaurantCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    restaurantImage: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
    restaurantContent: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    restaurantInfo: {
        flex: 1,
        paddingRight: 12,
    },
    restaurantName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    restaurantAddress: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    restaurantDescription: {
        fontSize: 13,
        color: '#9CA3AF',
        marginBottom: 4,
        fontStyle: 'italic',
    },
    restaurantCity: {
        fontSize: 12,
        color: '#6366F1',
        fontWeight: '500',
    },
    restaurantActions: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    editButton: {
        padding: 8,
    },
    deleteButton: {
        padding: 8,
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
        fontSize: 12,
        fontWeight: '600',
        color: '#4F46E5',
        backgroundColor: '#E0E7FF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    restaurantNameReservation: {
        fontSize: 14,
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
    reservationDetails: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    detailsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 16,
        textAlign: 'center',
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
        marginTop: 16,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
    },
    reservationActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 12,
    },
    updateButton: {
        flex: 1,
        backgroundColor: '#10B981',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    cancelReservationButton: {
        flex: 1,
        backgroundColor: '#EF4444',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelReservationButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: '#1F2937',
        backgroundColor: '#F9FAFB',
        marginBottom: 12,
    },
    // Estilos para modal
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        margin: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 12,
        backgroundColor: '#F9FAFB',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingVertical: 8,
    },
    switchLabel: {
        fontSize: 16,
        color: '#374151',
        fontWeight: '500',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        gap: 12,
    },
    modalCancelButton: {
        flex: 1,
        backgroundColor: '#E5E7EB',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalCancelButtonText: {
        color: '#374151',
        fontSize: 16,
        fontWeight: '600',
    },
    modalSaveButton: {
        flex: 1,
        backgroundColor: '#4F46E5',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalSaveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});