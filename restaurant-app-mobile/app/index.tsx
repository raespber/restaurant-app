import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface NavigationItem {
    name: string;
    route: string;
    icon: "home" | "settings" | "users" | "calendar" | "bookmark";
}

const navigationItems: NavigationItem[] = [
    { name: 'Inicio', route: '/', icon: 'home' },
    { name: 'Administrar', route: '/admin', icon: 'settings' },
    { name: 'Restaurantes', route: '/restaurants', icon: 'users' },
    { name: 'Reservar', route: '/reserve', icon: 'calendar' },
    { name: 'Mis Reservas', route: '/reservations', icon: 'bookmark' },
];

const TabBar: React.FC = () => {
    const router = useRouter();
    return (
        <View style={styles.navbar}>
            {navigationItems.map((item) => (
                <TouchableOpacity
                    key={item.name}
                    style={styles.navItem}
                    onPress={() => router.push(item.route as any)}
                >
                    <Feather name={item.icon} size={24} color="#4F46E5" />
                    <Text style={styles.navText}>{item.name}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default function Index() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>

            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Icon name="account-group" size={32} color="#4F46E5" />
                    <Text style={styles.logoText}>RestauReserva</Text>
                </View>
                <View style={styles.headerLinks}>
                    <TouchableOpacity onPress={() => router.push('/restaurants' as any)}>
                        <Text style={styles.link}>Restaurantes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/reserve' as any)}>
                        <Text style={styles.link}>Reservar</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.heroSection}>
                <Text style={styles.heroTitle}>
                    Reserva tu mesa perfecta
                    <Text style={styles.heroHighlight}> en los mejores restaurantes</Text>
                </Text>
                <Text style={styles.heroDescription}>
                    Descubre una experiencia gastronómica única. Reserva fácilmente en restaurantes
                    cuidadosamente seleccionados y disfruta de momentos inolvidables.
                </Text>
                <View style={styles.heroActions}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => router.push('/reserve' as any)}
                    >
                        <Icon name="calendar" size={20} color="#fff" />
                        <Text style={styles.primaryButtonText}>Reservar Mesa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => router.push('/admin' as any)}
                    >
                        <Icon name="account-group" size={20} color="#4F46E5" />
                        <Text style={styles.secondaryButtonText}>Panel de Administración</Text>
                    </TouchableOpacity>
                </View>
            </View>
        
            <View style={styles.featuresSection}>
                <Text style={styles.sectionTitle}>¿Por qué elegir RestauReserva?</Text>
                <View style={styles.featuresGrid}>
                    <View style={styles.featureItem}>
                        <Icon name="clock-outline" size={32} color="#4F46E5" />
                        <Text style={styles.featureTitle}>Reservas Instantáneas</Text>
                        <Text style={styles.featureDescription}>
                            Confirma tu mesa al instante, sin esperas ni llamadas
                        </Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Icon name="star-outline" size={32} color="#4F46E5" />
                        <Text style={styles.featureTitle}>Restaurantes Selectos</Text>
                        <Text style={styles.featureDescription}>
                            Accede a los mejores restaurantes de la ciudad
                        </Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Icon name="account-check-outline" size={32} color="#4F46E5" />
                        <Text style={styles.featureTitle}>Gestión Sencilla</Text>
                        <Text style={styles.featureDescription}>
                            Administra tus reservas desde una sola aplicación
                        </Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Icon name="message-text-outline" size={32} color="#4F46E5" />
                        <Text style={styles.featureTitle}>Reseñas Verificadas</Text>
                        <Text style={styles.featureDescription}>
                            Consulta opiniones verificadas de otros comensales
                        </Text>
                    </View>
                </View>
            </View>
            </ScrollView>
            <TabBar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    content: {
        flex: 1,
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
    header: {
        backgroundColor: '#4F46E5',
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 8,
    },
    headerLinks: {
        flexDirection: 'row',
        gap: 16,
    },
    link: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    heroSection: {
        padding: 32,
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#1F2937',
        marginBottom: 16,
    },
    heroHighlight: {
        color: '#4F46E5',
    },
    heroDescription: {
        fontSize: 16,
        textAlign: 'center',
        color: '#6B7280',
        marginBottom: 32,
        lineHeight: 24,
    },
    heroActions: {
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    primaryButton: {
        backgroundColor: '#4F46E5',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#4F46E5',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    secondaryButtonText: {
        color: '#4F46E5',
        fontSize: 16,
        fontWeight: '600',
    },
    featuresSection: {
        padding: 32,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#1F2937',
        marginBottom: 32,
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16,
    },
    featureItem: {
        width: '48%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginTop: 12,
        marginBottom: 8,
        textAlign: 'center',
    },
    featureDescription: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 4,
    },
});