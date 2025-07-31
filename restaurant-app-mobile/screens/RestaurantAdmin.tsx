import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppContext } from '@/context/AppContext';

const RestaurantAdmin: React.FC = () => {
  const { restaurants, addRestaurant, updateRestaurant, deleteRestaurant } = useAppContext();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    photo_url: '',
    is_active: true,
  });

  const handleSubmit = () => {
    if (editingId) {
      updateRestaurant(editingId, formData);
      setEditingId(null);
    } else {
      addRestaurant(formData);
    }
    setFormData({
      name: '',
      description: '',
      address: '',
      city: '',
      photo_url: '',
      is_active: true,
    });
    setIsFormOpen(false);
  };

  const handleEdit = (restaurant: any) => {
    setFormData({
      name: restaurant.name,
      description: restaurant.description,
      address: restaurant.address,
      city: restaurant.city,
      photo_url: restaurant.photo_url,
      is_active: true,
    });
    setEditingId(restaurant.id);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      address: '',
      city: '',
      photo_url: '',
      is_active: true,
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
        'Confirmar eliminación',
        '¿Estás seguro de que deseas eliminar este restaurante?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Eliminar', onPress: () => deleteRestaurant(id), style: 'destructive' },
        ]
    );
  };

  return (
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Administrar Restaurantes</Text>
          <TouchableOpacity
              style={styles.newButton}
              onPress={() => setIsFormOpen(true)}
          >
            <Icon name="plus" size={20} color="#fff" />
            <Text style={styles.buttonText}>Nuevo Restaurante</Text>
          </TouchableOpacity>
        </View>

        {/* Restaurants List */}
        <FlatList
            data={restaurants}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.restaurantCard}>
                  <View>
                    <Text style={styles.restaurantName}>{item.name}</Text>
                    <Text style={styles.restaurantDetails}>{item.description}</Text>
                  </View>
                  <View style={styles.actions}>
                    <TouchableOpacity onPress={() => handleEdit(item)}>
                      <Icon name="pencil" size={20} color="#4CAF50" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                      <Icon name="trash-can" size={20} color="#F44336" />
                    </TouchableOpacity>
                  </View>
                </View>
            )}
        />

        {/* Form Modal */}
        <Modal visible={isFormOpen} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingId ? 'Editar Restaurante' : 'Nuevo Restaurante'}
                </Text>
                <TouchableOpacity onPress={handleCancel}>
                  <Icon name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              <ScrollView>
                {/* Form Fields */}
                <View>
                  <Text style={styles.label}>Nombre</Text>
                  <TextInput
                      style={styles.input}
                      value={formData.name}
                      onChangeText={(text) => setFormData({ ...formData, name: text })}
                  />
                  <Text style={styles.label}>Descripción</Text>
                  <TextInput
                      style={[styles.input, styles.textArea]}
                      value={formData.description}
                      onChangeText={(text) => setFormData({ ...formData, description: text })}
                      multiline
                      numberOfLines={3}
                  />
                  <Text style={styles.label}>Dirección</Text>
                  <TextInput
                      style={styles.input}
                      value={formData.address}
                      onChangeText={(text) => setFormData({ ...formData, address: text })}
                  />
                  <Text style={styles.label}>Ciudad</Text>
                  <TextInput
                      style={styles.input}
                      value={formData.city}
                      onChangeText={(text) => setFormData({ ...formData, city: text })}
                  />
                  <Text style={styles.label}>URL de Foto</Text>
                  <TextInput
                      style={styles.input}
                      value={formData.photo_url}
                      onChangeText={(text) => setFormData({ ...formData, photo_url: text })}
                  />
                </View>
                {/* Action Buttons */}
                <View style={styles.formActions}>
                  <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                    <Text style={styles.saveButtonText}>Guardar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  newButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
  },
  restaurantCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  restaurantDetails: {
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 8,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    marginBottom: 8,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  textArea: {
    height: 80,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#F44336',
    padding: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default RestaurantAdmin;