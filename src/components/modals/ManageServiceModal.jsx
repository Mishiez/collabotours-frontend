import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import ServiceForm from './ServiceForm';

export default function ManageServiceModal({ isOpen, onClose, service, onUpdate, onDelete }) {
  const [activeView, setActiveView] = useState('menu'); // 'menu', 'edit', 'analytics', 'bookings'
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!service) return null;

  const menuItems = [
    { id: 'edit', icon: '📝', label: 'Edit Details', color: '#003D5B' },
    { id: 'analytics', icon: '📊', label: 'View Analytics', color: '#00798C' },
    { id: 'status', icon: '🔄', label: 'Change Status', color: '#EDAE49' },
    { id: 'bookings', icon: '📋', label: 'View Bookings', color: '#30638E' },
    { id: 'delete', icon: '❌', label: 'Delete Service', color: '#D1495B' },
  ];

  const handleMenuClick = (itemId) => {
    if (itemId === 'delete') {
      setShowDeleteConfirm(true);
    } else {
      setActiveView(itemId);
    }
  };

  const handleDelete = () => {
    onDelete(service.id);
    onClose();
  };

  const handleUpdate = (updatedData) => {
    onUpdate({
      ...service,
      ...updatedData
    });
    setActiveView('menu');
  };

  const renderContent = () => {
    // Delete Confirmation View
    if (showDeleteConfirm) {
      return (
        <div className="text-center py-4">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-lg font-bold text-[#003D5B] mb-2">Delete Service?</h3>
          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to delete "{service.name}"? This action cannot be undone.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleDelete} className="bg-[#D1495B] hover:bg-[#b83b4b]">
              Delete
            </Button>
          </div>
        </div>
      );
    }

    // Edit Form View
    if (activeView === 'edit') {
      return (
        <div>
          <button 
            onClick={() => setActiveView('menu')}
            className="text-sm text-[#00798C] mb-4 hover:underline"
          >
            ← Back to Menu
          </button>
          <ServiceForm 
            initialData={service}
            onSubmit={handleUpdate}
            onCancel={() => setActiveView('menu')}
            isEdit={true}
          />
        </div>
      );
    }

    // Analytics View (placeholder)
    if (activeView === 'analytics') {
      return (
        <div>
          <button 
            onClick={() => setActiveView('menu')}
            className="text-sm text-[#00798C] mb-4 hover:underline"
          >
            ← Back to Menu
          </button>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-500">Total Bookings</p>
              <p className="text-2xl font-bold text-[#003D5B]">{service.bookings}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-500">Revenue Generated</p>
              <p className="text-2xl font-bold text-[#EDAE49]">${parseInt(service.price) * service.bookings}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-lg font-semibold text-[#30638E]">{service.status}</p>
            </div>
          </div>
        </div>
      );
    }

    // Status Change View
    if (activeView === 'status') {
      const statuses = ['active', 'pending', 'inactive'];
      return (
        <div>
          <button 
            onClick={() => setActiveView('menu')}
            className="text-sm text-[#00798C] mb-4 hover:underline"
          >
            ← Back to Menu
          </button>
          <h3 className="font-semibold text-[#003D5B] mb-3">Change Status</h3>
          <div className="space-y-2">
            {statuses.map(status => (
              <button
                key={status}
                onClick={() => handleUpdate({ ...service, status })}
                className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                  service.status === status 
                    ? 'bg-[#EDAE49] text-[#003D5B]' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // Bookings View (placeholder)
    if (activeView === 'bookings') {
      return (
        <div>
          <button 
            onClick={() => setActiveView('menu')}
            className="text-sm text-[#00798C] mb-4 hover:underline"
          >
            ← Back to Menu
          </button>
          <p className="text-center text-gray-500 py-8">
            No bookings yet for this service.
          </p>
        </div>
      );
    }

    // Default Menu View
    return (
      <div className="space-y-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => handleMenuClick(item.id)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
          >
            <span style={{ color: item.color }} className="text-xl">{item.icon}</span>
            <span className="font-medium text-[#003D5B]">{item.label}</span>
            <span className="ml-auto text-gray-400 group-hover:text-[#003D5B]">→</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Manage: ${service.name}`}
      size="lg"
    >
      {renderContent()}
    </Modal>
  );
}