import { useState } from 'react';
import Button from '../../components/common/Button';

// Sample booking data for a tourist
const myBookings = [
  {
    id: 'BK-001',
    type: 'service',
    name: 'Masai Mara Safari Adventure',
    business: 'Safari Kenya',
    date: '2026-03-15',
    guests: 2,
    amount: '700',
    status: 'confirmed',
    image: null,
    bookingDate: '2026-02-10'
  },
  {
    id: 'BK-002',
    type: 'package',
    name: 'Beach & Culture Combo',
    business: 'Beach Paradise',
    date: '2026-03-20',
    guests: 4,
    amount: '2996',
    status: 'pending',
    image: null,
    bookingDate: '2026-02-15'
  },
  {
    id: 'BK-003',
    type: 'service',
    name: 'Lamu Old Town Walking Tour',
    business: 'Cultural Tours',
    date: '2026-02-26',
    guests: 1,
    amount: '65',
    status: 'completed',
    image: null,
    bookingDate: '2026-01-20'
  },
  {
    id: 'BK-004',
    type: 'collaboration',
    name: 'Safari & Beach Combo',
    business: 'Safari Kenya + Beach Paradise',
    date: '2026-02-27',
    guests: 2,
    amount: '2398',
    status: 'cancelled',
    image: null,
    bookingDate: '2026-01-25'
  }
];

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
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const today = new Date();
  
  const upcomingBookings = myBookings.filter(b => 
    new Date(b.date) >= today && b.status !== 'cancelled'
  );
  
  const pastBookings = myBookings.filter(b => 
    new Date(b.date) < today || b.status === 'completed'
  );

  const bookingsToShow = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  const handleCancelBooking = (bookingId) => {
    console.log('Cancel booking:', bookingId);
    // Will implement cancellation later
    alert('Cancellation request submitted. Please confirm within 24 hours.');
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    console.log('View booking details:', booking.id);
    // Will open modal later
  };

  const handleLeaveReview = (bookingId) => {
    console.log('Leave review for booking:', bookingId);
    // Will open review modal later
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

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
          {upcomingBookings.length > 0 && activeTab !== 'upcoming' && (
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
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#003D5B]/10 flex items-center justify-center text-xl">
                      {typeIcon[booking.type]}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#003D5B] text-lg">{booking.name}</h3>
                      <p className="text-sm text-gray-500">by {booking.business}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${statusConfig[booking.status].color}`}>
                    <span>{statusConfig[booking.status].icon}</span>
                    {statusConfig[booking.status].label}
                  </span>
                </div>

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
                    <p className="font-bold text-[#EDAE49]">${booking.amount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Booking ID</p>
                    <p className="font-mono text-sm text-gray-500">{booking.id}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-100">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(booking)}
                  >
                    View Details
                  </Button>
                  
                  {booking.status === 'pending' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-[#D1495B] text-[#D1495B] hover:bg-[#D1495B]/5"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancel Request
                    </Button>
                  )}
                  
                  {booking.status === 'confirmed' && new Date(booking.date) > today && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-[#D1495B] text-[#D1495B] hover:bg-[#D1495B]/5"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancel Booking
                    </Button>
                  )}
                  
                  {booking.status === 'completed' && (
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleLeaveReview(booking.id)}
                    >
                      Leave Review
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => console.log('Contact business')}
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
    </div>
  );
}