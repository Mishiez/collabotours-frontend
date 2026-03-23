import { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import AddPackageModal from '../../components/modals/AddPackageModal';
import ManagePackageModal from '../../components/modals/ManagePackageModal';
import { fetchPackages, createPackage, updatePackage, deletePackage } from '../../services/api';

// const initialPackages = [
//   {
//     id: 1,
//     name: 'Ultimate Safari Experience',
//     services: ['Safari Day Tour', 'Hot Air Balloon Ride', 'Cultural Visit'],
//     price: '899',
//     duration: '4 days',
//     bookings: 23,
//     status: 'active',
//     discount: '15%',
//   },
//   {
//     id: 2,
//     name: 'Beach & Culture Combo',
//     services: ['Beach Getaway Package', 'Cultural City Walk', 'Sunset Cruise'],
//     price: '749',
//     duration: '5 days',
//     bookings: 17,
//     status: 'active',
//     discount: '10%',
//   },
//   {
//     id: 3,
//     name: 'Adventure Week',
//     services: ['Mountain Hiking Trip', 'Safari Day Tour', 'Hot Air Balloon Ride'],
//     price: '1299',
//     duration: '7 days',
//     bookings: 8,
//     status: 'pending',
//     discount: '20%',
//   },
// ];

export default function Packages() {
  // Move packages into state
  // const [packages, setPackages] = useState(initialPackages);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Load packages from backend
  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const response = await fetchPackages();
      console.log('Packages loaded:', response.data);
      setPackages(response.data);
    } catch (err) {
      console.error('Failed to load packages:', err);
      setError('Could not load packages');
    } finally {
      setLoading(false);
    }
  };

  // Handle add new package
  const handleAddPackage = async (newPackage) => {
  try {
    // Add business ID (temporarily hardcoded)
    const packageWithBusiness = {
      ...newPackage,
      business: 2,  // safari_kenya's ID
      // The services array from the modal contains service NAMES
      // But the backend expects service IDs
    };
    
    console.log('Sending to backend:', packageWithBusiness);
    const response = await createPackage(packageWithBusiness);
    console.log('Package created:', response.data);
    setPackages(prev => [response.data, ...prev]);
  } catch (err) {
    console.error('Failed to create package:', err);
    console.error('Error response:', err.response?.data);
    alert('Failed to create package. Please try again.');
  }
};

  // Handle update package
  const handleUpdatePackage = async (updatedPackage) => {
  try {
    const response = await updatePackage(updatedPackage.id, updatedPackage);
    setPackages(prev => 
      prev.map(pkg => pkg.id === updatedPackage.id ? response.data : pkg)
    );
  } catch (err) {
    console.error('Failed to update package:', err);
    alert('Failed to update package. Please try again.');
  }
};

  // Handle delete package
  const handleDeletePackage = async (packageId) => {
  try {
    await deletePackage(packageId);
    setPackages(prev => prev.filter(pkg => pkg.id !== packageId));
  } catch (err) {
    console.error('Failed to delete package:', err);
    alert('Failed to delete package. Please try again.');
  }
};

  // Handle edit click
  const handleEditClick = (pkg) => {
    setSelectedPackage(pkg);
    setIsManageModalOpen(true);
  };

  // Handle view details click
  const handleViewDetails = (pkg) => {
    setSelectedPackage(pkg);
    setIsManageModalOpen(true);
    // You could set a different initial view if needed
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#00798C] mb-1">
            Package Deals
          </p>
          <h1 className="text-3xl font-bold text-[#003D5B]">Packages</h1>
          <p className="text-gray-400 text-sm mt-1">Create and manage bundled service packages</p>
        </div>
        <Button 
          variant="primary" 
          size="md" 
          icon="＋"
          onClick={() => setIsAddModalOpen(true)}
        >
          Create Package
        </Button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
            {/* Package Header */}
            <div className="bg-gradient-to-r from-[#003D5B] to-[#30638E] p-5 text-white">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">{pkg.name}</h3>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  pkg.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-[#EDAE49]/20 text-[#EDAE49]'
                }`}>
                  {pkg.status}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-white/80">
                <span>⏱️ {pkg.duration}</span>
                <span>📅 {pkg.bookings} bookings</span>
              </div>
            </div>

            {/* Package Content */}
            <div className="p-5">
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2">Included Services:</p>
                <div className="flex flex-wrap gap-2">
                  {pkg.services.map((service, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                      {service.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Discount */}
              <div className="flex items-end justify-between mb-5">
                <div>
                  <p className="text-xs text-gray-400">Package Price</p>
                  <p className="text-2xl font-bold text-[#EDAE49]">${pkg.price}</p>
                </div>
                {pkg.discount && (
                  <div className="text-right">
                    <p className="text-xs text-gray-400">You Save</p>
                    <p className="text-sm font-semibold text-emerald-600">{pkg.discount}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEditClick(pkg)}
                >
                  Edit
                </Button>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleViewDetails(pkg)}
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <AddPackageModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddPackage}
      />

      <ManagePackageModal 
        isOpen={isManageModalOpen}
        onClose={() => {
          setIsManageModalOpen(false);
          setSelectedPackage(null);
        }}
        package={selectedPackage}
        onUpdate={handleUpdatePackage}
        onDelete={handleDeletePackage}
      />
    </div>
  );
}