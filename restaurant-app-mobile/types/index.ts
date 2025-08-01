export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  photo_url: string;
  is_active: boolean;
}

export interface Reservation {
  id: string;
  restaurant_id: string;
  customer_name: string;
  customer_email: string;
  customer_dni: string;
  date: string;
  code: string;
  restaurant?: Restaurant;
}

export type NewReservationData = {
  restaurant_id: string;
  customer_name: string;
  customer_email: string;
  customer_dni: string;
  date: string;
};