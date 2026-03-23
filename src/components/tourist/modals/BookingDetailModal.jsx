import { useState } from 'react';
import Modal from '../../common/Modal';

const statusConfig = {
  confirmed: { label: 'Confirmed', bg: '#d1fae5', color: '#065f46', icon: '✓' },
  pending:   { label: 'Pending',   bg: '#fef3c7', color: '#92400e', icon: '…' },
  completed: { label: 'Completed', bg: '#dbeafe', color: '#1e40af', icon: '★' },
  cancelled: { label: 'Cancelled', bg: '#f3f4f6', color: '#6b7280', icon: '✕' }
};

const typeConfig = {
  service:       { icon: '🎯', label: 'Service' },
  package:       { icon: '📦', label: 'Package' },
  collaboration: { icon: '🤝', label: 'Collaboration' }
};

const formatDate = (ds, long = false) => {
  const opts = long
    ? { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
    : { month: 'short', day: 'numeric', year: 'numeric' };
  return new Date(ds).toLocaleDateString('en-US', opts);
};

const btnOutline = {
  background: 'transparent', color: '#003D5B', border: '1.5px solid #cbd5e1',
  padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
  cursor: 'pointer'
};

const btnPrimary = {
  background: '#003D5B', color: '#fff', border: '1.5px solid #003D5B',
  padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
  cursor: 'pointer'
};

export default function BookingDetailModal({ isOpen, onClose, booking, onLeaveReview, onContact }) {
  if (!booking) return null;
  
  const st = statusConfig[booking.status];
  const ty = typeConfig[booking.type];

  const included = {
    service:       ['Professional guide', 'Park entrance fees', 'Lunch and refreshments'],
    package:       ['All included services', 'Accommodation', 'Transport between locations'],
    collaboration: ['All partner experiences', 'Coordinated logistics', 'Special partnership discount']
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Booking Details" size="lg">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* ID + status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Booking ID</p>
            <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: '#003D5B' }}>{booking.id}</p>
          </div>
          <span style={{ background: st.bg, color: st.color, fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 99 }}>
            {st.icon} {st.label}
          </span>
        </div>

        {/* Name */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
            {ty.icon}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: '#003D5B', fontSize: 17 }}>{booking.name}</p>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>by {booking.business}</p>
            <span style={{ fontSize: 11, background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: 99, marginTop: 4, display: 'inline-block' }}>{ty.label}</span>
          </div>
        </div>

        {/* Details grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Travel Date', value: formatDate(booking.date, true) },
            { label: 'Guests', value: `${booking.guests} ${booking.guests === 1 ? 'person' : 'people'}` },
            { label: 'Total Amount', value: `$${booking.amount}`, highlight: true },
            { label: 'Booking Date', value: formatDate(booking.bookingDate) }
          ].map(({ label, value, highlight }) => (
            <div key={label} style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 14px' }}>
              <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
              <p style={{ margin: 0, fontWeight: highlight ? 700 : 600, color: highlight ? '#EDAE49' : '#003D5B', fontSize: highlight ? 20 : 14, marginTop: 2 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Included */}
        <div style={{ background: '#f8fafc', borderRadius: 10, padding: '14px 16px' }}>
          <p style={{ margin: '0 0 10px', fontWeight: 700, color: '#003D5B', fontSize: 14 }}>What's included</p>
          {included[booking.type].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ color: '#EDAE49', fontWeight: 700, fontSize: 14 }}>✓</span>
              <span style={{ fontSize: 13, color: '#475569' }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Need help */}
        <div style={{ background: '#f8fafc', borderRadius: 10, padding: '14px 16px' }}>
          <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#003D5B', fontSize: 14 }}>Need help?</p>
          <p style={{ margin: '0 0 12px', fontSize: 13, color: '#64748b' }}>Contact the business directly with any questions about your booking.</p>
          <button onClick={() => onContact(booking)} style={btnOutline}>
            💬 Message {booking.business}
          </button>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
          <button onClick={onClose} style={btnOutline}>Close</button>
          {booking.status === 'completed' && (
            <button onClick={() => { onLeaveReview(booking); onClose(); }} style={btnPrimary}>Leave Review</button>
          )}
        </div>
      </div>
    </Modal>
  );
}