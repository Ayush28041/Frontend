import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './Navbar';
import LandingPage from './LandingPage';
import Homepage from './HomePage';
import BookingsPage from './BookingsPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  
  // Authentication functions
  const login = () => {
    setIsAuthenticated(true);
  };
  
  const logout = () => {
    setIsAuthenticated(false);
  };
  
  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar isAuthenticated={isAuthenticated} logout={logout} />
        
        <main className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage login={login} />} />
            <Route path="/signup" element={<SignupPage login={login} />} />
            
            {/* Protected routes */}
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <Homepage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bookings" 
              element={
                <ProtectedRoute>
                  <BookingsPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        
        <footer className="bg-gray-800 text-white py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <span className="font-bold text-xl">MeetingHub</span>
                <p className="text-gray-400 text-sm mt-1">Simplify meeting room management</p>
              </div>
              
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">Terms</a>
                <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-white">Help</a>
              </div>
            </div>
            <div className="mt-6 text-center text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} MeetingHub. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;