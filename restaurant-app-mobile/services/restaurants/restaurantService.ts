import { AxiosResponse } from 'axios';
import { api } from '../api';
import { Restaurant } from "@/types";
import {restaurantRoute} from "@/services/restaurants/restaurantRoutes";

const onGetRestaurants = async (filters?: { city?: string; letter?: string }): Promise<AxiosResponse<any>> => {
  try {
    const params = new URLSearchParams();
    if (filters?.city) params.append('city', filters.city);
    if (filters?.letter) params.append('letter', filters.letter);
    
    const url = params.toString() ? `${restaurantRoute}?${params.toString()}` : restaurantRoute;
    return await api.get(url);
  } catch (error) {
    throw new Error('Ocurrió un problema al intentar obtener los restaurantes');
  }
};

const onCreateRestaurant = async (data: Partial<Restaurant>): Promise<AxiosResponse<any>> => {
  try {
    return await api.post(restaurantRoute, data);
  } catch (error) {
    throw new Error('Error al crear restaurante');
  }
};

const onUpdateRestaurant = async (id: string, data: Partial<Restaurant>): Promise<AxiosResponse<any>> => {
  try {
    return await api.put(`${restaurantRoute}${id}`, data);
  } catch (error) {
    throw new Error('Error al actualizar restaurante');
  }
};

const onDeleteRestaurant = async (id: string): Promise<AxiosResponse<any>> => {
  try {
    return await api.delete(`${restaurantRoute}${id}`);
  } catch (error) {
    throw new Error('Error al eliminar restaurante');
  }
};

export default {
  onGetRestaurants,
  onCreateRestaurant,
  onUpdateRestaurant,
  onDeleteRestaurant
};

