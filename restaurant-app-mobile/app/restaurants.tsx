import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    Alert,
    Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAppContext } from '@/context/AppContext';
import { Restaurant } from '@/types';

export default function Restaurants() {
    const router = useRouter();
    const { restaurants, loadRestaurants } = useAppContext();

    const [searchFilters, setSearchFilters] = useState({
        city: '',
        letter: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const filters: { city?: string; letter?: string } = {};
            if (searchFilters.city.trim()) filters.city = searchFilters.city.trim();
            if (searchFilters.letter.trim()) filters.letter = searchFilters.letter.trim();
            
            await loadRestaurants(Object.keys(filters).length > 0 ? filters : undefined);
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar los restaurantes');
        } finally {
            setIsLoading(false);
        }
    };

    const clearFilters = async () => {
        setSearchFilters({ city: '', letter: '' });
        setIsLoading(true);
        try {
            await loadRestaurants();
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar los restaurantes');
        } finally {
            setIsLoading(false);
        }
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
                    <View style={styles.statusContainer}>
                        <Text style={[styles.statusText, item.is_active ? styles.statusActive : styles.statusInactive]}>
                            {item.is_active ? 'Abierto' : 'Cerrado'}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>Restaurantes</Text>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.filtersContainer}>
                <Text style={styles.filtersTitle}>Buscar Restaurantes</Text>
                
                <View style={styles.filterRow}>
                    <TextInput
                        style={[styles.input, styles.filterInput]}
                        placeholder="Buscar por ciudad"
                        value={searchFilters.city}
                        onChangeText={(text) => setSearchFilters({ ...searchFilters, city: text })}
                    />
                    <TextInput
                        style={[styles.input, styles.filterInput]}
                        placeholder="Letra inicial"
                        value={searchFilters.letter}
                        onChangeText={(text) => setSearchFilters({ ...searchFilters, letter: text.charAt(0).toUpperCase() })}
                        maxLength={1}
                    />
                </View>

                <View style={styles.filterActions}>
                    <TouchableOpacity 
                        style={styles.searchButton}
                        onPress={handleSearch}
                        disabled={isLoading}
                    >
                        <Text style={styles.searchButtonText}>
                            {isLoading ? 'Buscando...' : 'Buscar'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.clearButton}
                        onPress={clearFilters}
                        disabled={isLoading}
                    >
                        <Text style={styles.clearButtonText}>Limpiar</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={restaurants}
                renderItem={renderRestaurant}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        {isLoading ? 'Cargando...' : 'No hay restaurantes que coincidan con la búsqueda'}
                    </Text>
                }
            />
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
    filtersContainer: {
        backgroundColor: '#fff',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    filtersTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 16,
        textAlign: 'center',
    },
    filterRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    filterInput: {
        flex: 1,
    },
    filterActions: {
        flexDirection: 'row',
        gap: 12,
    },
    searchButton: {
        flex: 1,
        backgroundColor: '#4F46E5',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    clearButton: {
        flex: 1,
        backgroundColor: '#E5E7EB',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    clearButtonText: {
        color: '#374151',
        fontSize: 16,
        fontWeight: '600',
    },
    listContainer: {
        padding: 16,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginTop: 50,
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
    statusContainer: {
        marginTop: 8,
        alignSelf: 'flex-start',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusActive: {
        backgroundColor: '#D1FAE5',
        color: '#059669',
    },
    statusInactive: {
        backgroundColor: '#FEE2E2',
        color: '#DC2626',
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 12,
        backgroundColor: '#F9FAFB',
    },
    restaurantImage: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
    },
});