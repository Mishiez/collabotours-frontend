import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TouristServiceCard from '../../components/tourist/TouristServiceCard';
import TouristPackageCard from '../../components/tourist/TouristPackageCard';
import TouristCollaborationCard from '../../components/tourist/TouristCollaborationCard';
import HeroSection from '../../components/tourist/HeroSection';
import CategoryCard from '../../components/tourist/CategoryCard';
import Button from '../../components/common/Button';
import ServiceDetailModal from '../../components/tourist/modals/ServiceDetailModal';
import PackageDetailModal from '../../components/tourist/modals/PackageDetailModal';
import CollaborationDetailModal from '../../components/tourist/modals/CollaborationDetailModal';

// Static data - categories match backend
const categories = [
  { id: 1, name: 'Wildlife Safari', icon: '🦁', category: 'Wildlife', color: '#EDAE49', bgColor: '#EDAE49/10' },
  { id: 2, name: 'Beach Getaway', icon: '🏖️', category: 'Beach', color: '#00798C', bgColor: '#00798C/10' },
  { id: 3, name: 'Cultural Experience', icon: '🗿', category: 'Culture', color: '#30638E', bgColor: '#30638E/10' },
  { id: 4, name: 'Adventure', icon: '⛰️', category: 'Adventure', color: '#D1495B', bgColor: '#D1495B/10' },
  { id: 5, name: 'Water Activities', icon: '💧', category: 'Water Activities', color: '#00798C', bgColor: '#00798C/10' },
];

const featuredServices = [
  {
    id: 1,
    name: 'Masai Mara Safari Adventure',
    category: 'Wildlife',
    price: '350',
    image: null,
    business: 'Safari Kenya',
    rating: 4.9,
    duration: 'Full day',
    location: 'Masai Mara'
  },
  {
    id: 2,
    name: 'Diani Beach Getaway',
    category: 'Beach',
    price: '499',
    image: null,
    business: 'Beach Paradise',
    rating: 4.8,
    duration: '3 days',
    location: 'Diani Beach'
  },
  {
    id: 3,
    name: 'Hot Air Balloon Safari',
    category: 'Adventure',
    price: '450',
    image: null,
    business: 'Safari Kenya',
    rating: 4.9,
    duration: '3 hours',
    location: 'Masai Mara'
  }
];

const featuredPackages = [
  {
    id: 1,
    name: 'Ultimate Safari Experience',
    price: '899',
    originalPrice: '1050',
    duration: '4 days',
    services: 3,
    business: 'Safari Kenya',
    rating: 4.9,
    discount: '15%'
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
    discount: '10%'
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
    discount: '20%'
  }
];

const featuredCollaborations = [
  {
    id: 1,
    name: 'Safari & Beach Combo',
    businesses: ['Safari Kenya', 'Beach Paradise'],
    price: '1199',
    originalPrice: '1450',
    description: 'Experience the best of Kenya with this exclusive partnership',
    rating: 4.9,
    discount: '17%'
  },
  {
    id: 2,
    name: 'Cultural Safari Experience',
    businesses: ['Safari Kenya', 'Cultural Tours'],
    price: '899',
    originalPrice: '1040',
    description: 'Combine wildlife with cultural heritage',
    rating: 4.8,
    discount: '14%'
  }
];

export default function Home() {
  const navigate = useNavigate();
  
  // Modal states
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedCollaboration, setSelectedCollaboration] = useState(null);
  
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [isCollaborationModalOpen, setIsCollaborationModalOpen] = useState(false);

  // Handlers
  const handleCategoryClick = (category) => {
    navigate(`/tourist/services?category=${category}`);
  };

  const handleViewAllServices = () => {
    navigate('/tourist/services');
  };

  const handleViewAllPackages = () => {
    navigate('/tourist/packages');
  };

  const handleViewAllCollaborations = () => {
    navigate('/tourist/collaborations');
  };

  const handleViewService = (service) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  const handleViewPackage = (pkg) => {
    setSelectedPackage(pkg);
    setIsPackageModalOpen(true);
  };

  const handleViewCollaboration = (collab) => {
    setSelectedCollaboration(collab);
    setIsCollaborationModalOpen(true);
  };

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleSearch = (query, category) => {
    let url = '/tourist/services';
    const params = [];
    if (query) params.push(`search=${encodeURIComponent(query)}`);
    if (category) params.push(`category=${category}`);
    if (params.length) url += `?${params.join('&')}`;
    navigate(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <HeroSection onSearch={handleSearch} />

      {/* Categories Section */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#003D5B]">Explore by Category</h2>
          <p className="text-gray-500 mt-2">Find experiences that match your interests</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map(category => (
            <CategoryCard 
              key={category.id} 
              {...category} 
              onClick={() => handleCategoryClick(category.category)}
            />
          ))}
        </div>
      </section>

      {/* Featured Services */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#003D5B]">Popular Experiences</h2>
            <p className="text-gray-500 text-sm">Most booked by travelers</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleViewAllServices}>
            View All →
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices.map(service => (
            <TouristServiceCard 
              key={service.id} 
              {...service} 
              onViewDetails={() => handleViewService(service)}
            />
          ))}
        </div>
      </section>

      {/* Featured Packages */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#003D5B]">Special Packages</h2>
            <p className="text-gray-500 text-sm">Bundle deals for better value</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleViewAllPackages}>
            View All →
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPackages.map(pkg => (
            <TouristPackageCard 
              key={pkg.id} 
              {...pkg} 
              onViewDetails={() => handleViewPackage(pkg)}
            />
          ))}
        </div>
      </section>

      {/* Featured Collaborations */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#003D5B]">Partnered Experiences</h2>
            <p className="text-gray-500 text-sm">Created by local businesses working together</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleViewAllCollaborations}>
            View All →
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredCollaborations.map(collab => (
            <TouristCollaborationCard 
              key={collab.id} 
              {...collab} 
              onViewDetails={() => handleViewCollaboration(collab)}
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#003D5B] to-[#30638E] rounded-2xl p-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Are you a tour operator?
        </h2>
        <p className="text-white/80 mb-6 max-w-2xl mx-auto">
          List your services on CollaboTours and reach more travelers. Join our community of tourism businesses.
        </p>
        <Button variant="primary" size="lg" className="bg-[#EDAE49] text-[#003D5B] hover:bg-[#e5a23e]" onClick={handleGetStarted}>
          Get Started →
        </Button>
      </section>

      {/* Modals */}
      <ServiceDetailModal 
        isOpen={isServiceModalOpen}
        onClose={() => {
          setIsServiceModalOpen(false);
          setSelectedService(null);
        }}
        service={selectedService}
      />

      <PackageDetailModal 
        isOpen={isPackageModalOpen}
        onClose={() => {
          setIsPackageModalOpen(false);
          setSelectedPackage(null);
        }}
        pkg={selectedPackage}
      />

      <CollaborationDetailModal 
        isOpen={isCollaborationModalOpen}
        onClose={() => {
          setIsCollaborationModalOpen(false);
          setSelectedCollaboration(null);
        }}
        collaboration={selectedCollaboration}
      />
    </div>
  );
}