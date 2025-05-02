import React, { useState } from 'react';
import { reservations } from '../../services/api';
import toast from 'react-hot-toast';

export default function BookingForm({ room, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    startTime: `${room.bookingDate}T${room.startTime}`,
    endTime: `${room.bookingDate}T${room.endTime}`
  });

  const validateTimeConstraints = (start, end) => {
    const startHour = new Date(start).getHours();
    const endHour = new Date(end).getHours();
    const duration = (new Date(end) - new Date(start)) / (1000 * 60); // minutes

    if (startHour < 9 || endHour > 18) {
      toast.error('Bookings only allowed between 9 AM and 6 PM');
      return false;
    }
    if (duration < 3) {
      toast.error('Minimum booking duration is 3 minutes');
      return false;
    }
    if (duration > 540) { // 9 hours in minutes
      toast.error('Maximum booking duration is 9 hours');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateTimeConstraints(formData.startTime, formData.endTime)) {
      return;
    }

    try {
      await reservations.create({
        roomId: room.id,
        ...formData
      });
      toast.success('Room booked successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to book room');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-xl font-bold mb-4">Book Room: {room.name}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meeting Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="datetime-local"
                value={formData.startTime}
                disabled
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="datetime-local"
                value={formData.endTime}
                disabled
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
