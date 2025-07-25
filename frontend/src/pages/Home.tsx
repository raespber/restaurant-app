import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Star, MapPin, Clock, Award } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">RestauReserva</span>
            </div>
            <div className="flex space-x-4">
              <Link 
                to="/restaurants" 
                className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
              >
                Restaurantes
              </Link>
              <Link 
                to="/reserve" 
                className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
              >
                Reservar
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Reserva tu mesa perfecta
              <span className="block text-indigo-600">en los mejores restaurantes</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Descubre una experiencia gastronómica única. Reserva fácilmente en restaurantes 
              cuidadosamente seleccionados y disfruta de momentos inolvidables.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/reserve"
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Calendar className="inline-block w-5 h-5 mr-2" />
                Reservar Mesa
              </Link>
              <Link
                to="/admin"
                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Users className="inline-block w-5 h-5 mr-2" />
                Panel de Administración
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir RestauReserva?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              La plataforma más completa para gestionar y reservar en restaurantes
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reservas Instantáneas</h3>
              <p className="text-gray-600">
                Confirma tu reserva al instante sin esperas ni llamadas telefónicas
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Restaurantes Selectos</h3>
              <p className="text-gray-600">
                Accede a una cuidada selección de los mejores restaurantes de tu ciudad
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Búsqueda Inteligente</h3>
              <p className="text-gray-600">
                Encuentra restaurantes por ubicación, tipo de cocina y disponibilidad
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="h-16 w-16 text-indigo-200 mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            ¿Tienes un restaurante?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Únete a nuestra plataforma y gestiona las reservas de tu restaurante de manera eficiente
          </p>
          <Link
            to="/admin"
            className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg inline-flex items-center"
          >
            <Users className="w-5 h-5 mr-2" />
            Administrar Restaurante
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Users className="h-8 w-8 text-indigo-400" />
              <span className="text-2xl font-bold">RestauReserva</span>
            </div>
            <p className="text-gray-400 mb-6">
              La mejor plataforma para reservas gastronómicas
            </p>
            <div className="flex justify-center space-x-6">
              <Link to="/restaurants" className="text-gray-400 hover:text-white transition-colors">
                Restaurantes
              </Link>
              <Link to="/reserve" className="text-gray-400 hover:text-white transition-colors">
                Reservar
              </Link>
              <Link to="/admin" className="text-gray-400 hover:text-white transition-colors">
                Administración
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;