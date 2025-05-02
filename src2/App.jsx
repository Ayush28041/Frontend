import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Auth/Login';
import RoomsList from './components/Rooms/RoomsList';
import Signup from './components/Auth/Signup';
import Profile from './components/Profile/Profile';
import MyBookings from './components/Bookings/MyBookings';
import Navbar from './components/Navbar/Navbar';
import PrivateRoute from './components/Auth/PrivateRoute';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/rooms" replace /> : <Login />
        } />
        <Route path="/signup" element={
          isAuthenticated ? <Navigate to="/rooms" replace /> : <Signup />
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        <Route path="/rooms" element={
          <PrivateRoute>
            <RoomsList />
          </PrivateRoute>
        } />
        <Route path="/my-bookings" element={
          <PrivateRoute>
            <MyBookings />
          </PrivateRoute>
        } />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/rooms" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
