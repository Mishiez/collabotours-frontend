import { useState } from 'react';
import Button from '../common/Button';

export default function HeroSection() {
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCategory, setSearchCategory] = useState('');

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'Wildlife', label: 'Wildlife Safari' },
    { value: 'Beach', label: 'Beach Getaway' },
    { value: 'Culture', label: 'Cultural Experience' },
    { value: 'Adventure', label: 'Adventure' },
  ];

  const handleSearch = () => {
    console.log('Search:', { location: searchLocation, category: searchCategory });
    // Will connect to backend later
  };

  return (
    <div className="relative overflow-hidden rounded-2xl mb-12">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#003D5B] to-[#30638E]"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#EDAE49] rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00798C] rounded-full opacity-10 blur-3xl"></div>
      
      {/* Content */}
      <div className="relative py-16 px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Discover Kenya's Best Tourism Experiences
        </h1>
        <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
          Book unique tours, safaris, and cultural experiences from local businesses
        </p>
        
        {/* Search Bar */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-2 shadow-xl">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📍</span>
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/50"
              />
            </div>
            <div className="w-full md:w-48 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🏷️</span>
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/50 appearance-none bg-gray"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <Button 
              variant="primary" 
              size="lg" 
              className="px-8"
              onClick={handleSearch}
            >
              🔍 Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}