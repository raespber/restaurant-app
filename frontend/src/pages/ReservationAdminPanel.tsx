import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import {
    getReservationsByRestaurantAndDate
} from '../services/reservations/reservationService';

const ReservationAdminPanel: React.FC = () => {
    const { restaurants } = useAppContext();
    const [restaurantId, setRestaurantId] = useState('');
    const [date, setDate] = useState('');
    const [reservations, setReservations] = useState([]);

    const handleSearch = async () => {
        if (!restaurantId || !date) return;
        const data = await getReservationsByRestaurantAndDate(restaurantId, date);
        setReservations(data);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Panel de Reservas</h1>

            <div className="flex space-x-4 mb-6">
                <select
                    value={restaurantId}
                    onChange={(e) => setRestaurantId(e.target.value)}
                    className="border px-4 py-2 rounded w-1/2"
                >
                    <option value="">Seleccionar restaurante</option>
                    {restaurants.map((r) => (
                        <option key={r.id} value={r.id}>
                            {r.name} - {r.city}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border px-4 py-2 rounded w-1/2"
                />

                <button
                    onClick={handleSearch}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                    Buscar
                </button>
            </div>

            {reservations.length > 0 ? (
                <table className="min-w-full bg-white shadow rounded-lg">
                    <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="py-2 px-4">Cliente</th>
                        <th className="py-2 px-4">Email</th>
                        <th className="py-2 px-4">DNI</th>
                        <th className="py-2 px-4">Fecha</th>
                        <th className="py-2 px-4">Código</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reservations.map((res: any) => (
                        <tr key={res.id} className="border-t">
                            <td className="py-2 px-4">{res.customer_name}</td>
                            <td className="py-2 px-4">{res.customer_email}</td>
                            <td className="py-2 px-4">{res.customer_dni}</td>
                            <td className="py-2 px-4">{res.date}</td>
                            <td className="py-2 px-4 font-mono">{res.code}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-500">No hay reservas para ese día.</p>
            )}
        </div>
    );
};

export default ReservationAdminPanel;
