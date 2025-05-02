import React, { useState, useEffect } from 'react';
import { reservations, feedback } from '../../services/api';
import toast from 'react-hot-toast';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [feedbackData, setFeedbackData] = useState({ rating: 5, comment: '' });

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
      if (!feedbackData.rating || !feedbackData.comment) {
        toast.error('Please provide both rating and comment');
        return;
      }

      await feedback.create({
        bookingId: selectedBooking.id,
        roomId: selectedBooking.room.id,
        rating: Number(feedbackData.rating),
        comment: feedbackData.comment
      });

      // Update the booking in the local state to mark feedback as provided
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
      console.error('Feedback submission error:', error);
      toast.error(error.message || 'Failed to submit feedback');
    }
  };

  const filteredBookings = bookings.filter(booking =>
    filter === 'all' ? true : booking.status === filter
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
        {['confirmed', 'cancelled', 'completed'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded capitalize ${filter === status ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredBookings.map(booking => (
          <div key={booking.id} className="border rounded-lg p-4 shadow">
            <h3 className="font-bold">{booking.title}</h3>
            <p>Room: {booking.room.name}</p>
            <p>Time: {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleString()}</p>
            <p className="capitalize">Status: {booking.status}</p>
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
        ))}
      </div>

      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Provide Feedback</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <select
                value={feedbackData.rating}
                onChange={(e) => setFeedbackData({ ...feedbackData, rating: e.target.value })}
                className="w-full mb-4 p-2 border rounded"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num} Stars</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comments
              </label>
              <textarea
                value={feedbackData.comment}
                onChange={(e) => setFeedbackData({ ...feedbackData, comment: e.target.value })}
                className="w-full p-2 border rounded resize-none h-24"
                placeholder="Please share your experience..."
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowFeedbackModal(false);
                  setSelectedBooking(null);
                  setFeedbackData({ rating: 5, comment: '' });
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleFeedbackSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
