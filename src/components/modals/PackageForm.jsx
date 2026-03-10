import { useState } from 'react';
import Button from '../common/Button';

// This would normally come from your services data
const availableServices = [
  'Safari Day Tour',
  'Beach Getaway Package',
  'Cultural City Walk',
  'Sunset Cruise',
  'Mountain Hiking Trip',
  'Hot Air Balloon Ride',
  'Cultural Visit'
];

export default function PackageForm({ initialData = {}, onSubmit, onCancel, isEdit = false }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    services: initialData.services || [],
    price: initialData.price || '',
    duration: initialData.duration || '',
    discount: initialData.discount || '',
    status: initialData.status || 'active',
    ...initialData
  });

  const [selectedServices, setSelectedServices] = useState(formData.services);

  const statuses = ['active', 'pending', 'inactive'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (service) => {
    setSelectedServices(prev => {
      if (prev.includes(service)) {
        return prev.filter(s => s !== service);
      } else {
        return [...prev, service];
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      services: selectedServices,
      id: isEdit ? formData.id : Date.now() // temporary ID generation
    });
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
            Price ($)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
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

      {/* Services Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Included Services
        </label>
        <div className="border border-gray-200 rounded-xl p-3 max-h-48 overflow-y-auto">
          {availableServices.map(service => (
            <label key={service} className="flex items-center gap-2 py-1.5 hover:bg-gray-50 px-2 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={selectedServices.includes(service)}
                onChange={() => handleServiceToggle(service)}
                className="rounded border-gray-300 text-[#EDAE49] focus:ring-[#EDAE49]"
              />
              <span className="text-sm text-gray-700">{service}</span>
            </label>
          ))}
        </div>
        {selectedServices.length === 0 && (
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
          disabled={selectedServices.length === 0}
        >
          {isEdit ? 'Update Package' : 'Create Package'}
        </Button>
      </div>
    </form>
  );
}