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

const formatDate = (ds) => {
  const opts = { month: 'short', day: 'numeric', year: 'numeric' };
  return new Date(ds).toLocaleDateString('en-US', opts);
};

const btnOutline = {
  background: 'transparent', color: '#003D5B', border: '1.5px solid #cbd5e1',
  padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
  cursor: 'pointer'
};

const btnGhost = {
  background: 'transparent', color: '#64748b', border: 'none',
  padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
  cursor: 'pointer'
};

const btnDanger = {
  background: 'transparent', color: '#D1495B', border: '1.5px solid #fecaca',
  padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
  cursor: 'pointer'
};

const btnPrimary = {
  background: '#003D5B', color: '#fff', border: '1.5px solid #003D5B',
  padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
  cursor: 'pointer'
};

export default function BookingCard({ booking, onViewDetails, onCancel, onContact, onLeaveReview }) {
  const st = statusConfig[booking.status];
  const ty = typeConfig[booking.type];

  return (
    <div style={{
      background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden'
    }}>
      <div style={{ padding: '1.25rem 1.5rem' }}>
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: '#f0f9ff', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 22, flexShrink: 0
            }}>{ty.icon}</div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: '#003D5B', fontSize: 16 }}>{booking.name}</p>
              <p style={{ margin: 0, fontSize: 12, color: '#94a3b8', marginTop: 2 }}>by {booking.business}</p>
            </div>
          </div>
          <span style={{
            background: st.bg, color: st.color,
            fontSize: 11, fontWeight: 700, padding: '4px 10px',
            borderRadius: 99, whiteSpace: 'nowrap', marginLeft: 8
          }}>
            {st.icon} {st.label}
          </span>
        </div>

        {/* Info grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 14 }}>
          {[
            { label: 'Travel Date', value: formatDate(booking.date) },
            { label: 'Guests', value: `${booking.guests} ${booking.guests === 1 ? 'person' : 'people'}` },
            { label: 'Total Paid', value: `$ KES {booking.amount}`, accent: true },
            { label: 'Booking ID', value: booking.id, mono: true }
          ].map(({ label, value, accent, mono }) => (
            <div key={label}>
              <p style={{ margin: 0, fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
              <p style={{
                margin: '3px 0 0',
                fontSize: mono ? 12 : 13,
                fontWeight: accent ? 700 : 600,
                color: accent ? '#EDAE49' : '#003D5B',
                fontFamily: mono ? 'monospace' : 'inherit'
              }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 12, borderTop: '1px solid #f8fafc' }}>
          <button onClick={() => onViewDetails(booking)} style={btnOutline}>View Details</button>

          {(booking.status === 'confirmed' || booking.status === 'pending') && (
            <button onClick={() => onCancel(booking)} style={btnDanger}>Cancel Booking</button>
          )}

          {booking.status === 'completed' && (
            <button onClick={() => onLeaveReview(booking)} style={btnPrimary}>Leave Review</button>
          )}

          <button onClick={() => onContact(booking)} style={btnGhost}>💬 Contact Business</button>
        </div>
      </div>
    </div>
  );
}