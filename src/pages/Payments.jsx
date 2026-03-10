import { useState } from 'react';
import Button from '../components/common/Button';
import PayoutModal from '../components/modals/PayoutModal';
import PaymentDetailsModal from '../components/modals/PaymentDetailsModal';
import ExportModal from '../components/modals/ExportModal';

const initialPayments = [
  {
    id: '#PAY-001',
    customer: 'Sarah Mitchell',
    service: 'Safari Day Tour',
    date: 'Feb 24, 2026',
    amount: '$320',
    status: 'completed',
    method: 'Credit Card',
    transactionId: 'TXN-123456',
  },
  {
    id: '#PAY-002',
    customer: 'James Omondi',
    service: 'Beach Getaway Package',
    date: 'Feb 25, 2026',
    amount: '$550',
    status: 'pending',
    method: 'Bank Transfer',
    transactionId: 'TXN-123457',
  },
  {
    id: '#PAY-003',
    customer: 'Aisha Kamau',
    service: 'Cultural City Walk',
    date: 'Feb 26, 2026',
    amount: '$80',
    status: 'completed',
    method: 'Mobile Money',
    transactionId: 'TXN-123458',
  },
  {
    id: '#PAY-004',
    customer: 'Tom Weber',
    service: 'Sunset Cruise',
    date: 'Feb 27, 2026',
    amount: '$200',
    status: 'refunded',
    method: 'Credit Card',
    transactionId: 'TXN-123459',
  },
  {
    id: '#PAY-005',
    customer: 'Priya Nair',
    service: 'Mountain Hiking Trip',
    date: 'Mar 1, 2026',
    amount: '$430',
    status: 'completed',
    method: 'Credit Card',
    transactionId: 'TXN-123460',
  },
  {
    id: '#PAY-006',
    customer: 'Michael Ochieng',
    service: 'Hot Air Balloon Ride',
    date: 'Mar 2, 2026',
    amount: '$450',
    status: 'pending',
    method: 'Mobile Money',
    transactionId: 'TXN-123461',
  },
];

const paymentStatusColors = {
  completed: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-[#EDAE49]/20 text-[#b87a00]',
  refunded: 'bg-gray-100 text-gray-500',
};

export default function Payments() {
  // State for payments data
  const [payments, setPayments] = useState(initialPayments);
  
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

  // Get unique payment methods for filter
  const paymentMethods = ['All', ...new Set(payments.map(p => p.method))];

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMethod = methodFilter === 'All' || payment.method === methodFilter;
    const matchesStatus = statusFilter === 'All' || payment.status === statusFilter;
    
    // Date range filtering (simplified for demo)
    let matchesDate = true;
    if (timeframe === 'month') {
      matchesDate = payment.date.includes('Feb') || payment.date.includes('Mar');
    }
    
    return matchesSearch && matchesMethod && matchesStatus && matchesDate;
  });

  // Calculate totals
  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + parseInt(p.amount.slice(1)), 0);
  
  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + parseInt(p.amount.slice(1)), 0);

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
          <p className="text-3xl font-bold text-[#003D5B]">${totalRevenue}</p>
          <p className="text-xs text-emerald-500 mt-2">↑ 8% from last {timeframe}</p>
        </div>
        <div 
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 cursor-pointer hover:shadow-md transition-all"
          onClick={() => handleStatCardClick('pending')}
        >
          <p className="text-xs text-gray-400 mb-2">Pending Payments</p>
          <p className="text-3xl font-bold text-[#EDAE49]">${pendingAmount}</p>
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
                    <td className="px-6 py-4 font-medium text-[#003D5B]">{payment.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#003D5B]/10 flex items-center justify-center text-[#003D5B] font-bold text-xs">
                          {payment.customer.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium">{payment.customer}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{payment.service}</td>
                    <td className="px-6 py-4 text-sm">{payment.date}</td>
                    <td className="px-6 py-4 font-bold text-[#EDAE49]">{payment.amount}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm">{payment.method}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${paymentStatusColors[payment.status]}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-400 font-mono">{payment.transactionId}</span>
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