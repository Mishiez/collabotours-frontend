import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/common/StatCard';
import ServiceCard from '../../components/common/ServiceCard';
import Button from '../../components/common/Button';
import ManageServiceModal from '../../components/modals/ManageServiceModal';
import { fetchDashboardStats, fetchRecentBookings, fetchTopServices } from '../../services/api';

const statusBadge = {
  confirmed: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-[#EDAE49]/20 text-[#b87a00]',
  cancelled: 'bg-[#D1495B]/10 text-[#D1495B]',
};

export default function Dashboard() {
  const navigate = useNavigate();
  
  // State for dashboard data
  const [stats, setStats] = useState([
    { title: 'Total Bookings', value: '0', change: '+0%', changeType: 'up', icon: '📅', accent: '#EDAE49' },
    { title: 'Revenue', value: 'Ksh0', change: '+0%', changeType: 'up', icon: '💰', accent: '#00798C' },
    { title: 'Active Services', value: '0', change: '+0', changeType: 'up', icon: '🧩', accent: '#30638E' },
    { title: 'Cancellations', value: '0', change: '0', changeType: 'down', icon: '❌', accent: '#D1495B' },
  ]);
  
  const [recentBookings, setRecentBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [statsResponse, bookingsResponse, servicesResponse] = await Promise.all([
        fetchDashboardStats(),
        fetchRecentBookings(),
        fetchTopServices()
      ]);
      
      console.log('Dashboard stats:', statsResponse.data);
      console.log('Recent bookings:', bookingsResponse.data);
      console.log('Top services:', servicesResponse.data);
      
      // Update stats
      const newStats = [
        { 
          title: 'Total Bookings', 
          value: statsResponse.data.total_bookings?.toLocaleString() || '0', 
          change: '+12%', 
          changeType: 'up', 
          icon: '📅', 
          accent: '#EDAE49' 
        },
        { 
          title: 'Revenue', 
          value: statsResponse.data.total_revenue || 'Ksh0', 
          change: '+8%', 
          changeType: 'up', 
          icon: '💰', 
          accent: '#00798C' 
        },
        { 
          title: 'Active Services', 
          value: statsResponse.data.active_services?.toString() || '0', 
          change: '+3', 
          changeType: 'up', 
          icon: '🧩', 
          accent: '#30638E' 
        },
        { 
          title: 'Cancellations', 
          value: statsResponse.data.cancellations?.toString() || '0', 
          change: '-2%', 
          changeType: 'down', 
          icon: '❌', 
          accent: '#D1495B' 
        },
      ];
      
      setStats(newStats);
      setRecentBookings(bookingsResponse.data);
      setServices(servicesResponse.data);
      setError(null);
      
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Could not load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Handle manage service click
  const handleManageService = (service) => {
    setSelectedService(service);
    setIsManageModalOpen(true);
  };

  // Handle updating service
  const handleUpdateService = (updatedService) => {
    setServices(prevServices => 
      prevServices.map(service => 
        service.id === updatedService.id ? updatedService : service
      )
    );
  };

  // Handle deleting service
  const handleDeleteService = (serviceId) => {
    setServices(prevServices => 
      prevServices.filter(service => service.id !== serviceId)
    );
  };

  // Helper functions for formatting
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatAmount = (amount, currency = 'Ksh') => {
    return `${currency}${parseFloat(amount).toFixed(0)}`;
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#00798C] mb-1">Business Dashboard</p>
          <h1 className="text-3xl font-bold text-[#003D5B]">Good morning, Jane 👋</h1>
          <p className="text-gray-400 text-sm mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="md" icon="🔔" onClick={() => navigate('/messages')}>Notifications</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

        {/* Recent Bookings - takes 2 cols */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <h2 className="font-bold text-[#003D5B] text-base">Recent Bookings</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/bookings')}>View all →</Button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-[#003D5B]/10 flex items-center justify-center text-[#003D5B] font-bold text-xs">
                      {getInitials(booking.customer)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#003D5B]">{booking.customer}</p>
                      <p className="text-xs text-gray-400">
                        {typeof booking.service === 'object' ? booking.service.name : booking.service}
                      </p>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-400">{formatDate(booking.date)}</p>
                    <p className="text-sm font-bold text-[#003D5B]">{formatAmount(booking.amount)}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ml-3 ${statusBadge[booking.status] || 'bg-gray-100 text-gray-500'}`}>
                    {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Unknown'}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-400">
                No recent bookings found
              </div>
            )}
          </div>
        </div>

        {/* Quick stats / Activity sidebar */}
        <div className="flex flex-col gap-5">

          {/* Revenue breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-[#003D5B] text-base mb-4">Revenue Breakdown</h2>
            {[
              { label: 'Safari Tours', pct: 45, color: '#EDAE49' },
              { label: 'Beach Packages', pct: 30, color: '#00798C' },
              { label: 'City Walks', pct: 15, color: '#30638E' },
              { label: 'Other', pct: 10, color: '#D1495B' },
            ].map((item) => (
              <div key={item.label} className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500 font-medium">{item.label}</span>
                  <span className="font-bold text-[#003D5B]">{item.pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Messages teaser */}
          <div className="bg-gradient-to-br from-[#003D5B] to-[#30638E] rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-base">Messages</h2>
              <span className="bg-[#EDAE49] text-[#003D5B] text-xs font-bold px-2 py-0.5 rounded-full">3 new</span>
            </div>
            <p className="text-white/60 text-xs mb-4">You have unread messages from potential collaborators.</p>
            <Button variant="primary" size="sm" className="w-full justify-center" onClick={() => navigate('/messages')}>View Messages</Button>
          </div>
        </div>
      </div>

      {/* Top Services */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-[#003D5B] text-base">Top Services</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/services')}>Manage all →</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {services.length > 0 ? (
            services.map((service) => (
              <ServiceCard 
                key={service.id} 
                {...service} 
                onManage={() => handleManageService(service)}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-400">
              No services found
            </div>
          )}
        </div>
      </div>

      {/* Manage Service Modal */}
      <ManageServiceModal 
        isOpen={isManageModalOpen}
        onClose={() => {
          setIsManageModalOpen(false);
          setSelectedService(null);
        }}
        service={selectedService}
        onUpdate={handleUpdateService}
        onDelete={handleDeleteService}
      />
    </div>
  );
}