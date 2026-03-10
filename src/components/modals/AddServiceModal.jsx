import Modal from '../common/Modal';
import ServiceForm from './ServiceForm';

export default function AddServiceModal({ isOpen, onClose, onAdd }) {
  const handleSubmit = (formData) => {
    // Generate a new ID (in real app, this would come from backend)
    const newService = {
      ...formData,
      id: Date.now(), // temporary ID generation
      bookings: 0,
      price: formData.price.toString()
    };
    
    onAdd(newService);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Service" size="lg">
      <ServiceForm 
        onSubmit={handleSubmit}
        onCancel={onClose}
        isEdit={false}
      />
    </Modal>
  );
}