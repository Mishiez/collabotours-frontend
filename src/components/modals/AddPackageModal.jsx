import Modal from '../common/Modal';
import PackageForm from './PackageForm';

export default function AddPackageModal({ isOpen, onClose, onAdd }) {
  const handleSubmit = (formData) => {
    // Add default values
    const newPackage = {
      ...formData,
      bookings: 0,
      id: Date.now() // temporary ID
    };
    
    onAdd(newPackage);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Package" size="lg">
      <PackageForm 
        onSubmit={handleSubmit}
        onCancel={onClose}
        isEdit={false}
      />
    </Modal>
  );
}