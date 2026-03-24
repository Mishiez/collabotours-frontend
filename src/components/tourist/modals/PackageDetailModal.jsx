import { useState } from 'react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';

export default function PackageDetailModal({ isOpen, onClose, pkg }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [guests, setGuests] = useState(1);
  
  if (!pkg) return null;

  // Calculate services count safely
  const servicesCount = pkg.services ? pkg.services.length : 0;

  return (
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
            <p className="font-bold text-[#EDAE49] text-lg">${pkg.price}</p>
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
              <p className="text-xl font-bold text-[#EDAE49]">${(parseFloat(pkg.price) * guests).toFixed(2)}</p>
            </div>
            <Button variant="primary" onClick={() => onClose()} disabled={!selectedDate}>
              Book Package
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}