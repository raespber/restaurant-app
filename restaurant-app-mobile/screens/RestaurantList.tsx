import React, { useState, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const RestaurantList = () => {
    const { restaurants } = useAppContext();
    const [searchLetter, setSearchLetter] = useState('');
    const [filterCity, setFilterCity] = useState('');
    const cities = useMemo(() => {
        const uniqueCities = [...new Set(restaurants.map(r => r.city))];
        return uniqueCities.sort();
    }, [restaurants]);

    const filteredRestaurants = useMemo(() => {
        return restaurants.filter(restaurant => {
            const matchesLetter = !searchLetter ||
                restaurant.name.toLowerCase().startsWith(searchLetter.toLowerCase());
            const matchesCity = !filterCity || restaurant.city === filterCity;
            return matchesLetter && matchesCity;
        });
    }, [restaurants, searchLetter, filterCity]);

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    return (
        <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Restaurantes</Text>

    {/* Filters */}
    <View style={styles.filters}>
        {/* Letter Filter */}
        <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>
                <Icon name="magnify" size={18} color="#fff" /> Filtrar por letra inicial
            </Text>

            <View style={styles.letterButtons}>
    <TouchableOpacity
        style={[styles.letterButton, !searchLetter && styles.activeButton]}
    onPress={() => setSearchLetter('')}
>
    <Text style={styles.letterButtonText}>Todas</Text>
        </TouchableOpacity>
                {alphabet.map(letter => (
                    <TouchableOpacity
                        key={letter}
                        style={[
                            styles.letterButton,
                            searchLetter === letter && styles.activeButton,
                        ]}
                        onPress={() => setSearchLetter(letter)}
                    >
                        <Text
                            style={[
                                styles.letterButtonText,
                                searchLetter === letter && styles.activeLetterText,
                            ]}
                        >
                            {letter}
                        </Text>
                    </TouchableOpacity>
                ))}

            </View>
    </View>
    {/* City Filter */}
    <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>
            <Icon name="filter-variant" size={18} color="#fff" /> Filtrar por ciudad
        </Text>
    <Dropdown
    style={styles.dropdown}
    data={cities.map(city => ({ label: city, value: city }))}
    search
    maxHeight={300}
    labelField="label"
    valueField="value"
    placeholderStyle={styles.placeholderStyle}
    selectedTextStyle={styles.selectedTextStyle}
    inputSearchStyle={styles.inputSearchStyle}
    iconStyle={styles.iconStyle}
    value={filterCity}
    onChange={item => {
        setFilterCity(item.value);
    }}
    placeholder="Todas las ciudades"
        />
        </View>
        </View>

    {/* Results Count */}
    <Text style={styles.resultsCount}>
        Mostrando {filteredRestaurants.length} de {restaurants.length} restaurantes
    </Text>

    {/* Restaurants Grid */}
    <FlatList
        data={filteredRestaurants}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
        <View style={styles.restaurant}>
        <Image source={{ uri: item.photo_url }} style={styles.restaurantImage} />
    <View style={styles.restaurantInfo}>
    <Text style={styles.restaurantName}>{item.name}</Text>
        <Text style={styles.restaurantDescription}>{item.description}</Text>
        <View style={styles.restaurantLocation}>
    <Text style={styles.locationText}>{item.address}</Text>
        </View>
        <Text style={styles.restaurantCity}>{item.city}</Text>
        </View>
        </View>
)}
    numColumns={2}
    />
            {filteredRestaurants.length === 0 && (
                <Text style={styles.noResults}>No se encontraron restaurantes.</Text>
            )}
    </ScrollView>
);
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#1c1c1e',
        flexGrow: 1,
    },
    title: {
        fontSize: 24,
        color: '#ffffff',
        fontWeight: 'bold',
        marginBottom: 16,
    },
    filters: {
        marginBottom: 16,
    },
    filterRow: {
        marginBottom: 12,
    },
    filterLabel: {
        color: '#ffffff',
        fontSize: 16,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    letterButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    letterButton: {
        backgroundColor: '#2c2c2e',
        padding: 8,
        margin: 4,
        borderRadius: 4,
    },
    activeButton: {
        backgroundColor: '#007AFF',
    },
    letterButtonText: {
        color: '#ffffff',
    },
    dropdown: {
        height: 50,
        backgroundColor: '#2c2c2e',
        borderRadius: 4,
        paddingHorizontal: 8,
    },
    placeholderStyle: {
        color: '#888',
    },
    selectedTextStyle: {
        color: '#ffffff',
    },
    inputSearchStyle: {
        color: '#ffffff',
    },
    iconStyle: {
        tintColor: '#ffffff',
    },
    resultsCount: {
        color: '#ffffff',
        fontSize: 14,
        marginBottom: 10,
    },
    noResults: {
        color: '#aaa',
        textAlign: 'center',
        marginTop: 20,
    },
    restaurant: {
        flex: 1,
        margin: 8,
        backgroundColor: '#2c2c2e',
        borderRadius: 8,
        overflow: 'hidden',
    },
    restaurantImage: {
        height: 120,
        width: '100%',
    },
    restaurantInfo: {
        padding: 10,
    },
    restaurantName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    restaurantDescription: {
        fontSize: 12,
        color: '#cccccc',
        marginBottom: 4,
    },
    restaurantLocation: {
        marginBottom: 4,
    },
    locationText: {
        color: '#aaaaaa',
    },
    restaurantCity: {
        fontSize: 12,
        color: '#888',
    },
    activeLetterText: {
        fontWeight: 'bold',
        color: '#fff',
    },
});


export default RestaurantList;
