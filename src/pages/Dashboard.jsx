import StatCard from '../components/common/StatCard';
import ServiceCard from '../components/common/ServiceCard';
import Button from '../components/common/Button';

const stats = [
  { title: 'Total Bookings', value: '1,284', change: '+12%', changeType: 'up', icon: '📅', accent: '#EDAE49' },
  { title: 'Revenue', value: 'Ksh24,500', change: '+8%', changeType: 'up', icon: '💰', accent: '#00798C' },
  { title: 'Active Services', value: '16', change: '+3', changeType: 'up', icon: '🧩', accent: '#30638E' },
  { title: 'Cancellations', value: '5', change: '-2%', changeType: 'down', icon: '❌', accent: '#D1495B' },
];

const recentBookings = [
  { id: '#BK-001', customer: 'Sarah Mitchell', service: 'Safari Day Tour', date: 'Feb 24, 2026', amount: 'Ksh320', status: 'confirmed' },
  { id: '#BK-002', customer: 'James Omondi', service: 'Beach Getaway Package', date: 'Feb 25, 2026', amount: 'Ksh550', status: 'pending' },
  { id: '#BK-003', customer: 'Aisha Kamau', service: 'Cultural City Walk', date: 'Feb 26, 2026', amount: 'Ksh80', status: 'confirmed' },
  { id: '#BK-004', customer: 'Tom Weber', service: 'Sunset Cruise', date: 'Feb 27, 2026', amount: 'Ksh200', status: 'cancelled' },
  { id: '#BK-005', customer: 'Priya Nair', service: 'Mountain Hiking Trip', date: 'Mar 1, 2026', amount: 'Ksh430', status: 'pending' },
];

const services = [
  { name: 'Safari Day Tour', category: 'Wildlife', price: '280', bookings: 42, status: 'active' },
  { name: 'Beach Getaway Package', category: 'Beach', price: '499', bookings: 28, status: 'active' },
  { name: 'Cultural City Walk', category: 'Culture', price: '65', bookings: 61, status: 'active' },
];

const statusBadge = {
  confirmed: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-[#EDAE49]/20 text-[#b87a00]',
  cancelled: 'bg-[#D1495B]/10 text-[#D1495B]',
};

export default function Dashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#00798C] mb-1">Business Dashboard</p>
          <h1 className="text-3xl font-bold text-[#003D5B]">Good morning, Jane 👋</h1>
          <p className="text-gray-400 text-sm mt-1">Monday, February 23, 2026</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="md" icon="🔔">Notifications</Button>
          <Button variant="primary" size="md" icon="＋">Add Service</Button>
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
            <Button variant="ghost" size="sm">View all →</Button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-[#003D5B]/10 flex items-center justify-center text-[#003D5B] font-bold text-xs">
                    {booking.customer.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#003D5B]">{booking.customer}</p>
                    <p className="text-xs text-gray-400">{booking.service}</p>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-gray-400">{booking.date}</p>
                  <p className="text-sm font-bold text-[#003D5B]">{booking.amount}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ml-3 ${statusBadge[booking.status]}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
            ))}
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
            <Button variant="primary" size="sm" className="w-full justify-center">View Messages</Button>
          </div>
        </div>
      </div>

      {/* Top Services */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-[#003D5B] text-base">Top Services</h2>
          <Button variant="ghost" size="sm">Manage all →</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {services.map((service) => (
            <ServiceCard key={service.name} {...service} />
          ))}
        </div>
      </div>

    </div>
  );
}