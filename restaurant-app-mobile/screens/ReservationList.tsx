import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppContext } from '@/context/AppContext';

const ReservationList: React.FC = () => {
  const {
    reservations,
    getReservationsByRestaurantAndDate,
    updateReservationDate,
    deleteReservation,
  } = useAppContext();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState<string>('');

  useEffect(() => {
    getReservationsByRestaurantAndDate();
  }, []);

  const handleUpdateDate = async (id: string) => {
    if (newDate) {
      await updateReservationDate(id, newDate);
      setEditingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
        'Confirmar eliminación',
        '¿Estás seguro de eliminar esta reserva?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Eliminar', onPress: () => deleteReservation(id), style: 'destructive' },
        ]
    );
  };

  const renderReservation = ({ item }: { item: any }) => (
      <View style={styles.reservationCard}>
        <View style={styles.reservationHeader}>
          <View>
            <Text style={styles.reservationTitle}>
              {item.customer_name} - {item.date}
            </Text>
            <Text style={styles.reservationText}>Email: {item.customer_email}</Text>
            <Text style={styles.reservationText}>DNI: {item.customer_dni}</Text>
            <Text style={styles.reservationText}>Código: {item.code}</Text>
            <Text style={styles.reservationText}>Restaurante ID: {item.restaurant_id}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => setEditingId(item.id)}>
              <Icon name="pencil" size={20} color="#4F46E5" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Icon name="trash-can" size={20} color="#F43F5E" />
            </TouchableOpacity>
          </View>
        </View>

        {editingId === item.id && (
            <View style={styles.editSection}>
              <TextInput
                  style={styles.dateInput}
                  placeholder="YYYY-MM-DD"
                  value={newDate}
                  onChangeText={(text) => setNewDate(text)}
              />
              <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => handleUpdateDate(item.id)}
              >
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  onPress={() => setEditingId(null)}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
        )}
      </View>
  );

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Todas las Reservas</Text>

        {reservations.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="calendar" size={64} color="#D1D5DB" />
              <Text style={styles.emptyStateTitle}>No hay reservas</Text>
            </View>
        ) : (
            <FlatList
                data={reservations}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderReservation}
                contentContainerStyle={styles.list}
            />
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F3F4F6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 64,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
    marginTop: 16,
  },
  list: {
    paddingBottom: 16,
  },
  reservationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reservationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  reservationText: {
    fontSize: 14,
    color: '#6B7280',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  editSection: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    color: '#111827',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelText: {
    color: '#F43F5E',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ReservationList;