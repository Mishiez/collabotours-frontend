import { useState, useEffect } from 'react';
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
import { fetchPublicServices, fetchPublicPackages, fetchPublicCollaborations } from '../../services/api';

// Static categories (still fine to keep static)
const categories = [
  { id: 1, name: 'Wildlife Safari', icon: '🦁', category: 'Wildlife', color: '#EDAE49', bgColor: '#EDAE49/10' },
  { id: 2, name: 'Beach Getaway', icon: '🏖️', category: 'Beach', color: '#00798C', bgColor: '#00798C/10' },
  { id: 3, name: 'Cultural Experience', icon: '🗿', category: 'Culture', color: '#30638E', bgColor: '#30638E/10' },
  { id: 4, name: 'Adventure', icon: '⛰️', category: 'Adventure', color: '#D1495B', bgColor: '#D1495B/10' },
  { id: 5, name: 'Water Activities', icon: '💧', category: 'Water Activities', color: '#00798C', bgColor: '#00798C/10' },
];

export default function Home() {
  const navigate = useNavigate();
  
  // State for dynamic data
  const [featuredServices, setFeaturedServices] = useState([]);
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [featuredCollaborations, setFeaturedCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedCollaboration, setSelectedCollaboration] = useState(null);
  
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [isCollaborationModalOpen, setIsCollaborationModalOpen] = useState(false);

  // Fetch data on page load
  useEffect(() => {
    loadFeaturedData();
  }, []);

  const loadFeaturedData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [servicesRes, packagesRes, collaborationsRes] = await Promise.all([
        fetchPublicServices(),
        fetchPublicPackages(),
        fetchPublicCollaborations()
      ]);
      
      // Get top 3 services by bookings_count
      const topServices = [...servicesRes.data]
        .sort((a, b) => (b.bookings_count || 0) - (a.bookings_count || 0))
        .slice(0, 3);
      
      // Get top 3 packages by bookings
      const topPackages = [...packagesRes.data]
        .sort((a, b) => (b.bookings || 0) - (a.bookings || 0))
        .slice(0, 3);
      
      // Get active collaborations (top 2)
      const activeCollaborations = collaborationsRes.data
        .filter(c => c.status === 'active')
        .slice(0, 2);
      
      setFeaturedServices(topServices);
      setFeaturedPackages(topPackages);
      setFeaturedCollaborations(activeCollaborations);
      
    } catch (err) {
      console.error('Failed to load featured data:', err);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Loading experiences...</p>
      </div>
    );
  }

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
              id={pkg.id}
              name={pkg.name}
              price={pkg.price}
              discount={pkg.discount}
              duration={pkg.duration}
              services={pkg.services ? pkg.services.length : 0}
              business={pkg.business_name || 'Local Business'}
              description={pkg.description}
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
            <div 
              key={collab.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer"
              onClick={() => handleViewCollaboration(collab)}
            >
              <div className="bg-gradient-to-r from-[#003D5B] to-[#30638E] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs bg-[#EDAE49] text-[#003D5B] px-2 py-1 rounded-full font-semibold">
                      🤝 Partnership
                    </span>
                    <h3 className="text-xl font-bold text-white mt-2">{collab.name}</h3>
                    <p className="text-sm text-white/80">{collab.type} • {collab.location}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <span className="text-yellow-400">★</span>
                    <span className="text-white font-medium">{collab.rating || 'New'}</span>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-500 mb-4">
                  Partner businesses: 
                  <span className="font-medium text-[#003D5B]"> {collab.business_name} & {collab.partner_name || 'Partner'}</span>
                </p>
                <Button variant="primary" size="sm" className="w-full">
                  View Partnership
                </Button>
              </div>
            </div>
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