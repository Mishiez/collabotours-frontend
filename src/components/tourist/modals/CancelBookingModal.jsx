import { useState } from 'react';
import Modal from '../../common/Modal';

const formatDate = (ds) => {
  const opts = { month: 'short', day: 'numeric', year: 'numeric' };
  return new Date(ds).toLocaleDateString('en-US', opts);
};

const btnOutline = {
  background: 'transparent', color: '#003D5B', border: '1.5px solid #cbd5e1',
  padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
  cursor: 'pointer'
};

export default function CancelBookingModal({ isOpen, onClose, booking, onConfirm }) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!booking) return null;

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirm(booking.id, reason);
      setReason('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cancel Booking" size="md">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Warning */}
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 14px' }}>
          <p style={{ margin: 0, color: '#dc2626', fontSize: 13, fontWeight: 600 }}>
            ⚠️ Are you sure you want to cancel this booking?
          </p>
        </div>

        {/* Booking summary */}
        <div style={{ background: '#f8fafc', borderRadius: 10, padding: '14px 16px' }}>
          <p style={{ margin: '0 0 8px', fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Booking to cancel</p>
          <p style={{ margin: 0, fontWeight: 700, color: '#003D5B', fontSize: 15 }}>{booking.name}</p>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>by {booking.business}</p>
          <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>Date</p>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#003D5B' }}>{formatDate(booking.date)}</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>Amount</p>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#EDAE49' }}>${booking.amount}</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>Guests</p>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#003D5B' }}>{booking.guests}</p>
            </div>
          </div>
        </div>

        {/* Reason */}
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
            Reason for cancellation <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Let us know why you're cancelling..."
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 10,
              border: '1px solid #e2e8f0', fontSize: 13, color: '#374151',
              resize: 'vertical', outline: 'none', fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Policy */}
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 14px' }}>
          <p style={{ margin: 0, fontSize: 12, color: '#92400e' }}>
            ℹ️ Free cancellation up to 24 hours before the experience. Refunds processed within 5–7 business days.
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
          <button onClick={onClose} disabled={isSubmitting} style={btnOutline}>Keep Booking</button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{ ...btnOutline, background: isSubmitting ? '#f87171' : '#D1495B', color: '#fff', borderColor: isSubmitting ? '#f87171' : '#D1495B' }}
          >
            {isSubmitting ? 'Processing…' : 'Yes, Cancel Booking'}
          </button>
        </div>
      </div>
    </Modal>
  );
}