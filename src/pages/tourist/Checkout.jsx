import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/common/Button';
import { initiateMpesaPayment } from '../../services/api';

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [booking, setBooking] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Payment form state
  const [mpesaNumber, setMpesaNumber] = useState('');
  
  // Debug: Log location state when component mounts
  useEffect(() => {
    console.log("Checkout page loaded");
    console.log("Location state:", location.state);
    
    if (location.state?.booking) {
      console.log("Booking data received:", location.state.booking);
      setBooking(location.state.booking);
      // Pre-fill M-Pesa number if customer phone is available
      if (location.state.booking.customer?.phone) {
        setMpesaNumber(location.state.booking.customer.phone);
      }
    } else {
      console.error("No booking data in location.state");
      // Redirect back to services after 2 seconds
      setTimeout(() => {
        navigate('/tourist/services');
      }, 2000);
    }
  }, [location, navigate]);
  
  if (!booking) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p>No booking data found. Redirecting to services...</p>
      </div>
    );
  }
  
  const handlePayment = async () => {
    if (!mpesaNumber) {
      setPaymentError('Please enter your M-Pesa number');
      return;
    }
    
    setIsProcessing(true);
    setPaymentError('');
    
    // Format phone number
    let formattedPhone = mpesaNumber;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.slice(1);
    } else if (formattedPhone.startsWith('+254')) {
      formattedPhone = formattedPhone.slice(1);
    }
    
    console.log("Initiating payment for booking:", booking.id);
    console.log("Phone:", formattedPhone, "Amount:", booking.amount);
    
    try {
      const response = await initiateMpesaPayment({
        phone: formattedPhone,
        amount: booking.amount,
        business_shortcode: '174379',
        booking_id: booking.id
      });
      
      console.log("Payment response:", response.data);
      
      if (response.data.success) {
        setPaymentSuccess(true);
        // Navigate to bookings page after 3 seconds
        setTimeout(() => {
          navigate('/tourist/bookings');
        }, 3000);
      } else {
        setPaymentError(response.data.message || 'Payment failed. Please try again.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      console.error('Error response:', err.response?.data);
      setPaymentError(err.response?.data?.error || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (paymentSuccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-[#003D5B] mb-2">Payment Initiated!</h2>
          <p className="text-gray-500 mb-4">
            Please check your phone for the M-Pesa STK Push. Enter your PIN to complete payment.
          </p>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-md mx-auto mb-6">
            <p className="text-sm text-gray-400">Booking Reference</p>
            <p className="text-xl font-mono font-bold text-[#EDAE49] mb-2">{booking.booking_id || `BK-${booking.id}`}</p>
            <p className="text-sm text-gray-500">Amount: <span className="font-bold">KES {booking.amount}</span></p>
            <p className="text-sm text-gray-500 mt-2">Phone: {mpesaNumber}</p>
          </div>
          <p className="text-sm text-gray-400">Redirecting to your trips...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#003D5B] mb-2">Complete Your Booking</h1>
      <p className="text-gray-500 mb-8">Secure payment powered by M-Pesa</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-4">
            <h3 className="font-bold text-[#003D5B] mb-4">Booking Summary</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">Experience</p>
                <p className="font-medium text-[#003D5B]">{booking.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Business</p>
                <p className="font-medium text-[#003D5B]">{booking.business}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Date</p>
                <p className="font-medium text-[#003D5B]">{booking.date}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Guests</p>
                <p className="font-medium text-[#003D5B]">{booking.guests} people</p>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <div className="flex justify-between font-bold">
                  <span>Total to Pay</span>
                  <span className="text-[#EDAE49]">KES {booking.amount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-[#003D5B] text-lg mb-4">Payment Method</h3>
            
            {paymentError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                {paymentError}
              </div>
            )}
            
            {/* Customer Info Display */}
            {booking.customer && (
              <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                <p className="text-sm font-medium text-[#003D5B]">Customer: {booking.customer.fullName}</p>
                <p className="text-sm text-gray-500">Email: {booking.customer.email}</p>
              </div>
            )}
            
            {/* M-Pesa Payment */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  M-Pesa Number
                </label>
                <input
                  type="tel"
                  value={mpesaNumber}
                  onChange={(e) => setMpesaNumber(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
                  placeholder="0712345678"
                />
                <p className="text-xs text-gray-400 mt-1">
                  You'll receive an STK Push on this number. Enter your PIN to complete payment.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-sm text-blue-700">
                  💡 Make sure your phone is nearby to complete the payment.
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handlePayment} 
              variant="primary" 
              size="lg" 
              className="w-full mt-6"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : `Pay KES ${booking.amount} with M-Pesa`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}