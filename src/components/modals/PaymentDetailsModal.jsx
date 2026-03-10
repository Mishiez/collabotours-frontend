import Modal from '../common/Modal';
import Button from '../common/Button';

export default function PaymentDetailsModal({ isOpen, onClose, payment }) {
  if (!payment) return null;

  const paymentStatusColors = {
    completed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-[#EDAE49]/20 text-[#b87a00]',
    refunded: 'bg-gray-100 text-gray-500',
  };

  // Mock additional payment details
  const paymentDetails = {
    createdAt: 'Feb 24, 2026 - 10:30 AM',
    processedAt: payment.status === 'completed' ? 'Feb 24, 2026 - 10:35 AM' : 'Pending',
    fee: '$3.20',
    netAmount: `$${parseInt(payment.amount.slice(1)) - 3.20}`,
    receipt: `RCPT-${payment.id.slice(5)}`,
    bookingId: `BK-00${payment.id.slice(7)}`,
  };

  const handleViewReceipt = () => {
    alert('Receipt download feature coming soon!');
  };

  const handleRefund = () => {
    alert('Refund feature coming soon!');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Payment Details" size="lg">
      <div className="space-y-6">
        {/* Header with status */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Payment ID</p>
            <p className="text-xl font-bold text-[#003D5B]">{payment.id}</p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${paymentStatusColors[payment.status]}`}>
            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
          </span>
        </div>

        {/* Customer info */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="font-semibold text-[#003D5B] mb-3">Customer Information</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#003D5B] flex items-center justify-center text-white font-bold text-lg">
              {payment.customer.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="font-bold text-[#003D5B]">{payment.customer}</p>
              <p className="text-sm text-gray-500">{payment.customer.toLowerCase().replace(' ', '.')}@email.com</p>
              <p className="text-sm text-gray-500">+254 700 000000</p>
            </div>
          </div>
        </div>

        {/* Payment details grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-xl">
            <p className="text-xs text-gray-400">Service</p>
            <p className="font-semibold text-[#003D5B]">{payment.service}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl">
            <p className="text-xs text-gray-400">Booking ID</p>
            <p className="font-semibold text-[#00798C]">{paymentDetails.bookingId}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl">
            <p className="text-xs text-gray-400">Date</p>
            <p className="font-semibold text-[#003D5B]">{payment.date}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl">
            <p className="text-xs text-gray-400">Amount</p>
            <p className="font-semibold text-[#EDAE49] text-lg">{payment.amount}</p>
          </div>
        </div>

        {/* Payment method details */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="font-semibold text-[#003D5B] mb-3">Payment Method</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-xl">
              {payment.method === 'Credit Card' ? '💳' : payment.method === 'Bank Transfer' ? '🏦' : '📱'}
            </div>
            <div>
              <p className="font-medium text-[#003D5B]">{payment.method}</p>
              <p className="text-xs text-gray-400">Transaction ID: {payment.transactionId}</p>
            </div>
          </div>
        </div>

        {/* Financial breakdown */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="font-semibold text-[#003D5B] mb-3">Financial Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium text-[#003D5B]">{payment.amount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Platform Fee</span>
              <span className="font-medium text-[#003D5B]">{paymentDetails.fee}</span>
            </div>
            <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-bold">
              <span className="text-[#003D5B]">Net Amount</span>
              <span className="text-[#EDAE49]">{paymentDetails.netAmount}</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="font-semibold text-[#003D5B] mb-3">Payment Timeline</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500" />
              <div>
                <p className="text-sm font-medium text-[#003D5B]">Payment Created</p>
                <p className="text-xs text-gray-400">{paymentDetails.createdAt}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 mt-2 rounded-full ${payment.status === 'completed' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
              <div>
                <p className="text-sm font-medium text-[#003D5B]">Payment Processed</p>
                <p className="text-xs text-gray-400">{paymentDetails.processedAt}</p>
              </div>
            </div>
            {payment.status === 'refunded' && (
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-[#D1495B]" />
                <div>
                  <p className="text-sm font-medium text-[#003D5B]">Refunded</p>
                  <p className="text-xs text-gray-400">Feb 28, 2026 - 2:15 PM</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" size="md" className="flex-1" onClick={handleViewReceipt}>
            🧾 View Receipt
          </Button>
          {payment.status === 'completed' && (
            <Button 
              variant="outline" 
              size="md" 
              className="flex-1 border-[#D1495B] text-[#D1495B] hover:bg-[#D1495B]/5"
              onClick={handleRefund}
            >
              ↩️ Refund
            </Button>
          )}
          <Button variant="primary" size="md" className="flex-1" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}