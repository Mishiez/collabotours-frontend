import { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import TouristCollaborationCard from '../../components/tourist/TouristCollaborationCard';
import CollaborationDetailModal from '../../components/tourist/modals/CollaborationDetailModal';
import { fetchPublicCollaborations } from '../../services/api';

// Filter categories
const categories = ['All'];

// Sort options
const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'rating', label: 'Highest Rated' }
];

export default function Collaborations() {
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [selectedCollaboration, setSelectedCollaboration] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch collaborations from backend
  useEffect(() => {
    loadCollaborations();
  }, []);

  const loadCollaborations = async () => {
    try {
      setLoading(true);
      const response = await fetchPublicCollaborations();
      console.log('Collaborations loaded:', response.data);
      setCollaborations(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to load collaborations:', err);
      setError('Could not load collaborations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Filter collaborations
  let filteredCollaborations = collaborations.filter(collab => {
    const matchesCategory = selectedCategory === 'All';
    const matchesSearch = collab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (collab.type || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (collab.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort collaborations
  filteredCollaborations = [...filteredCollaborations].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return parseFloat(b.rating) - parseFloat(a.rating);
      default:
        return 0;
    }
  });

  const handleViewDeal = (collab) => {
    setSelectedCollaboration(collab);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Loading collaborations...</p>
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
        <div className="flex items-center gap-2 mb-2">
          <span className="text-3xl">🤝</span>
          <h1 className="text-3xl font-bold text-[#003D5B]">Partnered Experiences</h1>
        </div>
        <p className="text-gray-500">
          Local businesses working together to bring you the best experiences in Kenya.
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
          Showing <span className="font-semibold text-[#003D5B]">{filteredCollaborations.length}</span> partnered experiences
        </p>
      </div>

      {/* Collaborations Grid */}
      {filteredCollaborations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCollaborations.map(collab => (
            <TouristCollaborationCard
              key={collab.id}
              id={collab.id}
              name={collab.name}
              type={collab.type}
              location={collab.location}
              rating={collab.rating}
              status={collab.status}
              business_name={collab.business_name}
              partner_name={collab.partner_name}
              onViewDetails={() => handleViewDeal(collab)}
            />
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

      {/* Modal */}
      <CollaborationDetailModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCollaboration(null);
        }}
        collaboration={selectedCollaboration}
      />
    </div>
  );
}