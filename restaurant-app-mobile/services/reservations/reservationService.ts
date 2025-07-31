import { api } from '../api';

export const createReservation = async (data: {
    restaurant_id: string;
    customer_name: string;
    customer_email: string;
    customer_dni: string;
    date: string;
}) => {
    return await api.post('/reservations/', data);
};

export const getReservationsByRestaurantAndDate = async () => {
    const response = await api.get('/reservations/', {
    
    });
    return response.data;
};

export const getReservationByDniAndCode = async (
    dni: string,
    code: string
) => {
    const response = await api.get('/reservations/search/', {
        params: { dni, code },
    });
    return response.data;
};

export const updateReservationDate = async (id: string, newDate: string) => {
    await api.put(`/reservations/${id}/`, { date: newDate });
};

export const deleteReservation = async (id: string) => {
    await api.delete(`/reservations/${id}/`);
};
