import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

export default function BookingDetailsModal({ isOpen, onClose, booking, onUpdateStatus }) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  if (!booking) return null;

  const statusColors = {
    confirmed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-[#EDAE49]/20 text-[#b87a00]',
    cancelled: 'bg-[#D1495B]/10 text-[#D1495B]',
  };

  const handleStatusChange = (newStatus) => {
    onUpdateStatus(booking.id, newStatus);
    setShowStatusMenu(false);
  };

  // Mock timeline data
  const timeline = [
    { action: 'Booking created', time: 'Feb 20, 2026 - 10:30 AM', status: 'completed' },
    { action: 'Payment received', time: 'Feb 20, 2026 - 10:35 AM', status: 'completed' },
    { action: 'Booking confirmed', time: 'Feb 20, 2026 - 11:00 AM', status: booking.status === 'confirmed' ? 'completed' : 'pending' },
    { action: 'Service completed', time: 'Pending', status: 'upcoming' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Booking Details" size="lg">
      <div className="space-y-6">
        {/* Header with status */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Booking ID</p>
            <p className="text-xl font-bold text-[#003D5B]">{booking.id}</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-2 ${statusColors[booking.status]}`}
            >
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              <span>▼</span>
            </button>
            
            {showStatusMenu && (
              <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                {['confirmed', 'pending', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 capitalize ${
                      booking.status === status ? 'bg-gray-50 font-semibold' : ''
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Customer info */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="font-semibold text-[#003D5B] mb-3">Customer Information</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#003D5B] flex items-center justify-center text-white font-bold text-lg">
              {booking.customer.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="font-bold text-[#003D5B]">{booking.customer}</p>
              <p className="text-sm text-gray-500">customer@email.com</p>
              <p className="text-sm text-gray-500">+254 700 000000</p>
            </div>
          </div>
        </div>

        {/* Booking details grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-xl">
            <p className="text-xs text-gray-400">Service</p>
            <p className="font-semibold text-[#003D5B]">{booking.service}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl">
            <p className="text-xs text-gray-400">Date & Time</p>
            <p className="font-semibold text-[#003D5B]">{booking.date} at {booking.time}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl">
            <p className="text-xs text-gray-400">Guests</p>
            <p className="font-semibold text-[#003D5B]">{booking.guests} {booking.guests === 1 ? 'person' : 'people'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl">
            <p className="text-xs text-gray-400">Amount</p>
            <p className="font-semibold text-[#EDAE49]">{booking.amount}</p>
          </div>
        </div>

        {/* Payment info */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="font-semibold text-[#003D5B] mb-2">Payment Information</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p className="text-gray-500">Payment Method:</p>
            <p className="font-medium text-[#003D5B]">Credit Card</p>
            <p className="text-gray-500">Transaction ID:</p>
            <p className="font-medium text-[#003D5B]">TXN-{booking.id.slice(4)}</p>
            <p className="text-gray-500">Payment Status:</p>
            <p className="font-medium text-emerald-600">Paid</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="font-semibold text-[#003D5B] mb-3">Booking Timeline</h3>
          <div className="space-y-3">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-2 h-2 mt-2 rounded-full ${
                  item.status === 'completed' ? 'bg-emerald-500' : 'bg-gray-300'
                }`} />
                <div>
                  <p className="text-sm font-medium text-[#003D5B]">{item.action}</p>
                  <p className="text-xs text-gray-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Special requests */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="font-semibold text-[#003D5B] mb-2">Special Requests</h3>
          <p className="text-sm text-gray-600">Vegetarian meal preference, need pickup from hotel.</p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" size="md" className="flex-1" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" size="md" className="flex-1">
            Message Customer
          </Button>
        </div>
      </div>
    </Modal>
  );
}