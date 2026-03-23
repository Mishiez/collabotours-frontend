import { useState } from 'react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';

export default function ServiceDetailModal({ isOpen, onClose, service }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [guests, setGuests] = useState(1);
  
  if (!service) return null;

  const handleBookNow = () => {
    console.log('Booking:', { service: service.id, date: selectedDate, guests });
    onClose();
    // Will navigate to checkout later
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={service.name} size="lg">
      <div className="space-y-5">
        {/* Business info */}
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div className="w-12 h-12 rounded-xl bg-[#003D5B]/10 flex items-center justify-center text-2xl">
            🏝️
          </div>
          <div>
            <p className="text-sm text-gray-400">Offered by</p>
            <p className="font-semibold text-[#003D5B]">{service.business || 'Local Business'}</p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="font-medium">{service.rating || '4.9'}</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="font-semibold text-[#003D5B] mb-2">About this experience</h4>
          <p className="text-sm text-gray-600">{service.description || 'Experience the beauty of Kenya with this amazing tour.'}</p>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl">
          <div>
            <p className="text-xs text-gray-400">Category</p>
            <p className="font-medium text-[#003D5B]">{service.category}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Duration</p>
            <p className="font-medium text-[#003D5B]">{service.duration || 'Full day'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Location</p>
            <p className="font-medium text-[#003D5B]">{service.location || 'Nairobi'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Price</p>
            <p className="font-bold text-[#EDAE49] text-lg">${service.price} <span className="text-xs text-gray-400 font-normal">per person</span></p>
          </div>
        </div>

        {/* Booking form */}
        <div className="border-t border-gray-100 pt-4">
          <h4 className="font-semibold text-[#003D5B] mb-3">Book this experience</h4>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Number of Guests</label>
              <input
                type="number"
                min="1"
                max="20"
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
              />
            </div>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-bold text-[#EDAE49]">${(parseFloat(service.price) * guests).toFixed(2)}</p>
            </div>
            <Button variant="primary" onClick={handleBookNow} disabled={!selectedDate}>
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}