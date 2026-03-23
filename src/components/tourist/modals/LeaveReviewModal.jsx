import { useState } from 'react';
import Modal from '../../common/Modal';

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

const formatDate = (ds) => {
  const opts = { month: 'short', day: 'numeric', year: 'numeric' };
  return new Date(ds).toLocaleDateString('en-US', opts);
};

export default function LeaveReviewModal({ isOpen, onClose, booking }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!booking) return null;

  const handleSubmit = () => {
    if (rating === 0) return;
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setRating(0); setComment(''); onClose(); }, 1800);
  };

  const labels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Leave a Review" size="md">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
            <p style={{ margin: 0, fontWeight: 700, color: '#003D5B', fontSize: 16 }}>Review Submitted!</p>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: '#64748b' }}>
              Thank you for your feedback on {booking.name}.
            </p>
          </div>
        ) : (
          <>
            <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 14px' }}>
              <p style={{ margin: 0, fontWeight: 600, color: '#003D5B', fontSize: 14 }}>{booking.name}</p>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>by {booking.business} · {formatDate(booking.date)}</p>
            </div>

            {/* Star rating */}
            <div>
              <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: '#374151' }}>Your rating</p>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    style={{
                      border: 'none', background: 'none', cursor: 'pointer', padding: 2,
                      fontSize: 28, lineHeight: 1,
                      color: star <= (hovered || rating) ? '#EDAE49' : '#e2e8f0',
                      transition: 'color 0.1s, transform 0.1s',
                      transform: star <= (hovered || rating) ? 'scale(1.1)' : 'scale(1)'
                    }}
                  >★</button>
                ))}
                {(hovered || rating) > 0 && (
                  <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 600, color: '#EDAE49' }}>
                    {labels[hovered || rating]}
                  </span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Your experience <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Tell others what made this experience memorable…"
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
              <button
                onClick={handleSubmit}
                disabled={rating === 0}
                style={{ ...btnPrimary, opacity: rating > 0 ? 1 : 0.5 }}
              >
                Submit Review
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}