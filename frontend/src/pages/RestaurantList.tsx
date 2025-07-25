import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { MapPin, Search, Filter } from 'lucide-react';

const RestaurantList: React.FC = () => {
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Restaurantes</h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Letter Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Search className="inline h-4 w-4 mr-1" />
              Filtrar por letra inicial
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSearchLetter('')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  !searchLetter 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              {alphabet.map(letter => (
                <button
                  key={letter}
                  onClick={() => setSearchLetter(letter)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    searchLetter === letter 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          {/* City Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Filter className="inline h-4 w-4 mr-1" />
              Filtrar por ciudad
            </label>
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Todas las ciudades</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-gray-600">
        Mostrando {filteredRestaurants.length} de {restaurants.length} restaurantes
      </div>

      {/* Restaurants Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <div key={restaurant.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src={restaurant.photo_url}
              alt={restaurant.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{restaurant.name}</h3>
              <p className="text-gray-600 mb-3">{restaurant.description}</p>
              <div className="flex items-center text-gray-500 text-sm mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{restaurant.address}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
                  {restaurant.city}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRestaurants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No se encontraron restaurantes con los filtros aplicados
          </p>
          <button
            onClick={() => {
              setSearchLetter('');
              setFilterCity('');
            }}
            className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default RestaurantList;