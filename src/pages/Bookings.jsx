// // Bookings.jsx
// export default function Bookings() {
//   return <div className="p-8"><h1 className="text-2xl font-bold text-[#003D5B]">Bookings</h1><p className="text-gray-400 mt-2">Coming soon...</p></div>;
// }

import { useState } from 'react';
import Button from '../components/common/Button';

const bookings = [
  {
    id: '#BK-001',
    customer: 'Sarah Mitchell',
    service: 'Safari Day Tour',
    date: 'Feb 24, 2026',
    time: '09:00 AM',
    amount: '$320',
    status: 'confirmed',
    guests: 2,
  },
  {
    id: '#BK-002',
    customer: 'James Omondi',
    service: 'Beach Getaway Package',
    date: 'Feb 25, 2026',
    time: '11:00 AM',
    amount: '$550',
    status: 'pending',
    guests: 4,
  },
  {
    id: '#BK-003',
    customer: 'Aisha Kamau',
    service: 'Cultural City Walk',
    date: 'Feb 26, 2026',
    time: '10:30 AM',
    amount: '$80',
    status: 'confirmed',
    guests: 1,
  },
  {
    id: '#BK-004',
    customer: 'Tom Weber',
    service: 'Sunset Cruise',
    date: 'Feb 27, 2026',
    time: '04:00 PM',
    amount: '$200',
    status: 'cancelled',
    guests: 2,
  },
  {
    id: '#BK-005',
    customer: 'Priya Nair',
    service: 'Mountain Hiking Trip',
    date: 'Mar 1, 2026',
    time: '07:00 AM',
    amount: '$430',
    status: 'pending',
    guests: 3,
  },
];

const statusColors = {
  confirmed: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-[#EDAE49]/20 text-[#b87a00]',
  cancelled: 'bg-[#D1495B]/10 text-[#D1495B]',
};

export default function Bookings() {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [dateRange, setDateRange] = useState('week');

  const filteredBookings = selectedStatus === 'All' 
    ? bookings 
    : bookings.filter(b => b.status === selectedStatus);

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
          <Button variant="outline" size="md" icon="📅">Calendar View</Button>
          <Button variant="primary" size="md" icon="＋">New Booking</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">Total Bookings</p>
          <p className="text-2xl font-bold text-[#003D5B]">156</p>
          <span className="text-xs text-emerald-500">↑ 12% from last month</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">Pending</p>
          <p className="text-2xl font-bold text-[#EDAE49]">23</p>
          <span className="text-xs text-gray-400">Need attention</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">Confirmed</p>
          <p className="text-2xl font-bold text-emerald-600">118</p>
          <span className="text-xs text-gray-400">Ready to go</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">Cancelled</p>
          <p className="text-2xl font-bold text-[#D1495B]">15</p>
          <span className="text-xs text-gray-400">This month</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search bookings..."
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
            />
          </div>
          <select className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20">
            <option>Filter by service</option>
            <option>Safari Tours</option>
            <option>Beach Packages</option>
            <option>City Walks</option>
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
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#003D5B]">{booking.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#003D5B]/10 flex items-center justify-center text-[#003D5B] font-bold text-xs">
                        {booking.customer.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium">{booking.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{booking.service}</td>
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
                  <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-[#003D5B] transition-colors mr-3">👁️</button>
                    <button className="text-gray-400 hover:text-[#003D5B] transition-colors">✎</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-400">Showing 1-5 of 156 bookings</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-lg border border-gray-200 text-gray-400 hover:border-[#EDAE49] hover:text-[#EDAE49] transition-colors">←</button>
            <button className="px-3 py-1 rounded-lg bg-[#003D5B] text-white">1</button>
            <button className="px-3 py-1 rounded-lg border border-gray-200 text-gray-400 hover:border-[#EDAE49] hover:text-[#EDAE49] transition-colors">2</button>
            <button className="px-3 py-1 rounded-lg border border-gray-200 text-gray-400 hover:border-[#EDAE49] hover:text-[#EDAE49] transition-colors">3</button>
            <button className="px-3 py-1 rounded-lg border border-gray-200 text-gray-400 hover:border-[#EDAE49] hover:text-[#EDAE49] transition-colors">→</button>
          </div>
        </div>
      </div>
    </div>
  );
}