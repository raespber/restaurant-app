import { AxiosResponse } from 'axios';
import { api } from '../api';
import { Restaurant } from "@/types";
import {restaurantRoute} from "@/services/restaurants/restaurantRoutes";

const onGetRestaurants = async (): Promise<AxiosResponse<any>> => {
  try {
    return await api.get(restaurantRoute);
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

