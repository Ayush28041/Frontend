import React, { useState, useEffect } from 'react';
import { rooms } from '../../services/api';
import toast from 'react-hot-toast';
import BookingForm from '../Bookings/BookingForm';

export default function RoomsList() {
  const [allRooms, setAllRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [filters, setFilters] = useState({
    location: 'All',
    date: '',
    startTime: '',
    endTime: ''
  });
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isFiltersApplied, setIsFiltersApplied] = useState(false);

  const locations = ['All', 'Pune_Baner', 'Pune_Wadgaonsheri', 'Hyderabad'];

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, allRooms]);

  const fetchRooms = async () => {
    try {
      const { data } = await rooms.getAll();
      setAllRooms(data);
      setFilteredRooms(data);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch rooms');
      setAllRooms([]);
      setFilteredRooms([]);
    }
  };

  const applyFilters = () => {
    try {
      let filtered = [...allRooms];
      console.log('Initial rooms:', filtered);

      // Apply location filter
      if (filters.location !== 'All') {
        filtered = filtered.filter(room => room.location === filters.location);
      }

      // Apply date and time filters
      if (filters.date && filters.startTime && filters.endTime) {
        const requestStart = new Date(`${filters.date}T${filters.startTime}:00`);
        const requestEnd = new Date(`${filters.date}T${filters.endTime}:00`);

        filtered = filtered.filter(room => {
          // Basic availability check
          if (!room.availability || room.availability.toLowerCase() !== 'available') {
            console.log(`Room ${room.id} not available: status=${room.availability}`);
            return false;
          }

          // Check existing bookings
          if (room.bookings && room.bookings.length > 0) {
            // Check each booking for time conflicts
            for (const booking of room.bookings) {
              const bookingStart = new Date(booking.startTime);
              const bookingEnd = new Date(booking.endTime);

              // Compare dates without time
              const sameDate = bookingStart.toDateString() === requestStart.toDateString();
              
              if (sameDate) {
                // Check for time overlap
                if (
                  (requestStart <= bookingEnd && requestEnd >= bookingStart) ||
                  (bookingStart <= requestEnd && bookingEnd >= requestStart)
                ) {
                  console.log(`Room ${room.id} has conflicting booking:`, {
                    request: { start: requestStart, end: requestEnd },
                    booking: { start: bookingStart, end: bookingEnd }
                  });
                  return false;
                }
              }
            }
          }

          return true;
        });
      }

      console.log('Filtered rooms:', filtered);
      setFilteredRooms(filtered);
    } catch (error) {
      console.error('Error applying filters:', error);
      toast.error('Error filtering rooms');
      setFilteredRooms([]);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusClass = (status) => {
    // Handle undefined or null status
    if (!status) return '';

    switch (status.toLowerCase()) {
      case 'available': return 'text-green-600';
      case 'booked': return 'text-red-600';
      case 'maintenance': return 'text-yellow-600';
      default: return '';
    }
  };

  const getStatusBadgeClass = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status.toLowerCase()) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'booked': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBookRoom = (room) => {
    if (!filters.date || !filters.startTime || !filters.endTime) {
      toast.error('Please select date and time before booking');
      return;
    }

    if (!room || !room.availability) {
      toast.error('Invalid room data');
      return;
    }

    if (room.availability.toLowerCase() !== 'available') {
      toast.error(`Room cannot be booked - Status: ${room.availability}`);
      return;
    }

    setSelectedRoom({
      ...room,
      bookingDate: filters.date,
      startTime: filters.startTime,
      endTime: filters.endTime
    });
    setShowBookingForm(true);
  };

  const validateFilters = () => {
    if (!filters.date) {
      toast.error('Please select a date');
      return false;
    }
    if (!filters.startTime) {
      toast.error('Please select start time');
      return false;
    }
    if (!filters.endTime) {
      toast.error('Please select end time');
      return false;
    }

    const startDateTime = new Date(`${filters.date}T${filters.startTime}`);
    const endDateTime = new Date(`${filters.date}T${filters.endTime}`);
    const now = new Date();

    // Remove time from current date for comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const selectedDate = new Date(filters.date);

    if (selectedDate < today) {
      toast.error('Cannot book for past dates');
      return false;
    }

    if (selectedDate.getTime() === today.getTime() && startDateTime < now) {
      toast.error('Cannot book for past time');
      return false;
    }

    if (endDateTime <= startDateTime) {
      toast.error('End time must be after start time');
      return false;
    }

    // Check business hours (9 AM to 6 PM)
    const startHour = startDateTime.getHours();
    const endHour = endDateTime.getHours();
    const endMinutes = endDateTime.getMinutes();

    if (startHour < 9 || (endHour === 18 && endMinutes > 0) || endHour > 18) {
      toast.error('Bookings only allowed between 9 AM and 6 PM');
      return false;
    }

    return true;
  };

  const handleApplyFilters = () => {
    if (!validateFilters()) return;

    setIsFiltersApplied(true);
    applyFilters();
  };

  const clearFilters = () => {
    setFilters({
      location: 'All',
      date: '',
      startTime: '',
      endTime: ''
    });
    setIsFiltersApplied(false);
    setFilteredRooms([]);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Find Available Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <select
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={filters.startTime}
              onChange={handleFilterChange}
              min="09:00"
              max="18:00"
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input
              type="time"
              name="endTime"
              value={filters.endTime}
              onChange={handleFilterChange}
              min="09:00"
              max="18:00"
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Clear
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Search Rooms
          </button>
        </div>
      </div>

      {/* Rooms Grid - Only show when filters are applied */}
      {isFiltersApplied ? (
        filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map(room => (
              <div key={room.id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative">
                  <img 
                    src={room.imageUrl} 
                    alt={room.name} 
                    className="w-full h-48 object-cover"
                  />
                  <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeClass(room.availability)}`}>
                    {room.availability || 'Unknown'}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{room.name}</h3>
                      <p className="text-gray-600">{room.location}</p>
                    </div>
                    <div className="flex items-center bg-gray-100 px-3 py-1 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-600">
                        {room.capacity}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {room.amenities?.map((amenity, index) => (
                        <span key={index} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded">
                          {amenity}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => handleBookRoom(room)}
                      disabled={(room.availability || '').toLowerCase() !== 'available'}
                      className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                        (room.availability || '').toLowerCase() === 'available'
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {(room.availability || '').toLowerCase() === 'available' ? 'Book Room' : 'Not Available'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 text-lg">
              No rooms available for the selected criteria.
            </p>
          </div>
        )
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">
            Please select date and time to search for available rooms.
          </p>
        </div>
      )}

      {showBookingForm && selectedRoom && (
        <BookingForm
          room={selectedRoom}
          onClose={() => setShowBookingForm(false)}
          onSuccess={() => {
            fetchRooms();
            setShowBookingForm(false);
          }}
        />
      )}
    </div>
  );
}
