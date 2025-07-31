import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { RootStackParamList } from '@/types/navigation';

interface NavigationItem {
    name: string;
    route: keyof RootStackParamList;
    icon: "home" | "settings" | "users" | "calendar" | "bookmark";
}

const navigationItems: NavigationItem[] = [
    { name: 'Inicio', route: 'Home', icon: 'home' },
    { name: 'Administrar', route: 'Admin', icon: 'settings' },
    { name: 'Restaurantes', route: 'Restaurants', icon: 'users' },
    { name: 'Reservar', route: 'Reserve', icon: 'calendar' },
    { name: 'Mis Reservas', route: 'Reservations', icon: 'bookmark' },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <View style={styles.container}>
            {/* Contenido principal */}
            <View style={styles.content}>{children}</View>

            {/* Barra de navegación */}
            <View style={styles.navbar}>
                {navigationItems.map((item) => (
                    <TouchableOpacity
                        key={item.name}
                        style={styles.navItem}
                        onPress={() => navigation.navigate(item.route)}
                    >
                        <Feather name={item.icon} size={24} color="#4F46E5" />
                        <Text style={styles.navText}>{item.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default Layout;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    content: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 60,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#ffffff',
    },
    navItem: {
        alignItems: 'center',
    },
    navText: {
        fontSize: 12,
        color: '#4F46E5',
        marginTop: 4,
    },
});