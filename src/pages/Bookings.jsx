import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import BookingDetailsModal from '../components/modals/BookingDetailsModal';
import EditBookingModal from '../components/modals/EditBookingModal';
import NewBookingModal from '../components/modals/NewBookingModal';
import CalendarViewModel from '../components/modals/CalendarViewModel';
import { 
  fetchBookings, 
  createBooking, 
  updateBooking, 
  updateBookingStatus,
  deleteBooking,
  fetchServices 
} from '../services/api';

// const initialBookings = [
//   {
//     id: '#BK-001',
//     customer: 'Sarah Mitchell',
//     service: 'Safari Day Tour',
//     date: 'Feb 24, 2026',
//     time: '09:00 AM',
//     amount: '$320',
//     status: 'confirmed',
//     guests: 2,
//   },
//   {
//     id: '#BK-002',
//     customer: 'James Omondi',
//     service: 'Beach Getaway Package',
//     date: 'Feb 25, 2026',
//     time: '11:00 AM',
//     amount: '$550',
//     status: 'pending',
//     guests: 4,
//   },
//   {
//     id: '#BK-003',
//     customer: 'Aisha Kamau',
//     service: 'Cultural City Walk',
//     date: 'Feb 26, 2026',
//     time: '10:30 AM',
//     amount: '$80',
//     status: 'confirmed',
//     guests: 1,
//   },
//   {
//     id: '#BK-004',
//     customer: 'Tom Weber',
//     service: 'Sunset Cruise',
//     date: 'Feb 27, 2026',
//     time: '04:00 PM',
//     amount: '$200',
//     status: 'cancelled',
//     guests: 2,
//   },
//   {
//     id: '#BK-005',
//     customer: 'Priya Nair',
//     service: 'Mountain Hiking Trip',
//     date: 'Mar 1, 2026',
//     time: '07:00 AM',
//     amount: '$430',
//     status: 'pending',
//     guests: 3,
//   },
// ];

const statusColors = {
  confirmed: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-[#EDAE49]/20 text-[#b87a00]',
  cancelled: 'bg-[#D1495B]/10 text-[#D1495B]',
};

export default function Bookings() {
  const navigate = useNavigate();
  
  // State for bookings data
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [dateRange, setDateRange] = useState('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('All');
  
  // Modal states
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [isCalendarViewOpen, setIsCalendarViewOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch bookings from backend
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
      setError('Could not load bookings');
    } finally {
      setLoading(false);
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = selectedStatus === 'All' || booking.status === selectedStatus;
    const matchesSearch = booking.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesService = serviceFilter === 'All' || booking.service === serviceFilter;
    return matchesStatus && matchesSearch && matchesService;
  });

  // Get unique services for filter dropdown
  const uniqueServices = ['All', ...new Set(bookings.map(b => 
    typeof b.service === 'object' ? b.service.name : b.service
  ))];

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setIsEditModalOpen(true);
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      // Update local state
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status');
    }
  };

  const handleUpdateBooking = async (bookingId, updatedData) => {
    try {
      const response = await updateBooking(bookingId, updatedData);
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId ? response.data : booking
        )
      );
    } catch (err) {
      console.error('Failed to update booking:', err);
      alert('Failed to update booking');
    }
  };

  const handleAddBooking = async (newBooking) => {
    try {
      // First, get all services to find the ID for the selected service name
      const servicesResponse = await fetchServices();
      const services = servicesResponse.data;
      
      // DEBUG: Log what we got
      console.log('All services from DB:', services);
      console.log('Looking for service name:', newBooking.service);
      
      // Find the service ID that matches the selected service name
      const selectedService = services.find(s => s.name === newBooking.service);
      
      if (!selectedService) {
        alert('Selected service not found');
        return;
      }
      
      // Format the data properly for the backend
      const bookingForBackend = {
        customer: newBooking.customer,
        service: selectedService.id,  // Send ID, not name!
        date: newBooking.date,
        time: newBooking.time,
        guests: parseInt(newBooking.guests),  // Ensure it's a number
        amount: parseFloat(newBooking.amount.replace('$', '')),  // Remove $ and convert to number
        status: newBooking.status || 'pending',
        // Don't send id - let backend generate it
        // Don't send booking_id - let backend generate it
      };
      
      console.log('Sending to backend:', bookingForBackend);
      const response = await createBooking(bookingForBackend);
      console.log('Booking created:', response.data);
      
      // Add the new booking to the list
      setBookings(prev => [response.data, ...prev]);
      
    } catch (err) {
      console.error('Failed to create booking:', err);
      console.error('Error response:', err.response?.data);
      alert('Failed to create booking. Please check your data and try again.');
    }
  };

  const handleStatCardClick = (status) => {
    setSelectedStatus(status);
  };

  // Calculate stats
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const cancelledCount = bookings.filter(b => b.status === 'cancelled').length;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#00798C] mb-1">
            Booking Management
          </p>
          <h1 className="text-3xl font-bold text-[#003D5B]">Bookings</h1>
          <p className="text-gray-400 text-sm mt-1">Track and manage all customer bookings</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="md" 
            icon="📅"
            onClick={() => setIsCalendarViewOpen(true)}
          >
            Calendar View
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            icon="＋"
            onClick={() => setIsNewBookingModalOpen(true)}
          >
            New Booking
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div 
          className="bg-white rounded-xl p-4 border border-gray-100 cursor-pointer hover:shadow-md transition-all"
          onClick={() => handleStatCardClick('All')}
        >
          <p className="text-xs text-gray-400 mb-1">Total Bookings</p>
          <p className="text-2xl font-bold text-[#003D5B]">{totalBookings}</p>
          <span className="text-xs text-emerald-500">↑ 12% from last month</span>
        </div>
        <div 
          className="bg-white rounded-xl p-4 border border-gray-100 cursor-pointer hover:shadow-md transition-all"
          onClick={() => handleStatCardClick('pending')}
        >
          <p className="text-xs text-gray-400 mb-1">Pending</p>
          <p className="text-2xl font-bold text-[#EDAE49]">{pendingCount}</p>
          <span className="text-xs text-gray-400">Need attention</span>
        </div>
        <div 
          className="bg-white rounded-xl p-4 border border-gray-100 cursor-pointer hover:shadow-md transition-all"
          onClick={() => handleStatCardClick('confirmed')}
        >
          <p className="text-xs text-gray-400 mb-1">Confirmed</p>
          <p className="text-2xl font-bold text-emerald-600">{confirmedCount}</p>
          <span className="text-xs text-gray-400">Ready to go</span>
        </div>
        <div 
          className="bg-white rounded-xl p-4 border border-gray-100 cursor-pointer hover:shadow-md transition-all"
          onClick={() => handleStatCardClick('cancelled')}
        >
          <p className="text-xs text-gray-400 mb-1">Cancelled</p>
          <p className="text-2xl font-bold text-[#D1495B]">{cancelledCount}</p>
          <span className="text-xs text-gray-400">This month</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search bookings by customer or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
            />
          </div>
          <select 
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
          >
            {uniqueServices.map(service => (
              <option key={service} value={service}>
                {service === 'All' ? 'All Services' : service}
              </option>
            ))}
          </select>
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {/* Status tabs */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
          {['All', 'confirmed', 'pending', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                selectedStatus === status
                  ? status === 'All' 
                    ? 'bg-[#003D5B] text-white'
                    : statusColors[status]
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Guests</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedBookings.map((booking) => (
                <tr 
                  key={booking.id} 
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleViewDetails(booking)}
                >
                  <td className="px-6 py-4 font-medium text-[#003D5B]">{booking.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#003D5B]/10 flex items-center justify-center text-[#003D5B] font-bold text-xs">
                        {booking.customer.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium">{booking.customer}</span>
                    </div>
                  </td>
                  {/* <td className="px-6 py-4 text-sm">{booking.service}</td> */}
                  <td className="px-6 py-4 text-sm">
                    {typeof booking.service === 'object' ? booking.service.name : booking.service}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium">{booking.date}</p>
                      <p className="text-xs text-gray-400">{booking.time}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#EDAE49]">{booking.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[booking.status]}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="text-gray-400 hover:text-[#003D5B] transition-colors mr-3"
                      onClick={() => handleViewDetails(booking)}
                    >
                      👁️
                    </button>
                    <button 
                      className="text-gray-400 hover:text-[#003D5B] transition-colors"
                      onClick={() => handleEdit(booking)}
                    >
                      ✎
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing {((currentPage - 1) * itemsPerPage) + 1}-
            {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length} bookings
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg border border-gray-200 text-gray-400 hover:border-[#EDAE49] hover:text-[#EDAE49] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ←
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  currentPage === i + 1 
                    ? 'bg-[#003D5B] text-white' 
                    : 'border border-gray-200 text-gray-400 hover:border-[#EDAE49] hover:text-[#EDAE49]'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg border border-gray-200 text-gray-400 hover:border-[#EDAE49] hover:text-[#EDAE49] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <BookingDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        onUpdateStatus={handleUpdateStatus}
      />

      <EditBookingModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        onUpdate={handleUpdateBooking}
      />

      <NewBookingModal 
        isOpen={isNewBookingModalOpen}
        onClose={() => setIsNewBookingModalOpen(false)}
        onAdd={handleAddBooking}
      />

      <CalendarViewModel 
        isOpen={isCalendarViewOpen}
        onClose={() => setIsCalendarViewOpen(false)}
        bookings={bookings}
      />
    </div>
  );
}