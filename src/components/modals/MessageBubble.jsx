export default function MessageBubble({ message, isMine, timestamp, status }) {
  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[70%] group">
        <div
          className={`rounded-2xl px-4 py-2 ${
            isMine
              ? 'bg-[#003D5B] text-white rounded-tr-none'
              : 'bg-gray-100 text-[#003D5B] rounded-tl-none'
          }`}
        >
          <p className="text-sm">{message}</p>
        </div>
        <div className={`flex items-center gap-1 mt-1 text-xs ${isMine ? 'justify-end' : 'justify-start'}`}>
          <span className="text-gray-400">{timestamp}</span>
          {isMine && (
            <span className="text-gray-400">
              {status === 'sending' && '⏳'}
              {status === 'sent' && '✓'}
              {status === 'delivered' && '✓✓'}
              {status === 'read' && '✓✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}