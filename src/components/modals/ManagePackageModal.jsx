import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import PackageForm from './PackageForm';

export default function ManagePackageModal({ isOpen, onClose, package: pkg, onUpdate, onDelete }) {
  const [activeView, setActiveView] = useState('menu'); // 'menu', 'edit', 'details', 'analytics'
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!pkg) return null;

  const menuItems = [
    { id: 'edit', icon: '📝', label: 'Edit Package', color: '#003D5B' },
    { id: 'analytics', icon: '📊', label: 'View Analytics', color: '#30638E' },
    { id: 'status', icon: '🔄', label: 'Change Status', color: '#EDAE49' },
    { id: 'delete', icon: '❌', label: 'Delete Package', color: '#D1495B' },
  ];

  const handleMenuClick = (itemId) => {
    if (itemId === 'delete') {
      setShowDeleteConfirm(true);
    } else {
      setActiveView(itemId);
    }
  };

  const handleDelete = () => {
    onDelete(pkg.id);
    onClose();
  };

  const handleUpdate = (updatedData) => {
    onUpdate({
      ...pkg,
      ...updatedData
    });
    setActiveView('menu');
  };

  const handleStatusChange = (newStatus) => {
    onUpdate({
      ...pkg,
      status: newStatus
    });
    setActiveView('menu');
  };

  const renderContent = () => {
    // Delete Confirmation View
    if (showDeleteConfirm) {
      return (
        <div className="text-center py-4">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-lg font-bold text-[#003D5B] mb-2">Delete Package?</h3>
          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to delete "{pkg.name}"? This action cannot be undone.
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
          <PackageForm 
            initialData={pkg}
            onSubmit={handleUpdate}
            onCancel={() => setActiveView('menu')}
            isEdit={true}
          />
        </div>
      );
    }

    // Details View
    if (activeView === 'details') {
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
              <p className="text-sm text-gray-500">Package Name</p>
              <p className="text-lg font-bold text-[#003D5B]">{pkg.name}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm text-gray-500 mb-2">Included Services</p>
              <div className="flex flex-wrap gap-2">
                {pkg.services.map((service, index) => (
                  <span key={index} className="text-xs bg-white text-gray-600 px-3 py-1.5 rounded-full border border-gray-200">
                    {service}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500">Duration</p>
                <p className="text-lg font-bold text-[#30638E]">{pkg.duration}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500">Price</p>
                <p className="text-lg font-bold text-[#EDAE49]">${pkg.price}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500">Discount</p>
                <p className="text-lg font-bold text-emerald-600">{pkg.discount || '0%'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-lg font-bold text-[#003D5B] capitalize">{pkg.status}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Analytics View
    if (activeView === 'analytics') {
      const totalRevenue = parseInt(pkg.price) * pkg.bookings;
      const averagePerBooking = pkg.bookings > 0 ? Math.round(totalRevenue / pkg.bookings) : 0;

      return (
        <div>
          <button 
            onClick={() => setActiveView('menu')}
            className="text-sm text-[#00798C] mb-4 hover:underline"
          >
            ← Back to Menu
          </button>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500">Total Bookings</p>
                <p className="text-2xl font-bold text-[#003D5B]">{pkg.bookings}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-[#EDAE49]">${totalRevenue}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500">Avg. per Booking</p>
                <p className="text-lg font-bold text-[#30638E]">${averagePerBooking}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500">Services Included</p>
                <p className="text-lg font-bold text-[#00798C]">{pkg.services.length}</p>
              </div>
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
                onClick={() => handleStatusChange(status)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-colors capitalize ${
                  pkg.status === status 
                    ? 'bg-[#EDAE49] text-[#003D5B]' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
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
      title={`Manage: ${pkg.name}`}
      size="lg"
    >
      {renderContent()}
    </Modal>
  );
}