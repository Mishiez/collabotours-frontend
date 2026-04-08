import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Modal from '../../common/Modal';
import Button from '../../common/Button';
import CollaborationCustomerDetailsModal from './CollaborationCustomerDetailsModal';

export default function CollaborationDetailModal({ isOpen, onClose, collaboration }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [guests, setGuests] = useState(1);
  
  // State for customer details modal
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  
  if (!collaboration) return null;
  
  // For collaborations, user enters the amount (no fixed price)
  const totalAmount = 0; // User will enter amount in the next modal

  const handleBookNow = () => {
    if (!selectedDate) return;
    
    // Check if user is logged in
    if (!user) {
      navigate('/login', { state: { from: '/tourist/collaborations', collaborationId: collaboration.id, returnTo: 'booking' } });
      onClose();
      return;
    }
    
    // User is logged in, show customer details modal
    setShowCustomerModal(true);
  };

  const handleCloseCustomerModal = () => {
    setShowCustomerModal(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={collaboration.name} size="lg">
        <div className="space-y-5">
          {/* Partner businesses */}
          <div className="pb-3 border-b border-gray-100">
            <p className="text-sm text-gray-400 mb-2">Partner Businesses</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-100 text-[#003D5B] px-3 py-1 rounded-full text-sm">
                {collaboration.business_name || 'Business'} (Lead)
              </span>
              <span className="bg-gray-100 text-[#003D5B] px-3 py-1 rounded-full text-sm">
                {collaboration.partner_name || 'Partner'}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Payment will be made to the lead business: {collaboration.business_name}
            </p>
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
              <p className="text-xs text-gray-400">Lead Business</p>
              <p className="font-medium text-[#003D5B]">{collaboration.business_name || 'N/A'}</p>
            </div>
          </div>

          {/* Booking form */}
          <div className="border-t border-gray-100 pt-4">
            <h4 className="font-semibold text-[#003D5B] mb-3">Book this partnership experience</h4>
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
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-xs text-gray-400 mt-1">You'll enter the amount on the next page</p>
              </div>
              <Button 
                variant="primary" 
                onClick={handleBookNow} 
                disabled={!selectedDate}
              >
                Book Collaboration
              </Button>
            </div>
            
            {/* Login reminder */}
            {!user && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700">
                🔐 You need to log in to book this collaboration. Click "Book Collaboration" to continue to login.
              </div>
            )}
          </div>
        </div>
      </Modal>
      
      {/* Collaboration Customer Details Modal (only shown when logged in) */}
      <CollaborationCustomerDetailsModal
        isOpen={showCustomerModal}
        onClose={handleCloseCustomerModal}
        collaboration={collaboration}
        selectedDate={selectedDate}
        guests={guests}
        totalAmount={0}
      />
    </>
  );
}