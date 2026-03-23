import { useState } from 'react';
import TouristServiceCard from '../../components/tourist/TouristServiceCard';
import ServiceDetailModal from '../../components/tourist/modals/ServiceDetailModal';
import Button from '../../components/common/Button';

// All services from all businesses
const allServices = [
  {
    id: 1,
    name: 'Masai Mara Safari Adventure',
    category: 'Wildlife',
    price: '350',
    bookings: 156,
    image: null,
    business: 'Safari Kenya',
    rating: 4.9,
    duration: 'Full day',
    location: 'Masai Mara',
    description: 'Full-day safari in Masai Mara with experienced guides. Includes lunch, park fees, and transport from Nairobi.'
  },
  {
    id: 2,
    name: 'Diani Beach Getaway',
    category: 'Beach',
    price: '499',
    bookings: 234,
    image: null,
    business: 'Beach Paradise',
    rating: 4.8,
    duration: '3 days',
    location: 'Diani Beach',
    description: '3-day beach retreat including luxury accommodation, snorkeling, and sunset dhow cruise.'
  },
  {
    id: 3,
    name: 'Hot Air Balloon Safari',
    category: 'Adventure',
    price: '450',
    bookings: 89,
    image: null,
    business: 'Safari Kenya',
    rating: 4.9,
    duration: '3 hours',
    location: 'Masai Mara',
    description: 'Sunrise balloon ride over the Masai Mara with champagne breakfast.'
  },
  {
    id: 4,
    name: 'Lamu Old Town Walking Tour',
    category: 'Culture',
    price: '65',
    bookings: 178,
    image: null,
    business: 'Cultural Tours',
    rating: 4.8,
    duration: 'Half day',
    location: 'Lamu Island',
    description: 'Guided tour through historic Lamu Town, a UNESCO World Heritage site.'
  },
  {
    id: 5,
    name: 'Watersports Package',
    category: 'Water Activities',
    price: '180',
    bookings: 312,
    image: null,
    business: 'Beach Paradise',
    rating: 4.7,
    duration: 'Full day',
    location: 'Diani Beach',
    description: 'Jet skiing, parasailing, and banana boat rides. All equipment included.'
  },
  {
    id: 6,
    name: 'Swahili Cooking Class',
    category: 'Culture',
    price: '85',
    bookings: 67,
    image: null,
    business: 'Cultural Tours',
    rating: 4.9,
    duration: '3 hours',
    location: 'Mombasa',
    description: 'Learn to cook traditional Swahili dishes with local chefs. Includes market visit and lunch.'
  }
];

// Filter categories
const categories = [
  'All',
  'Wildlife',
  'Beach',
  'Culture',
  'Adventure',
  'Water Activities'
];

// Sort options
const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' }
];

export default function Services() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter services
  let filteredServices = allServices.filter(service => {
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.business.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort services
  filteredServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price_high':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'rating':
        return b.rating - a.rating;
      case 'popular':
        return b.bookings - a.bookings;
      default:
        return 0;
    }
  });

  const handleViewService = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#003D5B] mb-2">Explore Experiences</h1>
        <p className="text-gray-500">Discover amazing tours and activities from local businesses</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-xl">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search by experience, business, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/50"
          />
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-[#EDAE49] text-[#003D5B]'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/50 bg-white"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-[#003D5B]">{filteredServices.length}</span> experiences
        </p>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <TouristServiceCard 
              key={service.id} 
              {...service} 
              onViewDetails={() => handleViewService(service)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-[#003D5B] mb-2">No experiences found</h3>
          <p className="text-gray-400">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-4 text-[#00798C] hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Service Detail Modal */}
      <ServiceDetailModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedService(null);
        }}
        service={selectedService}
      />
    </div>
  );
}