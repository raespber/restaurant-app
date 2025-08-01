import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Reserve() {
    const router = useRouter();
    const { restaurants, createReservation } = useAppContext();

    const [formData, setFormData] = useState({
        restaurant_id: '',
        customer_name: '',
        customer_email: '',
        customer_dni: '',
        date: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            setFormData({ ...formData, date: formattedDate });
        }
    };

    const handleSubmit = async () => {
        if (!formData.restaurant_id || !formData.customer_name || !formData.customer_email || !formData.customer_dni || !formData.date) {
            Alert.alert('Error', 'Todos los campos son obligatorios');
            return;
        }

        setIsLoading(true);

        try {
            const response = await createReservation(formData);
            
            console.log('Respuesta completa:', response.data);
            
            Alert.alert(
                'Reserva exitosa',
                `Tu reserva ha sido confirmada.\nCódigo de reserva: ${response.data.code}`,
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            setFormData({
                                restaurant_id: '',
                                customer_name: '',
                                customer_email: '',
                                customer_dni: '',
                                date: '',
                            });
                        }
                    }
                ]
            );
        } catch (error: any) {
            console.log('Error completo:', error); 
            let errorMessage = 'No se pudo crear la reserva. Intenta nuevamente.';
            
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            Alert.alert('Error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const AnyPicker = Picker as any;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>Reservar Mesa</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.pageTitle}>Nueva Reserva</Text>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Restaurante</Text>
                    <View style={styles.pickerContainer}>
                        <AnyPicker
                            selectedValue={formData.restaurant_id}
                            onValueChange={(value: string) => setFormData({ ...formData, restaurant_id: value })}
                            style={styles.picker}
                        >
                            <Picker.Item label="Seleccionar restaurante" value="" />
                            {restaurants.map((restaurant) => (
                                <Picker.Item
                                    key={restaurant.id}
                                    label={`${restaurant.name} - ${restaurant.address}`}
                                    value={restaurant.id}
                                />
                            ))}
                        </AnyPicker>
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Nombre completo</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Tu nombre completo"
                        value={formData.customer_name}
                        onChangeText={(text) => setFormData({ ...formData, customer_name: text })}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="tu@email.com"
                        value={formData.customer_email}
                        onChangeText={(text) => setFormData({ ...formData, customer_email: text })}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>DNI</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="12345678"
                        value={formData.customer_dni}
                        onChangeText={(text) => setFormData({ ...formData, customer_dni: text })}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Fecha</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                        <Text style={{ color: formData.date ? '#000' : '#9CA3AF' }}>
                            {formData.date || 'Seleccionar fecha'}
                        </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={formData.date ? new Date(formData.date) : new Date()}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}
                </View>


                <TouchableOpacity
                    style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={isLoading}
                >
                    <Text style={styles.submitButtonText}>
                        {isLoading ? 'Creando reserva...' : 'Confirmar Reserva'}
                    </Text>
                </TouchableOpacity>
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
    formGroup: {
        marginBottom: 20,
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
        backgroundColor: '#fff',
        color: '#1F2937',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    picker: {
        height: 50,
    },
    helper: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
    submitButton: {
        backgroundColor: '#4F46E5',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    submitButtonDisabled: {
        backgroundColor: '#9CA3AF',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});