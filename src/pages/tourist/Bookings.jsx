import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import BookingDetailModal from '../../components/tourist/modals/BookingDetailModal';
import CancelBookingModal from '../../components/tourist/modals/CancelBookingModal';
import { fetchBookings } from '../../services/api';

const statusConfig = {
  confirmed: {
    label: 'Confirmed',
    color: 'bg-emerald-100 text-emerald-700',
    icon: '✅'
  },
  pending: {
    label: 'Pending',
    color: 'bg-[#EDAE49]/20 text-[#b87a00]',
    icon: '⏳'
  },
  completed: {
    label: 'Completed',
    color: 'bg-blue-100 text-blue-700',
    icon: '🎉'
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-gray-100 text-gray-500',
    icon: '❌'
  }
};

const typeIcon = {
  service: '🎯',
  package: '📦',
  collaboration: '🤝'
};

export default function Bookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await fetchBookings();
      console.log('Bookings loaded:', response.data);
      setBookings(response.data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
      setError('Could not load your bookings');
    } finally {
      setLoading(false);
    }
  };

  // Filter based on status only
  const upcomingBookings = bookings.filter(booking => 
    booking.status === 'confirmed' || booking.status === 'pending'
  );

  const pastBookings = bookings.filter(booking => 
    booking.status === 'completed' || booking.status === 'cancelled'
  );

  const bookingsToShow = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = (bookingId, reason) => {
    alert(`Cancellation request submitted for booking ${bookingId}`);
    setIsCancelModalOpen(false);
  };

  const handleLeaveReview = (booking) => {
    alert(`Leave a review for ${booking.name}`);
  };

  const handleContactBusiness = (booking) => {
    alert(`Contact ${booking.business}`);
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Loading your trips...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#003D5B] mb-2">My Trips</h1>
        <p className="text-gray-500">Manage your bookings and travel plans</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 text-sm font-medium transition-all relative ${
            activeTab === 'upcoming'
              ? 'text-[#EDAE49]'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Upcoming
          {upcomingBookings.length > 0 && (
            <span className="ml-1 text-xs bg-[#EDAE49] text-white px-1.5 py-0.5 rounded-full">
              {upcomingBookings.length}
            </span>
          )}
          {activeTab === 'upcoming' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#EDAE49]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 text-sm font-medium transition-all relative ${
            activeTab === 'past'
              ? 'text-[#EDAE49]'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Past Trips
          {pastBookings.length > 0 && (
            <span className="ml-1 text-xs bg-gray-400 text-white px-1.5 py-0.5 rounded-full">
              {pastBookings.length}
            </span>
          )}
          {activeTab === 'past' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#EDAE49]" />
          )}
        </button>
      </div>

      {/* Bookings List */}
      {bookingsToShow.length > 0 ? (
        <div className="space-y-4">
          {bookingsToShow.map(booking => (
            <div 
              key={booking.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="p-5">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#003D5B]/10 flex items-center justify-center text-xl">
                      {typeIcon[booking.type] || '🎯'}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#003D5B] text-lg">
                        {typeof booking.service === 'object' ? booking.service.name : booking.service}
                      </h3>
                      <p className="text-sm text-gray-500">
                        by {typeof booking.service === 'object' ? booking.service.business_name : booking.business}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${statusConfig[booking.status]?.color || 'bg-gray-100 text-gray-500'}`}>
                    <span>{statusConfig[booking.status]?.icon || '📌'}</span>
                    {statusConfig[booking.status]?.label || booking.status}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Travel Date</p>
                    <p className="font-medium text-[#003D5B]">{formatDate(booking.date)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Guests</p>
                    <p className="font-medium text-[#003D5B]">{booking.guests} {booking.guests === 1 ? 'person' : 'people'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total Paid</p>
                    <p className="font-bold text-[#EDAE49]">KSH {booking.amount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Booking ID</p>
                    <p className="font-mono text-sm text-gray-500">{booking.booking_id}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-100">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(booking)}
                  >
                    View Details
                  </Button>
                  
                  {(booking.status === 'confirmed' || booking.status === 'pending') && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-[#D1495B] text-[#D1495B] hover:bg-[#D1495B]/5"
                      onClick={() => handleCancelBooking(booking)}
                    >
                      Cancel Booking
                    </Button>
                  )}
                  
                  {booking.status === 'completed' && (
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleLeaveReview(booking)}
                    >
                      Leave Review
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleContactBusiness(booking)}
                  >
                    💬 Contact Business
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">✈️</div>
          <h3 className="text-xl font-bold text-[#003D5B] mb-2">No trips yet</h3>
          <p className="text-gray-400 mb-4">
            {activeTab === 'upcoming' 
              ? 'You have no upcoming trips. Start exploring!'
              : 'You haven\'t completed any trips yet'}
          </p>
          <Button 
            variant="primary" 
            onClick={() => window.location.href = '/tourist/services'}
          >
            Explore Experiences
          </Button>
        </div>
      )}

      {/* Modals */}
      <BookingDetailModal 
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
      />

      <CancelBookingModal 
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}