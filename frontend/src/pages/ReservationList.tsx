import { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Calendar, Trash2, Pencil } from 'lucide-react';

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
    if (confirm('¿Estás seguro de eliminar esta reserva?')) {
      await deleteReservation(id);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Todas las Reservas</h1>

      {reservations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay reservas</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {reservation.customer_name} - {reservation.date}
                  </h3>
                  <p className="text-sm text-gray-600">Email: {reservation.customer_email}</p>
                  <p className="text-sm text-gray-600">DNI: {reservation.customer_dni}</p>
                  <p className="text-sm text-gray-600">Código: {reservation.code}</p>
                  <p className="text-sm text-gray-600">Restaurante ID: {reservation.restaurant_id}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingId(reservation.id)}
                    className="text-blue-500 hover:underline"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(reservation.id)}
                    className="text-red-500 hover:underline"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {editingId === reservation.id && (
                <div className="mt-3 flex items-center space-x-2">
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="border px-2 py-1 rounded"
                  />
                  <button
                    onClick={() => handleUpdateDate(reservation.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-500 hover:underline"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationList;