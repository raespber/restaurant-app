import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Calendar, Users, MapPin } from 'lucide-react';
import { createReservation } from '../services/reservations/reservationService';
import toast from 'react-hot-toast';


const ReservationForm: React.FC = () => {
  const { restaurants } = useAppContext();
  const [formData, setFormData] = useState({
    restaurantId: '',
    customerName: '',
    customerEmail: '',
    customerDni: '',
    date: '',
    time: '',
    guests: 2
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedRestaurant = restaurants.find(r => r.id === formData.restaurantId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      toast.success(`Tu número de reserva es ${code}, debes presentarlo junto con tu DNI`);
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
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Error al crear la reserva');
    }

    setIsSubmitting(false);
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-green-900 mb-2">¡Reserva Confirmada!</h2>
          <p className="text-green-700 mb-4">
            Tu reserva ha sido registrada exitosamente. Recibirás un email de confirmación.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Hacer otra reserva
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Reservar Mesa</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Restaurant Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline h-4 w-4 mr-1" />
            Seleccionar Restaurante
          </label>
          <select
            required
            value={formData.restaurantId}
            onChange={(e) => setFormData({ ...formData, restaurantId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Elige un restaurante</option>
            {restaurants.map(restaurant => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name} - {restaurant.city}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Restaurant Preview */}
        {selectedRestaurant && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex space-x-4">
              <img
                src={selectedRestaurant.photo_url}
                alt={selectedRestaurant.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{selectedRestaurant.name}</h3>
                <p className="text-gray-600 text-sm">{selectedRestaurant.description}</p>
                <p className="text-gray-500 text-sm">{selectedRestaurant.address}</p>
              </div>
            </div>
          </div>
        )}

        {/* Customer Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              required
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.customerEmail}
              onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Reservation Details */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="inline h-4 w-4 mr-1" />
              Fecha
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DNI
            </label>
            <input
                type="text"
                required
                value={formData.customerDni}
                onChange={(e) => setFormData({ ...formData, customerDni: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Users className="inline h-4 w-4 mr-1" />
              Comensales
            </label>
            <select
              value={formData.guests}
              onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'persona' : 'personas'}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Procesando reserva...' : 'Confirmar Reserva'}
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;