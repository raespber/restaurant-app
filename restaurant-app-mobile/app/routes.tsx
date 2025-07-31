import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from '@/screens/Home';
import RestaurantAdmin from '@/screens/RestaurantAdmin';
import ReservationForm from '@/screens/ReservationForm';
import ReservationList from '@/screens/ReservationList';
import RestaurantList from '@/screens/RestaurantList';

import { RootStackParamList } from '@/types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

export default function AppRoutes() {
    return (
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Admin" component={RestaurantAdmin} />
                <Stack.Screen name="Restaurants" component={RestaurantList} />
                <Stack.Screen name="Reserve" component={ReservationForm} />
                <Stack.Screen name="Reservations" component={ReservationList} />
            </Stack.Navigator>
    );
}