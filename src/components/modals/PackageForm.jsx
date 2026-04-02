import { useState, useEffect } from 'react';
import Button from '../common/Button';
import { fetchServices } from '../../services/api';

export default function PackageForm({ initialData = {}, onSubmit, onCancel, isEdit = false }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    price: initialData.price || '',
    duration: initialData.duration || '',
    discount: initialData.discount || '',
    status: initialData.status || 'active',
  });

  const [availableServices, setAvailableServices] = useState([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load available services from backend
  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetchServices();
        console.log('Loaded services for package form:', response.data);
        setAvailableServices(response.data);
        
        // If editing, pre-select the services that are already in the package
        if (isEdit && initialData.services) {
          // Extract IDs from the service objects
          const serviceIds = initialData.services.map(s => s.id);
          setSelectedServiceIds(serviceIds);
        }
      } catch (error) {
        console.error('Failed to load services:', error);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, [isEdit, initialData]);

  const statuses = ['active', 'pending', 'inactive'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (serviceId) => {
    setSelectedServiceIds(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare data for backend - send service IDs, not names!
    const packageData = {
      ...formData,
      service_ids: selectedServiceIds,  // This is what the backend expects
    };
    
    console.log('Submitting package data:', packageData);
    onSubmit(packageData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Package Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Package Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20 focus:border-[#EDAE49]"
          placeholder="e.g., Ultimate Safari Experience"
        />
      </div>

      {/* Duration and Price row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
            placeholder="e.g., 4 days"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (Ksh)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
            placeholder="899"
          />
        </div>
      </div>

      {/* Discount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Discount (%)
        </label>
        <input
          type="text"
          name="discount"
          value={formData.discount}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
          placeholder="e.g., 15%"
        />
      </div>

      {/* Services Selection - NOW WITH REAL DATA FROM BACKEND */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Included Services
        </label>
        {loading ? (
          <div className="border border-gray-200 rounded-xl p-6 text-center">
            <p className="text-gray-400">Loading services...</p>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-xl p-3 max-h-48 overflow-y-auto">
            {availableServices.length === 0 ? (
              <p className="text-gray-400 text-center py-2">No services available. Create some services first.</p>
            ) : (
              availableServices.map(service => (
                <label key={service.id} className="flex items-center gap-2 py-1.5 hover:bg-gray-50 px-2 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedServiceIds.includes(service.id)}
                    onChange={() => handleServiceToggle(service.id)}
                    className="rounded border-gray-300 text-[#EDAE49] focus:ring-[#EDAE49]"
                  />
                  <span className="text-sm text-gray-700">
                    {service.name} <span className="text-gray-400">(Ksh {service.price})</span>
                  </span>
                </label>
              ))
            )}
          </div>
        )}
        {!loading && selectedServiceIds.length === 0 && (
          <p className="text-xs text-[#D1495B] mt-1">Select at least one service</p>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
        >
          {statuses.map(status => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="primary"
          disabled={selectedServiceIds.length === 0 || loading}
        >
          {isEdit ? 'Update Package' : 'Create Package'}
        </Button>
      </div>
    </form>
  );
}