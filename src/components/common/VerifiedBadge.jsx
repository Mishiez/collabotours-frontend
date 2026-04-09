export default function VerifiedBadge({ isVerified, size = 'sm' }) {
  if (!isVerified) return null;
  
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };
  
  return (
    <span className={`inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 rounded-full ${sizes[size]}`}>
      <span className="text-sm">✅</span>
      <span className="font-medium">Verified</span>
    </span>
  );
}