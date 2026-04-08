import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Modal from '../../common/Modal';
import Button from '../../common/Button';
import PackageCustomerDetailsModal from './PackageCustomerDetailsModal';

export default function PackageDetailModal({ isOpen, onClose, pkg }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [guests, setGuests] = useState(1);
  
  // State for customer details modal
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  
  if (!pkg) return null;

  // Calculate services count safely
  const servicesCount = pkg.services ? pkg.services.length : 0;
  const totalAmount = parseFloat(pkg.price) * guests;

  const handleBookNow = () => {
    if (!selectedDate) return;
    
    // Check if user is logged in
    if (!user) {
      navigate('/login', { state: { from: '/tourist/packages', packageId: pkg.id, returnTo: 'booking' } });
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
      <Modal isOpen={isOpen} onClose={onClose} title={pkg.name} size="lg">
        <div className="space-y-5">
          {/* Business info */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <p className="text-sm text-gray-400">Offered by</p>
              <p className="font-semibold text-[#003D5B]">{pkg.business_name || pkg.business || 'Local Business'}</p>
            </div>
          </div>

          {/* Discount badge */}
          {pkg.discount && (
            <div className="bg-[#EDAE49]/10 border border-[#EDAE49] rounded-xl p-3">
              <p className="text-sm font-semibold text-[#EDAE49]">Save {pkg.discount} on this package!</p>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="font-semibold text-[#003D5B] mb-2">Package details</h4>
            <p className="text-sm text-gray-600">{pkg.description || `Experience ${pkg.name} with this special package deal.`}</p>
          </div>

          {/* Included Services */}
          {pkg.services && pkg.services.length > 0 && (
            <div>
              <h4 className="font-semibold text-[#003D5B] mb-2">Included Services</h4>
              <div className="flex flex-wrap gap-2">
                {pkg.services.map((service, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                    {service.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl">
            <div>
              <p className="text-xs text-gray-400">Duration</p>
              <p className="font-medium text-[#003D5B]">{pkg.duration || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Included Services</p>
              <p className="font-medium text-[#003D5B]">{servicesCount} {servicesCount === 1 ? 'experience' : 'experiences'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Package Price</p>
              <p className="font-bold text-[#EDAE49] text-lg">KSH {pkg.price}</p>
            </div>
          </div>

          {/* Booking form */}
          <div className="border-t border-gray-100 pt-4">
            <h4 className="font-semibold text-[#003D5B] mb-3">Book this package</h4>
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
                <p className="text-xl font-bold text-[#EDAE49]">KSH {totalAmount.toFixed(2)}</p>
              </div>
              <Button variant="primary" onClick={handleBookNow} disabled={!selectedDate}>
                Book Package
              </Button>
            </div>
            
            {/* Login reminder */}
            {!user && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700">
                🔐 You need to log in to book this package. Click "Book Package" to continue to login.
              </div>
            )}
          </div>
        </div>
      </Modal>
      
      {/* Package Customer Details Modal (only shown when logged in) */}
      <PackageCustomerDetailsModal
        isOpen={showCustomerModal}
        onClose={handleCloseCustomerModal}
        package={pkg}
        selectedDate={selectedDate}
        guests={guests}
        totalAmount={totalAmount}
      />
    </>
  );
}