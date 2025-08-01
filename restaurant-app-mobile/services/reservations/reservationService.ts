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
    console.log('Updating reservation:', { id, newDate, url: `/reservations/${id}` });
    const response = await api.put(`/reservations/${id}`, { 
        date: newDate 
    });
    console.log('Update response:', response.data);
    return response;
};

export const deleteReservation = async (id: string) => {
    console.log('Deleting reservation:', { id, url: `/reservations/${id}` });
    const response = await api.delete(`/reservations/${id}`);
    console.log('Delete response:', response.data);
    return response;
};
