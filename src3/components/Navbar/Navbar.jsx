import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reservations, auth } from '../../services/api';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [notifications, setNotifications] = useState([]);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    checkNotifications();
    // Check every 5 minutes
    const interval = setInterval(checkNotifications, 300000);
    return () => clearInterval(interval);
  }, []);

  const checkNotifications = async () => {
    try {
      const { data } = await reservations.getAll();

      const currentTime = new Date();
      const notificationsList = [];

      data.forEach(booking => {
        const startTime = new Date(booking.startTime);
        const endTime = new Date(booking.endTime);
        const timeDiff = startTime - currentTime;
        const minutes = Math.floor(timeDiff / 60000);

        // Notify 15 minutes before booking starts
        if (minutes > 0 && minutes <= 15 && booking.status === 'confirmed') {
          notificationsList.push({
            id: booking.id,
            type: 'upcoming',
            message: `Booking for ${booking.room.name} starts in ${minutes} minutes`
          });
        }

        // Notify about completed bookings without feedback
        if (currentTime > endTime && booking.status === 'completed' && !booking.feedbackProvided) {
          notificationsList.push({
            id: booking.id,
            type: 'feedback',
            message: 'Please provide feedback for your completed booking'
          });
        }
      });

      setNotifications(notificationsList);
      setHasNotifications(notificationsList.length > 0);
    } catch (error) {
      console.error('Failed to check notifications:', error);
    }
  };

  const handleLogout = () => {
    try {
      auth.logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <nav className="bg-indigo-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4 text-white">
          <Link to="/rooms">Rooms</Link>
          <Link to="/my-bookings">My Bookings</Link>
          <Link to="/profile">Profile</Link>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-white relative">
            {hasNotifications && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            )}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            {showNotifications && notifications.length > 0 && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg py-1 z-50">
                {notifications.map((notification, index) => (
                  <div
                    key={`${notification.id}-${index}`}
                    className={`px-4 py-3 text-sm text-gray-700 border-b last:border-b-0 
                      ${notification.type === 'upcoming' ? 'bg-blue-50' : 'bg-yellow-50'}`}
                  >
                    {notification.message}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-white focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
