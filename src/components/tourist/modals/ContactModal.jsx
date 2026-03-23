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

const btnPrimary = {
  background: '#003D5B', color: '#fff', border: '1.5px solid #003D5B',
  padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
  cursor: 'pointer'
};

export default function ContactModal({ isOpen, onClose, booking }) {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!booking) return null;

  const handleSend = () => {
    if (!message.trim()) return;
    setSent(true);
    setTimeout(() => { setSent(false); setMessage(''); onClose(); }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Contact ${booking.business}`} size="md">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <p style={{ margin: 0, fontWeight: 700, color: '#003D5B', fontSize: 16 }}>Message Sent!</p>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: '#64748b' }}>
              {booking.business} will get back to you soon.
            </p>
          </div>
        ) : (
          <>
            <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 14px' }}>
              <p style={{ margin: 0, fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Regarding</p>
              <p style={{ margin: '4px 0 0', fontWeight: 600, color: '#003D5B', fontSize: 14 }}>{booking.name}</p>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>Booking {booking.id} · {formatDate(booking.date)}</p>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Your message
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={`Hi ${booking.business}, I have a question about my booking…`}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 10,
                  border: '1px solid #e2e8f0', fontSize: 13, color: '#374151',
                  resize: 'vertical', outline: 'none', fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
              <button onClick={onClose} style={btnOutline}>Cancel</button>
              <button onClick={handleSend} disabled={!message.trim()} style={{ ...btnPrimary, opacity: message.trim() ? 1 : 0.5 }}>
                Send Message
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}