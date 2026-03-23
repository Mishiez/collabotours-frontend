import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../common/Modal';
import Button from '../../common/Button';

export default function CollaborationDetailModal({ isOpen, onClose, collaboration }) {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('');
  const [guests, setGuests] = useState(1);
  
  if (!collaboration) return null;

  const handleBookNow = () => {
    if (!selectedDate) return;
    
    // Prepare booking data to pass to checkout
    const bookingData = {
      type: 'collaboration',
      id: collaboration.id,
      name: collaboration.name,
      businesses: collaboration.businesses.map(b => b.name),
      price: collaboration.price,
      guests: guests,
      date: selectedDate,
      total: parseFloat(collaboration.price) * guests
    };
    
    // Navigate to checkout with booking data
    navigate('/tourist/checkout', { state: { booking: bookingData } });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={collaboration.name} size="lg">
      <div className="space-y-5">
        {/* Partner businesses */}
        <div className="pb-3 border-b border-gray-100">
          <p className="text-sm text-gray-400 mb-2">Partner Businesses</p>
          <div className="flex flex-wrap gap-2">
            {collaboration.businesses.map((business, idx) => (
              <span key={business.id || idx} className="bg-gray-100 text-[#003D5B] px-3 py-1 rounded-full text-sm">
                {business.name}
              </span>
            ))}
          </div>
        </div>

        {/* Discount badge */}
        {collaboration.discount && (
          <div className="bg-[#EDAE49]/10 border border-[#EDAE49] rounded-xl p-3">
            <p className="text-sm font-semibold text-[#EDAE49]">🤝 Special Partnership Deal - Save {collaboration.discount}!</p>
          </div>
        )}

        {/* Description */}
        <div>
          <h4 className="font-semibold text-[#003D5B] mb-2">About this collaboration</h4>
          <p className="text-sm text-gray-600">{collaboration.description}</p>
        </div>

        {/* Highlights */}
        <div>
          <h4 className="font-semibold text-[#003D5B] mb-2">What's included:</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {collaboration.highlights.map((highlight, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-[#EDAE49]">✓</span>
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl">
          <div>
            <p className="text-xs text-gray-400">Duration</p>
            <p className="font-medium text-[#003D5B]">{collaboration.duration}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Original Price</p>
            <p className="text-sm text-gray-400 line-through">${collaboration.originalPrice}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Deal Price</p>
            <p className="font-bold text-[#EDAE49] text-lg">${collaboration.price}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Rating</p>
            <p className="font-medium text-[#003D5B]">★ {collaboration.rating}</p>
          </div>
        </div>

        {/* Booking form */}
        <div className="border-t border-gray-100 pt-4">
          <h4 className="font-semibold text-[#003D5B] mb-3">Book this partnered experience</h4>
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
              <p className="text-xl font-bold text-[#EDAE49]">${(parseFloat(collaboration.price) * guests).toFixed(2)}</p>
            </div>
            <Button 
              variant="primary" 
              onClick={handleBookNow} 
              disabled={!selectedDate}
            >
              Book Deal
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}