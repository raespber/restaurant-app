import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppContext } from '@/context/AppContext';
import { createReservation } from '@/services/reservations/reservationService';

const ReservationForm: React.FC = () => {
  const { restaurants } = useAppContext();
  const [formData, setFormData] = useState<{
    restaurantId: string;
    customerName: string;
    customerEmail: string;
    customerDni: string;
    date: string;
    time: string;
    guests: number;
  }>({
    restaurantId: '',
    customerName: '',
    customerEmail: '',
    customerDni: '',
    date: '',
    time: '',
    guests: 2,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedRestaurant = restaurants.find((r) => r.id === formData.restaurantId);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const payload = {
      restaurant_id: formData.restaurantId,
      customer_name: formData.customerName,
      customer_email: formData.customerEmail,
      customer_dni: formData.customerDni,
      date: formData.date,
    };

    try {
      const res = await createReservation(payload);
      const code = res.data.code;
      Alert.alert(
          '¡Reserva Confirmada!',
          `Tu número de reserva es ${code}, debes presentarlo junto con tu DNI`
      );
      setIsSuccess(true);
      setFormData({
        restaurantId: '',
        customerName: '',
        customerEmail: '',
        customerDni: '',
        date: '',
        time: '',
        guests: 2,
      });
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.error || 'Error al crear la reserva');
    }

    setIsSubmitting(false);
  };

  if (isSuccess) {
    return (
        <View style={styles.successContainer}>
          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <Icon name="calendar-check" size={40} color="#10B981" />
            </View>
            <Text style={styles.successTitle}>¡Reserva Confirmada!</Text>
            <Text style={styles.successDescription}>
              Tu reserva ha sido registrada exitosamente. Recibirás un email de confirmación.
            </Text>
            <TouchableOpacity
                style={styles.successButton}
                onPress={() => setIsSuccess(false)}
            >
              <Text style={styles.successButtonText}>Hacer otra reserva</Text>
            </TouchableOpacity>
          </View>
        </View>
    );
  }

  const AnyPicker = Picker as any;

  return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Reservar Mesa</Text>

          {/* Formulario */}
          <View style={styles.form}>
            {/* Selección de Restaurante */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                <Icon name="map-marker-outline" size={16} color="#4B5563" /> Seleccionar Restaurante
              </Text>
              <View style={styles.pickerWrapper}>
                <AnyPicker
                    selectedValue={formData.restaurantId}
                    onValueChange={(value: string) =>
                        setFormData({ ...formData, restaurantId: value })
                    }
                >
                  <Picker.Item label="Elige un restaurante" value="" />
                  {restaurants.map((restaurant) => (
                      <Picker.Item
                          key={restaurant.id}
                          label={`${restaurant.name} - ${restaurant.city}`}
                          value={restaurant.id}
                      />
                  ))}
                </AnyPicker>
              </View>
            </View>

            {/* Vista Previa del Restaurante Seleccionado */}
            {selectedRestaurant && (
                <View style={styles.previewCard}>
                  <Image
                      source={{ uri: selectedRestaurant.photo_url }}
                      style={styles.previewImage}
                  />
                  <View style={styles.previewContent}>
                    <Text style={styles.previewTitle}>{selectedRestaurant.name}</Text>
                    <Text style={styles.previewSubtitle}>{selectedRestaurant.city}</Text>
                  </View>
                </View>
            )}

            {/* Detalles del Cliente */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                <Icon name="account-outline" size={16} color="#4B5563" /> Nombre Completo
              </Text>
              <TextInput
                  style={styles.input}
                  value={formData.customerName}
                  onChangeText={(text) => setFormData({ ...formData, customerName: text })}
                  placeholder="Ingresa tu nombre"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                <Icon name="email-outline" size={16} color="#4B5563" /> Correo Electrónico
              </Text>
              <TextInput
                  style={styles.input}
                  value={formData.customerEmail}
                  onChangeText={(text) => setFormData({ ...formData, customerEmail: text })}
                  placeholder="Ingresa tu correo"
                  keyboardType="email-address"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                <Icon name="card-account-details-outline" size={16} color="#4B5563" /> DNI
              </Text>
              <TextInput
                  style={styles.input}
                  value={formData.customerDni}
                  onChangeText={(text) => setFormData({ ...formData, customerDni: text })}
                  placeholder="Ingresa tu DNI"
                  keyboardType="numeric"
              />
            </View>

            {/* Fecha */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                <Icon name="calendar-outline" size={16} color="#4B5563" /> Fecha
              </Text>
              <TextInput
                  style={styles.input}
                  value={formData.date}
                  onChangeText={(text) => setFormData({ ...formData, date: text })}
                  placeholder="YYYY-MM-DD"
              />
            </View>

            {/* Botón de Envío */}
            <TouchableOpacity
                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Enviando...' : 'Reservar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
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
  form: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
  },
  previewCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  previewImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  previewContent: {
    marginLeft: 12,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  previewSubtitle: {
    fontSize: 14,
    color: '#4B5563',
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCard: {
    backgroundColor: '#D1FAE5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#065F46',
    marginBottom: 8,
  },
  successDescription: {
    fontSize: 14,
    color: '#065F46',
    textAlign: 'center',
    marginBottom: 16,
  },
  successButton: {
    backgroundColor: '#065F46',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  successButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default ReservationForm;