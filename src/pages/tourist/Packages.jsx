import { useState } from 'react';
import TouristPackageCard from '../../components/tourist/TouristPackageCard';
import PackageDetailModal from '../../components/tourist/modals/PackageDetailModal';
import Button from '../../components/common/Button';

// All packages from all businesses
const allPackages = [
  {
    id: 1,
    name: 'Ultimate Safari Experience',
    price: '899',
    originalPrice: '1050',
    duration: '4 days',
    services: 3,
    business: 'Safari Kenya',
    rating: 4.9,
    discount: '15%',
    image: null,
    description: 'Experience the best of Masai Mara with this comprehensive safari package'
  },
  {
    id: 2,
    name: 'Beach & Culture Combo',
    price: '749',
    originalPrice: '830',
    duration: '5 days',
    services: 3,
    business: 'Beach Paradise',
    rating: 4.7,
    discount: '10%',
    image: null,
    description: 'Combine beach relaxation with cultural experiences in Mombasa'
  },
  {
    id: 3,
    name: 'Adventure Week',
    price: '1299',
    originalPrice: '1620',
    duration: '7 days',
    services: 4,
    business: 'Cultural Tours',
    rating: 4.8,
    discount: '20%',
    image: null,
    description: 'A week of adventure combining wildlife, hiking, and cultural tours'
  },
  {
    id: 4,
    name: 'Romantic Beach Escape',
    price: '599',
    originalPrice: '720',
    duration: '3 days',
    services: 2,
    business: 'Beach Paradise',
    rating: 4.9,
    discount: '17%',
    image: null,
    description: 'Perfect for couples - private beach dinner, sunset cruise, luxury accommodation'
  },
  {
    id: 5,
    name: 'Family Safari Adventure',
    price: '1099',
    originalPrice: '1350',
    duration: '5 days',
    services: 4,
    business: 'Safari Kenya',
    rating: 4.8,
    discount: '19%',
    image: null,
    description: 'Kid-friendly safari experience with educational activities'
  }
];

// Filter categories (by business or type)
const categories = [
  'All',
  'Safari',
  'Beach',
  'Culture',
  'Adventure',
  'Romantic',
  'Family'
];

// Sort options
const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'discount', label: 'Biggest Discount' },
  { value: 'rating', label: 'Highest Rated' }
];

export default function Packages() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter packages
  let filteredPackages = allPackages.filter(pkg => {
    const matchesCategory = selectedCategory === 'All' || 
      pkg.name.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      pkg.business.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pkg.business.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort packages
  filteredPackages = [...filteredPackages].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price_high':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'discount':
        return parseFloat(b.discount) - parseFloat(a.discount);
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const handleViewPackage = (pkg) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#003D5B] mb-2">Special Packages</h1>
        <p className="text-gray-500">Bundle deals for better value on your Kenyan adventure</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-xl">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search packages..."
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
          Showing <span className="font-semibold text-[#003D5B]">{filteredPackages.length}</span> packages
        </p>
      </div>

      {/* Packages Grid */}
      {filteredPackages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map(pkg => (
            <TouristPackageCard 
              key={pkg.id} 
              {...pkg} 
              onViewDetails={() => handleViewPackage(pkg)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-bold text-[#003D5B] mb-2">No packages found</h3>
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

      {/* Package Detail Modal */}
      <PackageDetailModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPackage(null);
        }}
        pkg={selectedPackage}
      />
    </div>
  );
}