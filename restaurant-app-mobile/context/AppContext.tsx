import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import {Restaurant, Reservation, NewReservationData} from '@/types';
import restaurantService from '../services/restaurants/restaurantService';
import {
  createReservation as apiCreateReservation,
  getReservationsByRestaurantAndDate as fetchAllReservations,
  getReservationByDniAndCode as apiGetReservationByDniAndCode,
  updateReservationDate as apiUpdateReservationDate,
  deleteReservation as apiDeleteReservation,
} from '../services/reservations/reservationService';

import {AxiosResponse} from "axios";

interface AppContextType {
  restaurants: Restaurant[];
  reservations: Reservation[];
  loadRestaurants: (filters?: { city?: string; letter?: string }) => Promise<void>;
  addRestaurant: (restaurant: Omit<Restaurant, 'id' | 'created_at'>) => void;
  updateRestaurant: (
    id: string,
    restaurant: Omit<Restaurant, 'id' | 'created_at'>
  ) => void;
  deleteRestaurant: (id: string) => void;
  createReservation: (data: NewReservationData) => Promise<AxiosResponse<any>>;
  getReservationsByRestaurantAndDate: () => Promise<void>;
  getReservationByDniAndCode: (dni: string, code: string) => Promise<Reservation | null>;
  updateReservationDate: (id: string, newDate: string) => Promise<void>;
  deleteReservation: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  
  const loadRestaurants = async (filters?: { city?: string; letter?: string }) => {
    try {
      const { data } = await restaurantService.onGetRestaurants(filters);
      setRestaurants(data);
    } catch (error) {
      console.warn('No se pudo conectar al backend:', error);
    }
  };
  
  useEffect(() => {
    loadRestaurants();
  }, []);

  const [reservations, setReservations] = useState<Reservation[]>([]);

  const addRestaurant = async (
      restaurantData: Omit<Restaurant, 'id' | 'created_at'>
  ) => {
    try {
      const response = await restaurantService.onCreateRestaurant(restaurantData);
      const newRestaurant = response.data;
      setRestaurants((prev) => [...prev, newRestaurant]);
    } catch (error) {
      console.error('Error al crear restaurante:', error);
    }
  };

  const updateRestaurant = async (
      id: string,
      restaurantData: Omit<Restaurant, 'id' | 'created_at'>
  ) => {
    try {
      const response = await restaurantService.onUpdateRestaurant(id, restaurantData);
      const updated = response.data;
      setRestaurants((prev) =>
          prev.map((restaurant) =>
              restaurant.id === id ? updated : restaurant
          )
      );
    } catch (error) {
      console.error('Error al actualizar restaurante:', error);
    }
  };

  const deleteRestaurant = async (id: string) => {
    try {
      await restaurantService.onDeleteRestaurant(id);
      setRestaurants((prev) =>
          prev.filter((restaurant) => restaurant.id !== id)
      );
      setReservations((prev) =>
          prev.filter((reservation) => reservation.restaurant_id !== id)
      );
    } catch (error) {
      console.error('Error al eliminar restaurante:', error);
      throw error;
    }
  };

  const getReservationsByRestaurantAndDate = async () => {
    try {
      const response = await fetchAllReservations();
      setReservations(response);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
    }
  };
  
  const createReservation = async (data: NewReservationData): Promise<AxiosResponse<any>> => {
    try {
      const response = await apiCreateReservation(data);
      await getReservationsByRestaurantAndDate();
      return response;
    } catch (error: any) {
      throw error;
    }
  };
  
  const getReservationByDniAndCode = async (
    dni: string,
    code: string
  ): Promise<Reservation | null> => {
    try {
      const res = await apiGetReservationByDniAndCode(dni, code);
      return res;
    } catch (error) {
      console.error('Error al buscar reserva:', error);
      return null;
    }
  };
  
  const updateReservationDate = async (id: string, newDate: string): Promise<void> => {
    try {
      console.log('Context: Updating reservation', { id, newDate });
      await apiUpdateReservationDate(id, newDate);
      await getReservationsByRestaurantAndDate();
      console.log('Context: Reservation updated successfully');
    } catch (error: any) {
      console.error('Context: Error updating reservation:', error);
      throw error;
    }
  };
  
  const deleteReservation = async (id: string): Promise<void> => {
    try {
      console.log('Context: Deleting reservation', { id });
      await apiDeleteReservation(id);
      setReservations(prev => prev.filter(r => r.id !== id));
      console.log('Context: Reservation deleted successfully');
    } catch (error: any) {
      console.error('Context: Error deleting reservation:', error);
      throw error;
    }
  };  

  return (
    <AppContext.Provider
      value={{
        restaurants,
        reservations,
        loadRestaurants,
        addRestaurant,
        updateRestaurant,
        deleteRestaurant,
        createReservation,
        getReservationsByRestaurantAndDate,
        getReservationByDniAndCode,
        updateReservationDate,
        deleteReservation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
