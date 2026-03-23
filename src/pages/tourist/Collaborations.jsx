import { useState } from 'react';
import Button from '../../components/common/Button';

// Sample collaborations data
const collaborations = [
  {
    id: 1,
    name: 'Safari & Beach Combo',
    businesses: [
      { name: 'Safari Kenya', id: 1, type: 'Wildlife' },
      { name: 'Beach Paradise', id: 2, type: 'Beach' }
    ],
    price: '1199',
    originalPrice: '1450',
    description: 'Experience the best of both worlds! Start with a 3-day safari in Masai Mara, then relax for 2 days at Diani Beach. Includes all transport, accommodation, and select meals.',
    duration: '5 days',
    rating: 4.9,
    reviews: 45,
    discount: '17%',
    image: null,
    highlights: [
      'Full-day safari in Masai Mara',
      'Luxury beach resort accommodation',
      'Sunset dhow cruise',
      'All transport between locations'
    ]
  },
  {
    id: 2,
    name: 'Cultural Safari Experience',
    businesses: [
      { name: 'Safari Kenya', id: 1, type: 'Wildlife' },
      { name: 'Cultural Tours', id: 3, type: 'Culture' }
    ],
    price: '899',
    originalPrice: '1040',
    description: 'Combine wildlife viewing with authentic cultural experiences. Visit Masai Mara for game drives, then explore the rich heritage of the Swahili coast.',
    duration: '4 days',
    rating: 4.8,
    reviews: 32,
    discount: '14%',
    image: null,
    highlights: [
      'Game drives in Masai Mara',
      'Visit to a traditional Maasai village',
      'Swahili cooking class',
      'Lamu Old Town tour'
    ]
  },
  {
    id: 3,
    name: 'Adventure & Culture',
    businesses: [
      { name: 'Mountain Guides', id: 4, type: 'Adventure' },
      { name: 'Cultural Tours', id: 3, type: 'Culture' }
    ],
    price: '1499',
    originalPrice: '1780',
    description: 'For the adventurous soul. Hike Mount Kenya, then immerse yourself in local culture with expert guides.',
    duration: '7 days',
    rating: 4.9,
    reviews: 28,
    discount: '16%',
    image: null,
    highlights: [
      'Mount Kenya hiking expedition',
      'Cultural village visits',
      'Traditional music and dance',
      'Local cuisine tasting'
    ]
  },
  {
    id: 4,
    name: 'Beach & Culture Wellness',
    businesses: [
      { name: 'Beach Paradise', id: 2, type: 'Beach' },
      { name: 'Cultural Tours', id: 3, type: 'Culture' }
    ],
    price: '1099',
    originalPrice: '1290',
    description: 'Relax and rejuvenate with beach wellness activities combined with cultural immersion.',
    duration: '6 days',
    rating: 4.7,
    reviews: 19,
    discount: '15%',
    image: null,
    highlights: [
      'Yoga sessions on the beach',
      'Swahili spa treatments',
      'Cultural heritage tours',
      'Swahili cooking classes'
    ]
  }
];

// Filter categories
const categories = ['All', 'Safari + Beach', 'Safari + Culture', 'Adventure + Culture', 'Beach + Culture'];

// Sort options
const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'discount', label: 'Biggest Discount' },
  { value: 'rating', label: 'Highest Rated' }
];

export default function Collaborations() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  // Filter collaborations
  let filteredCollaborations = collaborations.filter(collab => {
    const matchesCategory = selectedCategory === 'All' || 
      collab.name.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = collab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         collab.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         collab.businesses.some(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Sort collaborations
  filteredCollaborations = [...filteredCollaborations].sort((a, b) => {
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

  const handleViewDeal = (collabId) => {
    console.log('View collaboration:', collabId);
    // Will navigate to checkout or details later
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-3xl">🤝</span>
          <h1 className="text-3xl font-bold text-[#003D5B]">Partnered Experiences</h1>
        </div>
        <p className="text-gray-500">
          Unique experiences created by local businesses working together. Get the best of multiple worlds in one package!
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-xl">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search collaborations..."
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
          Showing <span className="font-semibold text-[#003D5B]">{filteredCollaborations.length}</span> partnered experiences
        </p>
      </div>

      {/* Collaborations Grid */}
      {filteredCollaborations.length > 0 ? (
        <div className="space-y-6">
          {filteredCollaborations.map(collab => (
            <div 
              key={collab.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              {/* Header with partners */}
              <div className="bg-gradient-to-r from-[#003D5B] to-[#30638E] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-[#EDAE49] text-[#003D5B] px-2 py-1 rounded-full font-semibold">
                        🤝 Partnered Experience
                      </span>
                      {collab.discount && (
                        <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                          Save {collab.discount}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{collab.name}</h3>
                    <div className="flex flex-wrap items-center gap-2">
                      {collab.businesses.map((business, idx) => (
                        <span key={business.id} className="text-sm text-white/80">
                          {business.name}{idx < collab.businesses.length - 1 ? ' + ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <span className="text-yellow-400">★</span>
                    <span className="text-white font-medium">{collab.rating}</span>
                    <span className="text-white/60 text-xs">({collab.reviews})</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">⏱️</span>
                    <span className="text-sm text-gray-600">{collab.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">🏷️</span>
                    <span className="text-sm text-gray-600">{collab.businesses.length} businesses collaborating</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{collab.description}</p>

                {/* Highlights - show only when expanded */}
                {expandedId === collab.id && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <h4 className="font-semibold text-[#003D5B] mb-2">What's included:</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {collab.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="text-[#EDAE49]">✓</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-[#EDAE49]">${collab.price}</p>
                      {collab.originalPrice && (
                        <p className="text-sm text-gray-400 line-through">${collab.originalPrice}</p>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">per person (based on double occupancy)</p>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleExpand(collab.id)}
                    >
                      {expandedId === collab.id ? 'Show Less' : 'View Details'}
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleViewDeal(collab.id)}
                    >
                      Book This Deal
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🤝</div>
          <h3 className="text-xl font-bold text-[#003D5B] mb-2">No collaborations found</h3>
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
    </div>
  );
}