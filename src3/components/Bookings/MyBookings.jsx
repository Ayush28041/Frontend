import React, { useState, useEffect } from 'react';
import { reservations, feedback } from '../../services/api';
import toast from 'react-hot-toast';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('All');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [feedbackData, setFeedbackData] = useState({ rating: 5, comment: '' });

  const locations = ['All', 'Pune_Baner', 'Pune_Wadgaonsheri', 'Hyderabad'];

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await reservations.getAll();
      setBookings(data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    }
  };

  const handleFeedbackSubmit = async () => {
    try {
      if (!feedbackData.rating || !feedbackData.comment.trim()) {
        toast.error('Please provide both rating and comment');
        return;
      }

      const payload = {
        bookingId: selectedBooking.id,
        roomId: selectedBooking.room.id,
        rating: Number(feedbackData.rating),
        comment: feedbackData.comment.trim()
      };

      console.log('Submitting feedback:', payload); // Debug log
      await feedback.create(payload);

      // Update the booking in the local state
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === selectedBooking.id
            ? { ...booking, feedbackProvided: true }
            : booking
        )
      );

      toast.success('Feedback submitted successfully');
      setShowFeedbackModal(false);
      setSelectedBooking(null);
      setFeedbackData({ rating: 5, comment: '' });
    } catch (error) {
      console.error('Feedback submission error:', error.response || error);
      toast.error('Failed to submit feedback. Please try again.');
    }
  };

  const canCancelBooking = (startTime) => {
    const currentTime = new Date();
    const bookingStartTime = new Date(startTime);
    return currentTime < bookingStartTime;
  };

  const handleCancelBooking = async (booking) => {
    try {
      if (!window.confirm('Are you sure you want to cancel this booking?')) {
        return;
      }

      await reservations.cancel(booking.id);
      toast.success('Booking cancelled successfully');
      await fetchBookings();
    } catch (error) {
      console.error('Cancel booking error:', error);
      toast.error('Failed to cancel booking');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const statusMatch = statusFilter === 'all' ? true : booking.status === statusFilter;
    const locationMatch = locationFilter === 'All' ? true : booking.room.location === locationFilter;
    return statusMatch && locationMatch;
  });

  const StarRating = ({ rating, onRatingChange }) => {
    const [hover, setHover] = useState(0);

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="focus:outline-none"
          >
            <svg
              className={`w-8 h-8 ${(hover || rating) >= star ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      {/* Status Filters */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Filter by Status:</h3>
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded ${statusFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          {['confirmed', 'cancelled', 'completed'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded capitalize ${statusFilter === status ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Location Filters */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Filter by Location:</h3>
        <div className="flex gap-4">
          {locations.map(location => (
            <button
              key={location}
              onClick={() => setLocationFilter(location)}
              className={`px-4 py-2 rounded ${locationFilter === location ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
            >
              {location}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map(booking => (
            <div key={booking.id} className="border rounded-lg p-4 shadow">
              <h3 className="font-bold">{booking.title}</h3>
              <p>Room: {booking.room.name}</p>
              <p>Location: {booking.room.location}</p>
              <p>Time: {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleString()}</p>
              <p className="capitalize">Status: {booking.status}</p>

              {/* Add Cancel Button for confirmed bookings */}
              {booking.status === 'confirmed' && (
                <button
                  onClick={() => handleCancelBooking(booking)}
                  disabled={!canCancelBooking(booking.startTime)}
                  className={`mt-2 px-4 py-2 rounded ${canCancelBooking(booking.startTime)
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  Cancel Booking
                </button>
              )}

              {/* Existing feedback button logic */}
              {booking.status === 'completed' && (
                <div>
                  {booking.feedbackProvided ? (
                    <button
                      disabled
                      className="mt-2 px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
                    >
                      Feedback Submitted
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowFeedbackModal(true);
                      }}
                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Give Feedback
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-500">
              {statusFilter !== 'all' || locationFilter !== 'All'
                ? 'Try adjusting your filters'
                : 'You haven\'t made any bookings yet'}
            </p>
          </div>
        )}
      </div>

      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Room Feedback</h3>
              <button
                onClick={() => {
                  setShowFeedbackModal(false);
                  setSelectedBooking(null);
                  setFeedbackData({ rating: 5, comment: '' });
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How would you rate your experience?
                </label>
                <div className="flex justify-center">
                  <StarRating
                    rating={Number(feedbackData.rating)}
                    onRatingChange={(value) => setFeedbackData(prev => ({ ...prev, rating: value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share your experience
                </label>
                <textarea
                  value={feedbackData.comment}
                  onChange={(e) => setFeedbackData(prev => ({ ...prev, comment: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 resize-none h-32"
                  placeholder="Tell us what you liked or what we could improve..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowFeedbackModal(false);
                    setSelectedBooking(null);
                    setFeedbackData({ rating: 5, comment: '' });
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFeedbackSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
