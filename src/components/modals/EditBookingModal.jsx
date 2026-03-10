import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

export default function EditBookingModal({ isOpen, onClose, booking, onUpdate }) {
  const [formData, setFormData] = useState({
    date: booking?.date || '',
    time: booking?.time || '',
    guests: booking?.guests || 1,
    service: booking?.service || '',
    specialRequests: '',
  });

  if (!booking) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(booking.id, formData);
    onClose();
  };

  // Mock available services
  const availableServices = [
    'Safari Day Tour',
    'Beach Getaway Package',
    'Cultural City Walk',
    'Sunset Cruise',
    'Mountain Hiking Trip',
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Booking" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Booking ID (read-only) */}
        <div className="bg-gray-50 p-3 rounded-xl">
          <p className="text-xs text-gray-400">Booking ID</p>
          <p className="font-semibold text-[#003D5B]">{booking.id}</p>
        </div>

        {/* Customer (read-only) */}
        <div className="bg-gray-50 p-3 rounded-xl">
          <p className="text-xs text-gray-400">Customer</p>
          <p className="font-semibold text-[#003D5B]">{booking.customer}</p>
        </div>

        {/* Service selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service
          </label>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
          >
            <option value="">Select a service</option>
            {availableServices.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>

        {/* Date and Time row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="text"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
              placeholder="Mar 1, 2026"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <input
              type="text"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
              placeholder="09:00 AM"
            />
          </div>
        </div>

        {/* Number of guests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Guests
          </label>
          <input
            type="number"
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            required
            min="1"
            max="20"
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
          />
        </div>

        {/* Special requests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Requests
          </label>
          <textarea
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
            placeholder="Any special requirements..."
          />
        </div>

        {/* Form actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Update Booking
          </Button>
        </div>
      </form>
    </Modal>
  );
}