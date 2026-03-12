import { useState, useEffect } from 'react';
import Button from '../components/common/Button';
import PayoutModal from '../components/modals/PayoutModal';
import PaymentDetailsModal from '../components/modals/PaymentDetailsModal';
import ExportModal from '../components/modals/ExportModal';
import { 
  fetchPayments, 
  createPayment, 
  updatePayment, 
  refundPayment,
  deletePayment 
} from '../services/api';

const paymentStatusColors = {
  completed: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-[#EDAE49]/20 text-[#b87a00]',
  refunded: 'bg-gray-100 text-gray-500',
};

export default function Payments() {
  // State for payments data
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [timeframe, setTimeframe] = useState('month');
  
  // Modal states
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [isPaymentDetailsModalOpen, setIsPaymentDetailsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch payments from backend
  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const response = await fetchPayments();
      console.log('Payments loaded:', response.data);
      setPayments(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to load payments:', err);
      setError('Could not load payments. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions to extract data safely
  const getPaymentId = (payment) => {
    return payment.payment_id || payment.id || '#Unknown';
  };

  const getCustomerName = (payment) => {
    return payment.booking?.customer || payment.customer || 'Unknown';
  };

  const getServiceName = (payment) => {
    return payment.booking?.service?.name || payment.service || 'Unknown';
  };

  const getPaymentDate = (payment) => {
    const dateStr = payment.created_at || payment.date;
    if (!dateStr) return 'Unknown';
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  const getPaymentAmount = (payment) => {
    const amount = parseFloat(payment.amount) || 0;
    return `$${amount.toFixed(2)}`;
  };

  const getPaymentMethod = (payment) => {
    return payment.method || 'Unknown';
  };

  const getPaymentStatus = (payment) => {
    return payment.status || 'pending';
  };

  const getTransactionId = (payment) => {
    return payment.transaction_id || payment.transactionId || 'N/A';
  };

  const getAvatarInitials = (customerName) => {
    return customerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Get unique payment methods for filter
  const paymentMethods = ['All', ...new Set(payments.map(p => p.method).filter(Boolean))];

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const customerName = getCustomerName(payment).toLowerCase();
    const paymentId = getPaymentId(payment).toLowerCase();
    const transactionId = getTransactionId(payment).toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    
    const matchesSearch = 
      customerName.includes(searchLower) ||
      paymentId.includes(searchLower) ||
      transactionId.includes(searchLower);
    
    const matchesMethod = methodFilter === 'All' || payment.method === methodFilter;
    const matchesStatus = statusFilter === 'All' || payment.status === statusFilter;
    
    // Date range filtering
    let matchesDate = true;
    if (timeframe === 'month' && payment.created_at) {
      const paymentDate = new Date(payment.created_at);
      const now = new Date();
      matchesDate = paymentDate.getMonth() === now.getMonth() &&
                    paymentDate.getFullYear() === now.getFullYear();
    }
    // Add more date range logic as needed
    
    return matchesSearch && matchesMethod && matchesStatus && matchesDate;
  });

  // Calculate totals from real data
  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

  const completedCount = payments.filter(p => p.status === 'completed').length;

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setIsPaymentDetailsModalOpen(true);
  };

  const handleRequestPayout = (payoutData) => {
    console.log('Payout requested:', payoutData);
    alert(`Payout request for $${payoutData.amount} submitted successfully!`);
  };

  const handleExport = (exportOptions) => {
    console.log('Export options:', exportOptions);
    alert(`Exporting as ${exportOptions.format.toUpperCase()}...`);
  };

  const handleStatCardClick = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#00798C] mb-1">
            Financial Overview
          </p>
          <h1 className="text-3xl font-bold text-[#003D5B]">Payments</h1>
          <p className="text-gray-400 text-sm mt-1">Track your revenue and payment history</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="md" 
            icon="📥"
            onClick={() => setIsExportModalOpen(true)}
          >
            Export
          </Button>
          <Button 
            variant="primary" 
            size="md" 
            icon="💰"
            onClick={() => setIsPayoutModalOpen(true)}
          >
            Payout
          </Button>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div 
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 cursor-pointer hover:shadow-md transition-all"
          onClick={() => handleStatCardClick('All')}
        >
          <p className="text-xs text-gray-400 mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-[#003D5B]">${totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-emerald-500 mt-2">↑ 8% from last {timeframe}</p>
        </div>
        <div 
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 cursor-pointer hover:shadow-md transition-all"
          onClick={() => handleStatCardClick('pending')}
        >
          <p className="text-xs text-gray-400 mb-2">Pending Payments</p>
          <p className="text-3xl font-bold text-[#EDAE49]">${pendingAmount.toFixed(2)}</p>
          <p className="text-xs text-gray-400 mt-2">{payments.filter(p => p.status === 'pending').length} transactions</p>
        </div>
        <div 
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 cursor-pointer hover:shadow-md transition-all"
          onClick={() => handleStatCardClick('completed')}
        >
          <p className="text-xs text-gray-400 mb-2">Completed Transactions</p>
          <p className="text-3xl font-bold text-[#003D5B]">{completedCount}</p>
          <p className="text-xs text-gray-400 mt-2">This {timeframe}</p>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Loading payments...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <>
          {/* Filters and Timeframe */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search payments by customer, ID, or transaction..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
                />
              </div>
              <select 
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
              >
                {paymentMethods.map(method => (
                  <option key={method} value={method}>
                    {method === 'All' ? 'All Payment Methods' : method}
                  </option>
                ))}
              </select>
              <select 
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>

            {/* Status filter chips */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
              {['All', 'completed', 'pending', 'refunded'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                    statusFilter === status
                      ? status === 'All' 
                        ? 'bg-[#003D5B] text-white'
                        : paymentStatusColors[status]
                      : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedPayments.length > 0 ? (
                    paginatedPayments.map((payment) => (
                      <tr 
                        key={payment.id} 
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleViewDetails(payment)}
                      >
                        <td className="px-6 py-4 font-medium text-[#003D5B]">{getPaymentId(payment)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#003D5B]/10 flex items-center justify-center text-[#003D5B] font-bold text-xs">
                              {getAvatarInitials(getCustomerName(payment))}
                            </div>
                            <span className="font-medium">{getCustomerName(payment)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">{getServiceName(payment)}</td>
                        <td className="px-6 py-4 text-sm">{getPaymentDate(payment)}</td>
                        <td className="px-6 py-4 font-bold text-[#EDAE49]">{getPaymentAmount(payment)}</td>
                        <td className="px-6 py-4">
                          <span className="text-sm">{getPaymentMethod(payment)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${paymentStatusColors[getPaymentStatus(payment)]}`}>
                            {getPaymentStatus(payment)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-gray-400 font-mono">{getTransactionId(payment)}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center text-gray-400">
                        No payments found matching your filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {filteredPayments.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  Showing {((currentPage - 1) * itemsPerPage) + 1}-
                  {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of {filteredPayments.length} payments
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-lg border border-gray-200 text-gray-400 hover:border-[#EDAE49] hover:text-[#EDAE49] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ←
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        currentPage === i + 1 
                          ? 'bg-[#003D5B] text-white' 
                          : 'border border-gray-200 text-gray-400 hover:border-[#EDAE49] hover:text-[#EDAE49]'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-lg border border-gray-200 text-gray-400 hover:border-[#EDAE49] hover:text-[#EDAE49] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modals */}
      <PayoutModal 
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        availableBalance={totalRevenue - 500} // Mock available balance
        onRequestPayout={handleRequestPayout}
      />

      <PaymentDetailsModal 
        isOpen={isPaymentDetailsModalOpen}
        onClose={() => {
          setIsPaymentDetailsModalOpen(false);
          setSelectedPayment(null);
        }}
        payment={selectedPayment}
      />

      <ExportModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
}