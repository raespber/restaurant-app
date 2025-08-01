import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    ScrollView,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import {
    getReservationsByRestaurantAndDate,
} from '@/services/reservations/reservationService';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AdminPanel() {
    const router = useRouter();
    const { restaurants } = useAppContext();
    const [restaurantId, setRestaurantId] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [reservations, setReservations] = useState([]);

    const handleSearch = async () => {
        if (!restaurantId) return;
        const data = await getReservationsByRestaurantAndDate();
        setReservations(data);
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const renderReservation = ({ item }: { item: any }) => (
        <View style={styles.reservationRow}>
            <Text style={[styles.cell, styles.name]}>{item.customer_name}</Text>
            <Text style={styles.cell}>{item.customer_email}</Text>
            <Text style={styles.cell}>{item.customer_dni}</Text>
            <Text style={styles.cell}>{item.date}</Text>
            <Text style={[styles.cell, styles.code]}>{item.code}</Text>
        </View>
    );

    const AnyPicker = Picker as any;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Panel Completo</Text>
                <View style={styles.placeholder} />
            </View>
            
            <ScrollView style={styles.content}>
                <Text style={styles.title}>Panel de Reservas</Text>

            <View style={styles.filters}>
                <View style={styles.filterGroup}>
                    <Text style={styles.label}>Seleccionar Restaurante</Text>
                    <AnyPicker
                        selectedValue={restaurantId}
                        onValueChange={(value: string) => setRestaurantId(value)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Seleccionar restaurante" value="" />
                        {restaurants.map((restaurant) => (
                            <Picker.Item
                                key={restaurant.id}
                                label={`${restaurant.name} - ${restaurant.city}`}
                                value={restaurant.id}
                            />
                        ))}
                    </AnyPicker>
                </View>

                <View style={styles.filterGroup}>
                    <Text style={styles.label}>Seleccionar Fecha</Text>
                    <TouchableOpacity 
                        style={styles.dateButton}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text style={styles.dateButtonText}>{formatDate(date)}</Text>
                        <Feather name="calendar" size={20} color="#4F46E5" />
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                        />
                    )}
                </View>

                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={handleSearch}
                >
                    <Text style={styles.searchButtonText}>Buscar</Text>
                </TouchableOpacity>
            </View>
                    
            {reservations.length > 0 ? (
                <FlatList
                    data={reservations}
                    renderItem={renderReservation}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.table}
                />
            ) : (
                <Text style={styles.noReservationsText}>
                    No hay reservas para ese día.
                </Text>
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
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    placeholder: {
        width: 24,
    },
    content: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F3F4F6',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 16,
    },
    filters: {
        marginBottom: 16,
    },
    filterGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 8,
    },
    picker: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: '#1F2937',
    },
    dateButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#fff',
    },
    dateButtonText: {
        fontSize: 14,
        color: '#1F2937',
    },
    searchButton: {
        backgroundColor: '#4F46E5',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    searchButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    noReservationsText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#4B5563',
        marginTop: 16,
    },
    table: {
        marginTop: 16,
    },
    reservationRow: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cell: {
        flex: 1,
        fontSize: 14,
        color: '#1F2937',
    },
    name: {
        fontWeight: 'bold',
    },
    code: {
        fontFamily: 'monospace',
    },
});