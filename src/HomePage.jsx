import React, { useState } from 'react';
import { Search, Clock, Calendar, MapPin, AlertTriangle } from 'lucide-react';

// Dummy data for meeting rooms with maintenance status added
const dummyRooms = [
  { 
    id: 1, 
    name: "Executive Suite", 
    location: "Pune_Baner", 
    capacity: 12, 
    amenities: ["Projector", "Whiteboard", "Video Conference"], 
    imageUrl: "/api/placeholder/300/200",
    status: "booked" // Status: available, booked, maintenance
  },
  { 
    id: 2, 
    name: "Brainstorm Room", 
    location: "Pune_Baner", 
    capacity: 8, 
    amenities: ["Whiteboard", "TV Screen"], 
    imageUrl: "/api/placeholder/300/200",
    status: "available"
  },
  { 
    id: 3, 
    name: "Conference Hall", 
    location: "Pune_Wadgaonsheri", 
    capacity: 20, 
    amenities: ["Projector", "Sound System", "Video Conference"], 
    imageUrl: "/api/placeholder/300/200",
    status: "maintenance"
  },
  { 
    id: 4, 
    name: "Team Room", 
    location: "Pune_Wadgaonsheri", 
    capacity: 6, 
    amenities: ["TV Screen", "Whiteboard"], 
    imageUrl: "/api/placeholder/300/200",
    status: "available"
  },
  { 
    id: 5, 
    name: "Meeting Pod", 
    location: "Hyderabad", 
    capacity: 4, 
    amenities: ["TV Screen"], 
    imageUrl: "/api/placeholder/300/200",
    status: "booked"
  },
  { 
    id: 6, 
    name: "Training Room", 
    location: "Hyderabad", 
    capacity: 15, 
    amenities: ["Projector", "Whiteboard", "Sound System"], 
    imageUrl: "/api/placeholder/300/200",
    status: "maintenance"
  },
];

export default function Homepage() {
  const [location, setLocation] = useState('all');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState([]);
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  const handleQuickSearch = () => {
    setLocation('all');
    setDate(today);
    setStartTime('09:00');
    setEndTime('18:00');
    performSearch('all', today, '09:00', '18:00');
  };
  
  const handleSearch = () => {
    performSearch(location, date, startTime, endTime);
  };
  
  const performSearch = (loc, dt, start, end) => {
    // Filter rooms based on location
    let results = dummyRooms;
    if (loc !== 'all') {
      results = dummyRooms.filter(room => room.location === loc);
    }
    
    setFilteredRooms(results);
    setSearchPerformed(true);
  };
  
  const handleBooking = (roomId) => {
    alert(`Room ${roomId} booked successfully!`);
    // In a real app, this would call an API to create a booking
  };

  // Function to get status badge styling
  const getStatusBadgeStyle = (status) => {
    switch(status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'booked':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get status display text
  const getStatusText = (status) => {
    switch(status) {
      case 'available':
        return 'Available';
      case 'booked':
        return 'Booked';
      case 'maintenance':
        return 'Under Maintenance';
      default:
        return 'Unknown';
    }
  };

  // Function to get button state
  const getButtonState = (status) => {
    switch(status) {
      case 'available':
        return {
          enabled: true,
          text: 'Book Now',
          style: 'bg-blue-600 text-white hover:bg-blue-700'
        };
      case 'booked':
        return {
          enabled: false,
          text: 'Unavailable',
          style: 'bg-gray-100 text-gray-400 cursor-not-allowed'
        };
      case 'maintenance':
        return {
          enabled: false,
          text: 'Under Maintenance',
          style: 'bg-yellow-100 text-yellow-800 cursor-not-allowed'
        };
      default:
        return {
          enabled: false,
          text: 'Unavailable',
          style: 'bg-gray-100 text-gray-400 cursor-not-allowed'
        };
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Panel */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Find a Meeting Room</h2>
        
        {/* Quick Search Button */}
        <div className="mb-4">
          <button 
            onClick={handleQuickSearch}
            className="bg-blue-100 text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-200"
          >
            <Search className="inline-block mr-2 h-4 w-4" />
            Quick Search for Today (All Locations)
          </button>
        </div>
        
        {/* Detailed Search Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin className="inline-block mr-1 h-4 w-4" />
              Location
            </label>
            <select 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Locations</option>
              <option value="Pune_Baner">Pune - Baner</option>
              <option value="Pune_Wadgaonsheri">Pune - Wadgaonsheri</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="inline-block mr-1 h-4 w-4" />
              Date
            </label>
            <input 
              type="date" 
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Clock className="inline-block mr-1 h-4 w-4" />
              Start Time
            </label>
            <input 
              type="time" 
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Clock className="inline-block mr-1 h-4 w-4" />
              End Time
            </label>
            <input 
              type="time" 
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <button 
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700"
        >
          Search Rooms
        </button>
      </div>
      
      {/* Room Status Legend */}
      {searchPerformed && (
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
            <span className="text-sm">Booked</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
            <span className="text-sm">Under Maintenance</span>
          </div>
        </div>
      )}
      
      {/* Search Results */}
      {searchPerformed && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Available Rooms</h2>
          
          {filteredRooms.length === 0 ? (
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <p className="text-gray-600">No meeting rooms found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map(room => {
                const buttonState = getButtonState(room.status);
                
                return (
                  <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="relative">
                      <img 
                        src={room.imageUrl} 
                        alt={room.name} 
                        className="w-full h-48 object-cover"
                      />
                      {room.status === 'maintenance' && (
                        <div className="absolute top-2 right-2">
                          <AlertTriangle className="h-6 w-6 text-yellow-500 bg-white rounded-full p-1" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold">{room.name}</h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeStyle(room.status)}`}>
                          {getStatusText(room.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{room.location.replace('_', ' - ')}</p>
                      <p className="text-gray-600 mb-4">Capacity: {room.capacity} people</p>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">Amenities:</p>
                        <div className="flex flex-wrap gap-1">
                          {room.amenities.map((amenity, index) => (
                            <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => buttonState.enabled && handleBooking(room.id)}
                        disabled={!buttonState.enabled}
                        className={`w-full py-2 rounded-md font-medium ${buttonState.style}`}
                      >
                        {buttonState.text}
                      </button>
                      
                      {room.status === 'maintenance' && (
                        <p className="text-xs text-yellow-700 mt-2 text-center">
                          This room is currently undergoing maintenance and is unavailable for booking.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}