import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Modal from '../../common/Modal';
import Button from '../../common/Button';
import { createBooking } from '../../../services/api';

export default function CustomerDetailsModal({ isOpen, onClose, service, selectedDate, guests, totalAmount }) {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get logged-in user
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Pre-fill from logged-in user
  const [customerInfo, setCustomerInfo] = useState({
    fullName: user?.username || '',
    email: user?.email || '',
    phone: '',
    specialRequests: ''
  });
  
  // Editable amount
  const [paymentAmount, setPaymentAmount] = useState(totalAmount);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setPaymentAmount(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!customerInfo.fullName || !customerInfo.email || !customerInfo.phone) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (paymentAmount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const bookingData = {
        customer: customerInfo.fullName,
        service: service.id,
        date: selectedDate,
        time: '10:00:00',
        guests: guests,
        amount: paymentAmount,
        status: 'pending'
      };
      
      const bookingResponse = await createBooking(bookingData);
      const booking = bookingResponse.data;
      
      navigate('/tourist/checkout', { 
        state: { 
          booking: {
            id: booking.id,
            booking_id: booking.booking_id,
            name: service.name,
            business: service.business_name || 'Local Business',
            date: selectedDate,
            guests: guests,
            amount: paymentAmount,
            customer: customerInfo,
            service_id: service.id
          }
        } 
      });
      
      onClose();
      
    } catch (err) {
      console.error('Failed to create booking:', err);
      setError('Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Your Details" size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <h3 className="font-semibold text-[#003D5B] text-base">Your Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={customerInfo.fullName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
              placeholder="John Doe"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={customerInfo.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={customerInfo.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
                placeholder="0712345678"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Requests
            </label>
            <textarea
              name="specialRequests"
              value={customerInfo.specialRequests}
              onChange={handleInputChange}
              rows="2"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
              placeholder="Dietary restrictions, accessibility needs, etc."
            />
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-4">
          <h3 className="font-semibold text-[#003D5B] text-base mb-3">Payment Amount</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (KES)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">KES</span>
              <input
                type="number"
                value={paymentAmount}
                onChange={handleAmountChange}
                step="1"
                min="1"
                className="w-full pl-12 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Original price: KES {totalAmount}
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Continue to Payment'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}