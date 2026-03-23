import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/common/Button';

// Sample data for the booking being checked out
const checkoutData = {
  id: 1,
  type: 'service',
  name: 'Masai Mara Safari Adventure',
  business: 'Safari Kenya',
  date: 'March 15, 2026',
  time: '8:00 AM',
  guests: 2,
  price: 350,
  total: 700
};

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Form state
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    nationality: 'Kenyan',
    specialRequests: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    method: 'mpesa',
    mpesaNumber: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    if (customerInfo.fullName && customerInfo.email && customerInfo.phone) {
      setStep(2);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate M-Pesa STK Push
    if (paymentInfo.method === 'mpesa' && paymentInfo.mpesaNumber) {
      // Simulate API call
      setTimeout(() => {
        setIsProcessing(false);
        setPaymentSuccess(true);
        setStep(3);
      }, 2000);
    } else if (paymentInfo.method === 'card') {
      setTimeout(() => {
        setIsProcessing(false);
        setPaymentSuccess(true);
        setStep(3);
      }, 2000);
    }
  };

  const handleBookingComplete = () => {
    navigate('/tourist/bookings');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#003D5B] mb-2">Complete Your Booking</h1>
      <p className="text-gray-500 mb-8">Secure payment powered by M-Pesa</p>

      {/* Steps Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 1 ? 'bg-[#EDAE49] text-[#003D5B]' : 'bg-gray-200 text-gray-500'}`}>
            1
          </div>
          <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-[#EDAE49]' : 'bg-gray-200'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 2 ? 'bg-[#EDAE49] text-[#003D5B]' : 'bg-gray-200 text-gray-500'}`}>
            2
          </div>
          <div className={`w-16 h-0.5 ${step >= 3 ? 'bg-[#EDAE49]' : 'bg-gray-200'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 3 ? 'bg-[#EDAE49] text-[#003D5B]' : 'bg-gray-200 text-gray-500'}`}>
            3
          </div>
        </div>
      </div>

      {/* Step 1: Booking Summary & Customer Info */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-4">
              <h3 className="font-bold text-[#003D5B] mb-4">Booking Summary</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400">Experience</p>
                  <p className="font-medium text-[#003D5B]">{checkoutData.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Business</p>
                  <p className="font-medium text-[#003D5B]">{checkoutData.business}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Date & Time</p>
                  <p className="font-medium text-[#003D5B]">{checkoutData.date} at {checkoutData.time}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Guests</p>
                  <p className="font-medium text-[#003D5B]">{checkoutData.guests} people</p>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span>${checkoutData.total}</span>
                  </div>
                  <div className="flex justify-between font-bold mt-2">
                    <span>Total</span>
                    <span className="text-[#EDAE49]">${checkoutData.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-[#003D5B] text-lg mb-4">Your Information</h3>
              <form onSubmit={handleCustomerSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={customerInfo.fullName}
                    onChange={(e) => setCustomerInfo({...customerInfo, fullName: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
                      placeholder="0712345678"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                  <select
                    value={customerInfo.nationality}
                    onChange={(e) => setCustomerInfo({...customerInfo, nationality: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
                  >
                    <option>Kenyan</option>
                    <option>Ugandan</option>
                    <option>Tanzanian</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                  <textarea
                    rows="3"
                    value={customerInfo.specialRequests}
                    onChange={(e) => setCustomerInfo({...customerInfo, specialRequests: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
                    placeholder="Dietary restrictions, accessibility needs, etc."
                  />
                </div>
                <Button type="submit" variant="primary" size="lg" className="w-full">
                  Continue to Payment
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Payment */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-4">
              <h3 className="font-bold text-[#003D5B] mb-4">Booking Summary</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400">Experience</p>
                  <p className="font-medium text-[#003D5B]">{checkoutData.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Date</p>
                  <p className="font-medium text-[#003D5B]">{checkoutData.date}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Guests</p>
                  <p className="font-medium text-[#003D5B]">{checkoutData.guests} people</p>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between font-bold">
                    <span>Total to Pay</span>
                    <span className="text-[#EDAE49]">${checkoutData.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-[#003D5B] text-lg mb-4">Payment Method</h3>
              
              {/* Payment Method Selection */}
              <div className="flex gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentInfo({...paymentInfo, method: 'mpesa'})}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    paymentInfo.method === 'mpesa'
                      ? 'border-[#EDAE49] bg-[#EDAE49]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">📱</div>
                  <p className="font-medium">M-Pesa</p>
                  <p className="text-xs text-gray-400">Pay with mobile money</p>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentInfo({...paymentInfo, method: 'card'})}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    paymentInfo.method === 'card'
                      ? 'border-[#EDAE49] bg-[#EDAE49]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">💳</div>
                  <p className="font-medium">Card</p>
                  <p className="text-xs text-gray-400">Visa, Mastercard, Amex</p>
                </button>
              </div>

              {paymentInfo.method === 'mpesa' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Number</label>
                    <input
                      type="tel"
                      value={paymentInfo.mpesaNumber}
                      onChange={(e) => setPaymentInfo({...paymentInfo, mpesaNumber: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
                      placeholder="0712345678"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      You'll receive an STK Push on your phone. Enter your PIN to complete payment.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-sm text-blue-700">💡 Tip: Make sure your phone is nearby to complete the payment.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={paymentInfo.expiry}
                        onChange={(e) => setPaymentInfo({...paymentInfo, expiry: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="text"
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              )}

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
                    Processing Payment...
                  </span>
                ) : `Pay $${checkoutData.total}`}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-[#003D5B] mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 mb-4">
            Your booking has been confirmed. A confirmation email has been sent to {customerInfo.email}
          </p>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-md mx-auto mb-6">
            <p className="text-sm text-gray-400">Booking Reference</p>
            <p className="text-xl font-mono font-bold text-[#EDAE49] mb-2">#BK-{Math.floor(Math.random() * 1000)}</p>
            <p className="text-sm text-gray-500">Amount Paid: <span className="font-bold">${checkoutData.total}</span></p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate('/tourist/bookings')}>
              View My Trips
            </Button>
            <Button variant="primary" onClick={handleBookingComplete}>
              Continue Exploring
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}