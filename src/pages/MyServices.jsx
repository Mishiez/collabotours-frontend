// // MyServices.jsx
// export default function MyServices() {
//   return <div className="p-8"><h1 className="text-2xl font-bold text-[#003D5B]">My Services</h1><p className="text-gray-400 mt-2">Coming soon...</p></div>;
// }

import { useState } from 'react';
import Button from '../components/common/Button';
import ServiceCard from '../components/common/ServiceCard';

// Mock data - will be replaced with API data later
const allServices = [
  { 
    id: 1,
    name: 'Safari Day Tour', 
    category: 'Wildlife', 
    price: '280', 
    bookings: 42, 
    status: 'active',
    description: 'Full day safari experience with lunch included',
    location: 'Nairobi National Park'
  },
  { 
    id: 2,
    name: 'Beach Getaway Package', 
    category: 'Beach', 
    price: '499', 
    bookings: 28, 
    status: 'active',
    description: '3-day beach retreat with luxury accommodation',
    location: 'Diani Beach'
  },
  { 
    id: 3,
    name: 'Cultural City Walk', 
    category: 'Culture', 
    price: '65', 
    bookings: 61, 
    status: 'pending',
    description: 'Guided tour through historic neighborhoods',
    location: 'Mombasa Old Town'
  },
  { 
    id: 4,
    name: 'Sunset Cruise', 
    category: 'Water Activities', 
    price: '200', 
    bookings: 15, 
    status: 'inactive',
    description: 'Evening cruise with dinner and drinks',
    location: 'Lamu Island'
  },
  { 
    id: 5,
    name: 'Mountain Hiking Trip', 
    category: 'Adventure', 
    price: '430', 
    bookings: 8, 
    status: 'active',
    description: '2-day guided hike with camping equipment',
    location: 'Mount Kenya'
  },
  { 
    id: 6,
    name: 'Hot Air Balloon Ride', 
    category: 'Adventure', 
    price: '450', 
    bookings: 12, 
    status: 'pending',
    description: 'Early morning balloon safari with champagne breakfast',
    location: 'Masai Mara'
  },
];

const categories = ['All', 'Wildlife', 'Beach', 'Culture', 'Adventure', 'Water Activities'];
const statusFilters = ['All', 'active', 'pending', 'inactive'];

export default function MyServices() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Filter services based on category, status, and search
  const filteredServices = allServices.filter(service => {
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || service.status === selectedStatus;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#00798C] mb-1">
            Service Management
          </p>
          <h1 className="text-3xl font-bold text-[#003D5B]">My Services</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage and monitor all your tour services
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="primary" size="md" icon="＋">Add New Service</Button>
          <Button variant="outline" size="md" icon="📊">Export</Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20 focus:border-[#EDAE49] transition-all"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-[#EDAE49] text-[#003D5B]'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 border-l border-gray-200 pl-4">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-[#003D5B] text-white' : 'text-gray-400 hover:text-[#003D5B]'
              }`}
            >
              ⊞
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-[#003D5B] text-white' : 'text-gray-400 hover:text-[#003D5B]'
              }`}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
          {statusFilters.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedStatus === status
                  ? status === 'All' 
                    ? 'bg-[#003D5B] text-white'
                    : status === 'active'
                    ? 'bg-emerald-100 text-emerald-700'
                    : status === 'pending'
                    ? 'bg-[#EDAE49]/20 text-[#b87a00]'
                    : 'bg-gray-100 text-gray-500'
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-[#003D5B]">{filteredServices.length}</span> services
        </p>
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20">
          <option>Sort by: Newest</option>
          <option>Sort by: Price: Low to High</option>
          <option>Sort by: Price: High to Low</option>
          <option>Sort by: Most Booked</option>
        </select>
      </div>

      {/* Services Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-4">Service</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-1">Price</div>
            <div className="col-span-1">Bookings</div>
            <div className="col-span-2">Location</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Actions</div>
          </div>
          <div className="divide-y divide-gray-100">
            {filteredServices.map((service) => (
              <div key={service.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors">
                <div className="col-span-4">
                  <p className="font-semibold text-[#003D5B]">{service.name}</p>
                  <p className="text-xs text-gray-400 truncate">{service.description}</p>
                </div>
                <div className="col-span-2 text-sm text-gray-600">{service.category}</div>
                <div className="col-span-1 font-bold text-[#EDAE49]">${service.price}</div>
                <div className="col-span-1 font-semibold text-[#30638E]">{service.bookings}</div>
                <div className="col-span-2 text-sm text-gray-500">{service.location}</div>
                <div className="col-span-1">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    service.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                    service.status === 'pending' ? 'bg-[#EDAE49]/20 text-[#b87a00]' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {service.status}
                  </span>
                </div>
                <div className="col-span-1">
                  <button className="text-gray-400 hover:text-[#003D5B] transition-colors">✎</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}