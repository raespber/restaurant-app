import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';
import { useNavigation } from '@react-navigation/native';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const Home: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Icon name="account-group" size={32} color="#4F46E5" />
            <Text style={styles.logoText}>RestauReserva</Text>
          </View>
          <View style={styles.headerLinks}>
            <TouchableOpacity onPress={() => navigation.navigate('Restaurants')}>
              <Text style={styles.link}>Restaurantes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Reserve')}>
              <Text style={styles.link}>Reservar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Section */}
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
                onPress={() => navigation.navigate('Reserve')}
            >
              <Icon name="calendar" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Reservar Mesa</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('Admin')}
            >
              <Icon name="account-group" size={20} color="#4F46E5" />
              <Text style={styles.secondaryButtonText}>Panel de Administración</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>¿Por qué elegir RestauReserva?</Text>
          <Text style={styles.featuresSubtitle}>
            La plataforma más completa para gestionar y reservar en restaurantes
          </Text>
          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Icon name="clock-outline" size={32} color="#4F46E5" />
              </View>
              <Text style={styles.featureTitle}>Reservas Instantáneas</Text>
              <Text style={styles.featureDescription}>
                Confirma tu reserva al instante sin esperas ni llamadas telefónicas
              </Text>
            </View>
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Icon name="star" size={32} color="#4F46E5" />
              </View>
              <Text style={styles.featureTitle}>Los Mejores Restaurantes</Text>
              <Text style={styles.featureDescription}>
                Acceso a una selección de los mejores restaurantes locales
              </Text>
            </View>
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Icon name="map-marker" size={32} color="#4F46E5" />
              </View>
              <Text style={styles.featureTitle}>Fácil Ubicación</Text>
              <Text style={styles.featureDescription}>
                Encuentra restaurantes cerca de ti con facilidad
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  headerLinks: {
    flexDirection: 'row',
    gap: 16,
  },
  link: {
    fontSize: 16,
    color: '#4B5563',
    fontWeight: '500',
  },
  heroSection: {
    padding: 16,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroHighlight: {
    color: '#4F46E5',
  },
  heroDescription: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 16,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 8,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  featuresSection: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  featuresTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  featuresSubtitle: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    backgroundColor: '#E0E7FF',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
  },
});

export default Home;