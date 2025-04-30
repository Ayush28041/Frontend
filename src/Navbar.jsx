import React, { useState } from 'react';
import { Menu, Bell } from 'lucide-react';

export default function Navbar({ isAuthenticated, logout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Dummy notifications (replace with real ones from backend)
  const notifications = [
    { id: 1, message: 'Room A booking confirmed' },
    { id: 2, message: 'Room B booking cancelled' },
  ];

  return (
    <nav className="bg-white shadow-md relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-blue-600 font-bold text-xl">MeetingHub</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="/home" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
              Home
            </a>
            <a href="/bookings" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
              My Bookings
            </a>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                <Bell className="w-6 h-6" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-200 font-semibold text-gray-800">
                    Notifications
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className="px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 cursor-pointer border-b last:border-none"
                        >
                          {n.message}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-4 text-sm text-gray-500 text-center">
                        No notifications
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Auth Button */}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium"
              >
                Logout
              </button>
            ) : (
              <a
                href="/login"
                className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium"
              >
                Login / Signup
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <Menu />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a href="/home" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md font-medium">
            Home
          </a>
          <a href="/bookings" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md font-medium">
            My Bookings
          </a>

          {/* Mobile Notifications */}
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-gray-700 font-medium">Notifications</span>
            <div className="relative">
              <Bell className="w-6 h-6" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
                  {notifications.length}
                </span>
              )}
            </div>
          </div>

          {/* Auth Button - Mobile */}
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="text-white bg-blue-600 hover:bg-blue-700 block w-full text-left px-3 py-2 rounded-md font-medium"
            >
              Logout
            </button>
          ) : (
            <a
              href="/login"
              className="text-white bg-blue-600 hover:bg-blue-700 block px-3 py-2 rounded-md font-medium"
            >
              Login / Signup
            </a>
          )}
        </div>
      )}
    </nav>
  );
}
