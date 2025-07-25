import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import RestaurantAdmin from './pages/RestaurantAdmin';
import RestaurantList from './pages/RestaurantList';
import ReservationForm from './pages/ReservationForm';
import ReservationList from './pages/ReservationList';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AppProvider>
      <Toaster />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<RestaurantAdmin />} />
            <Route path="/restaurants" element={<RestaurantList />} />
            <Route path="/reserve" element={<ReservationForm />} />
            <Route path="/reservations" element={<ReservationList />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;