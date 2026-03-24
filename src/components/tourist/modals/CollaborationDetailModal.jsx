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
    
    // Prepare booking data (you can expand this later)
    const bookingData = {
      type: 'collaboration',
      id: collaboration.id,
      name: collaboration.name,
      businesses: [collaboration.business_name, collaboration.partner_name].filter(Boolean),
      guests: guests,
      date: selectedDate,
    };
    
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
            <span className="bg-gray-100 text-[#003D5B] px-3 py-1 rounded-full text-sm">
              {collaboration.business_name || 'Business'}
            </span>
            <span className="bg-gray-100 text-[#003D5B] px-3 py-1 rounded-full text-sm">
              {collaboration.partner_name || 'Partner'}
            </span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="font-semibold text-[#003D5B] mb-2">About this collaboration</h4>
          <p className="text-sm text-gray-600">
            {collaboration.type} collaboration based in {collaboration.location}. 
            These businesses work together to provide seamless experiences for travelers.
          </p>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl">
          <div>
            <p className="text-xs text-gray-400">Type</p>
            <p className="font-medium text-[#003D5B]">{collaboration.type || 'Partnership'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Location</p>
            <p className="font-medium text-[#003D5B]">{collaboration.location || 'Kenya'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Rating</p>
            <p className="font-medium text-[#EDAE49]">★ {collaboration.rating || 'New'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Status</p>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
              collaboration.status === 'active' 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-gray-100 text-gray-500'
            }`}>
              {collaboration.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {/* Booking form */}
        <div className="border-t border-gray-100 pt-4">
          <h4 className="font-semibold text-[#003D5B] mb-3">Inquire about this partnership</h4>
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
              <p className="text-sm text-gray-500">Note</p>
              <p className="text-sm text-gray-600">Contact the businesses for pricing details</p>
            </div>
            <Button 
              variant="primary" 
              onClick={handleBookNow} 
              disabled={!selectedDate}
            >
              Inquire Now
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}