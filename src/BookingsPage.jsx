import React, { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle, X, Search, Filter, ChevronDown, Users, MessageSquare, Star } from 'lucide-react';

// Dummy bookings data with feedback status
const dummyBookings = [
  {
    id: 1,
    roomName: "Executive Suite",
    location: "Pune_Baner",
    date: "2025-04-30",
    startTime: "10:00",
    endTime: "11:30",
    status: "confirmed",
    participants: 8,
    feedbackSubmitted: false
  },
  {
    id: 2,
    roomName: "Brainstorm Room",
    location: "Pune_Baner",
    date: "2025-04-29",
    startTime: "14:00",
    endTime: "15:00",
    status: "completed",
    participants: 5,
    feedbackSubmitted: false
  },
  {
    id: 3,
    roomName: "Conference Hall",
    location: "Pune_Wadgaonsheri",
    date: "2025-05-02",
    startTime: "09:00",
    endTime: "12:00",
    status: "confirmed",
    participants: 15,
    feedbackSubmitted: false
  },
  {
    id: 4,
    roomName: "Meeting Pod",
    location: "Hyderabad",
    date: "2025-04-28",
    startTime: "11:00",
    endTime: "12:00",
    status: "cancelled",
    participants: 4,
    feedbackSubmitted: false
  },
  {
    id: 5,
    roomName: "Training Room",
    location: "Hyderabad",
    date: "2025-05-05",
    startTime: "13:00",
    endTime: "17:00",
    status: "confirmed",
    participants: 12,
    feedbackSubmitted: false
  }
];

// Office hours
const OFFICE_HOURS = {
  start: "09:00",
  end: "18:00"
};

const BookingsPage = () => {
  const [bookings, setBookings] = useState(dummyBookings);
  const [filter, setFilter] = useState('all');
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Feedback state
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  
  const handleCancelBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? {...booking, status: 'cancelled'} : booking
      ));
    }
  };
  
  const handleOpenRescheduleModal = (booking) => {
    setSelectedBooking(booking);
    setNewDate(booking.date);
    setNewStartTime(booking.startTime);
    setNewEndTime(booking.endTime);
    setIsRescheduleModalOpen(true);
  };
  
  const handleCloseRescheduleModal = () => {
    setIsRescheduleModalOpen(false);
    setSelectedBooking(null);
    setNewDate('');
    setNewStartTime('');
    setNewEndTime('');
  };
  
  const handleOpenFeedbackModal = (booking) => {
    setSelectedBooking(booking);
    setFeedbackRating(0);
    setFeedbackComment('');
    setIsFeedbackModalOpen(true);
  };
  
  const handleCloseFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
    setSelectedBooking(null);
    setFeedbackRating(0);
    setFeedbackComment('');
  };
  
  const handleSubmitFeedback = () => {
    if (feedbackRating === 0) {
      alert("Please select a rating before submitting feedback");
      return;
    }
    
    setBookings(bookings.map(booking => 
      booking.id === selectedBooking.id 
        ? {
            ...booking,
            feedbackSubmitted: true
          } 
        : booking
    ));
    
    handleCloseFeedbackModal();
    alert(`Feedback for ${selectedBooking.roomName} has been submitted. Thank you!`);
  };
  
  const handleRescheduleBooking = () => {
    if (!newDate || !newStartTime || !newEndTime) {
      alert("Please select a date and specify both start and end times");
      return;
    }
    
    // Validate times
    if (newStartTime >= newEndTime) {
      alert("End time must be after start time");
      return;
    }
    
    setBookings(bookings.map(booking => 
      booking.id === selectedBooking.id 
        ? {
            ...booking, 
            date: newDate, 
            startTime: newStartTime, 
            endTime: newEndTime
          } 
        : booking
    ));
    
    handleCloseRescheduleModal();
    alert(`Booking for ${selectedBooking.roomName} successfully rescheduled!`);
  };
  
  // Get unique locations for filter
  const locations = ['all', ...new Set(bookings.map(booking => booking.location))];
  
  // Apply filters and search
  const filteredBookings = bookings
    .filter(booking => filter === 'all' || booking.status === filter)
    .filter(booking => locationFilter === 'all' || booking.location === locationFilter)
    .filter(booking => 
      searchQuery === '' || 
      booking.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Get status badge details
  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed':
        return {
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
          colorClass: 'bg-blue-100 text-blue-800'
        };
      case 'completed':
        return {
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
          colorClass: 'bg-green-100 text-green-800'
        };
      case 'cancelled':
        return {
          icon: <XCircle className="h-4 w-4 mr-1" />,
          colorClass: 'bg-red-100 text-red-800'
        };
      default:
        return {
          icon: null,
          colorClass: 'bg-gray-100 text-gray-800'
        };
    }
  };
  
  // Generate date options for the next 30 days
  const generateDateOptions = () => {
    const dateOptions = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      const formattedDate = `${year}-${month}-${day}`;
      const displayDate = date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
      
      dateOptions.push({ value: formattedDate, label: displayDate });
    }
    
    return dateOptions;
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
          
          <a href="/home" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            + New Booking
          </a>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by room name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full md:w-auto flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
              >
                <Filter className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-700">Filter Location</span>
                <ChevronDown className="h-5 w-5 text-gray-400 ml-2" />
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {locations.map(location => (
                    <button
                      key={location}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${locationFilter === location ? 'bg-blue-50 text-blue-600' : ''}`}
                      onClick={() => {
                        setLocationFilter(location);
                        setShowDropdown(false);
                      }}
                    >
                      {location === 'all' ? 'All Locations' : location.replace('_', ' - ')}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          {/* Status Filter Tabs */}
          <div className="flex border-b">
            <button 
              onClick={() => setFilter('all')}
              className={`flex-1 px-4 py-3 text-center font-medium ${filter === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              All Bookings
            </button>
            <button 
              onClick={() => setFilter('confirmed')}
              className={`flex-1 px-4 py-3 text-center font-medium ${filter === 'confirmed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Upcoming
            </button>
            <button 
              onClick={() => setFilter('completed')}
              className={`flex-1 px-4 py-3 text-center font-medium ${filter === 'completed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Completed
            </button>
            <button 
              onClick={() => setFilter('cancelled')}
              className={`flex-1 px-4 py-3 text-center font-medium ${filter === 'cancelled' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Cancelled
            </button>
          </div>
          
          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No bookings found</h3>
              <p className="text-gray-500 mb-4">Try changing your search or filter criteria</p>
              <a href="/" className="text-blue-600 font-medium hover:underline">
                Book a meeting room
              </a>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredBookings.map(booking => {
                const { icon, colorClass } = getStatusBadge(booking.status);
                const isPast = new Date(`${booking.date}T${booking.endTime}`) < new Date();
                const showFeedbackButton = booking.status === 'completed' && !booking.feedbackSubmitted;
                
                return (
                  <div key={booking.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="md:flex justify-between items-center">
                      <div className="md:flex items-start gap-4">
                        {/* Date Column */}
                        <div className="mb-3 md:mb-0 md:w-24 flex-shrink-0">
                          <div className="text-center">
                            <div className="font-bold text-lg text-gray-900">
                              {new Date(booking.date).getDate()}
                            </div>
                            <div className="text-gray-500 uppercase text-sm">
                              {new Date(booking.date).toLocaleDateString('en-US', { month: 'short' })}
                            </div>
                          </div>
                        </div>
                        
                        {/* Details Column */}
                        <div className="flex-grow">
                          <div className="flex items-center mb-1">
                            <h3 className="text-lg font-semibold text-gray-900 mr-3">{booking.roomName}</h3>
                            <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
                              {icon}
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                            {booking.feedbackSubmitted && booking.status === 'completed' && (
                              <span className="ml-2 flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                Feedback Submitted
                              </span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{booking.location.replace('_', ' - ')}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{booking.startTime} - {booking.endTime}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{booking.participants} participants</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions Column */}
                      <div className="mt-4 md:mt-0 flex justify-end">
                        {booking.status === 'confirmed' && !isPast && (
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleCancelBooking(booking.id)}
                              className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => handleOpenRescheduleModal(booking)}
                              className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                            >
                              Reschedule
                            </button>
                          </div>
                        )}
                        
                        {/* Show feedback button only for completed bookings that haven't had feedback submitted */}
                        {showFeedbackButton && (
                          <button 
                            onClick={() => handleOpenFeedbackModal(booking)}
                            className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 flex items-center"
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Submit Feedback
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Reschedule Modal */}
      {isRescheduleModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Reschedule Booking</h2>
              <button 
                onClick={handleCloseRescheduleModal}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Room Info */}
            <div className="p-4 bg-gray-50 rounded-lg mb-5">
              <h3 className="font-medium text-gray-900 mb-1">{selectedBooking.roomName}</h3>
              <div className="flex flex-wrap gap-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{selectedBooking.location.replace('_', ' - ')}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{selectedBooking.participants} participants</span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                  <span>Currently: {formatDate(selectedBooking.date)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1 text-gray-400" />
                  <span>Time: {selectedBooking.startTime} - {selectedBooking.endTime}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Select New Date
              </label>
              <select 
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a date</option>
                {generateDateOptions().map(date => (
                  <option key={date.value} value={date.value}>
                    {date.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  min={OFFICE_HOURS.start}
                  max={OFFICE_HOURS.end}
                  value={newStartTime}
                  onChange={(e) => setNewStartTime(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  min={newStartTime || OFFICE_HOURS.start}
                  max={OFFICE_HOURS.end}
                  value={newEndTime}
                  onChange={(e) => setNewEndTime(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 mb-5">
              <Clock className="h-4 w-4 mr-1" />
              Office hours: {OFFICE_HOURS.start} - {OFFICE_HOURS.end}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseRescheduleModal}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRescheduleBooking}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Feedback Modal */}
      {isFeedbackModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Submit Feedback</h2>
              <button 
                onClick={handleCloseFeedbackModal}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Room Info */}
            <div className="p-4 bg-gray-50 rounded-lg mb-5">
              <h3 className="font-medium text-gray-900 mb-1">{selectedBooking.roomName}</h3>
              <div className="flex flex-wrap gap-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{selectedBooking.location.replace('_', ' - ')}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{formatDate(selectedBooking.date)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{selectedBooking.startTime} - {selectedBooking.endTime}</span>
                </div>
              </div>
            </div>
            
            {/* Rating */}
            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                How would you rate your experience?
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackRating(star)}
                    className={`p-2 rounded-full focus:outline-none transition-colors ${
                      feedbackRating >= star ? 'text-yellow-500' : 'text-gray-300'
                    }`}
                  >
                    <Star className="h-8 w-8 fill-current" />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Comments */}
            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Additional Comments (Optional)
              </label>
              <textarea
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="Share your experience or suggestions for improvement..."
                className="w-full p-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 h-24"
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseFeedbackModal}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;