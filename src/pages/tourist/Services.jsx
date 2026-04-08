import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';  // ADD THIS
import TouristServiceCard from '../../components/tourist/TouristServiceCard';
import ServiceDetailModal from '../../components/tourist/modals/ServiceDetailModal';
import Button from '../../components/common/Button';
import { fetchPublicServices } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// Filter categories (based on backend categories)
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
  { value: 'popular', label: 'Most Popular' }
];

export default function Services() {
  const location = useLocation();  // ADD THIS - to read URL parameters
  
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // READ URL PARAMETERS ON PAGE LOAD
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const searchParam = params.get('search');
    
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
    
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);

  // Fetch services from backend
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await fetchPublicServices();
      console.log('Services loaded:', response.data);
      setServices(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to load services:', err);
      setError('Could not load services. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Filter services
  let filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (service.business_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (service.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort services
  filteredServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price_high':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'popular':
        return (b.bookings_count || 0) - (a.bookings_count || 0);
      default:
        return 0;
    }
  });

  const handleViewService = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Loading experiences...</p>
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
            className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/50 bg-gray"
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
              id={service.id}
              name={service.name}
              category={service.category}
              price={service.price}
              business={service.business_name || 'Local Business'}
              location={service.location}
              description={service.description}
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