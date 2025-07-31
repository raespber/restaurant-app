import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppRoutes from '@/app/routes';
import { AppProvider } from '@/context/AppContext';
export default function App() {
    return (
        <AppProvider>
            <NavigationContainer>
                <AppRoutes />
            </NavigationContainer>
        </AppProvider>
    );
}