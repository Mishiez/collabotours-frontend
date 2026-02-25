// // Payments.jsx
// export default function Payments() {
//   return <div className="p-8"><h1 className="text-2xl font-bold text-[#003D5B]">Payments</h1><p className="text-gray-400 mt-2">Coming soon...</p></div>;
// }


import { useState } from 'react';
import Button from '../components/common/Button';

const payments = [
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
];

const paymentStatusColors = {
  completed: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-[#EDAE49]/20 text-[#b87a00]',
  refunded: 'bg-gray-100 text-gray-500',
};

export default function Payments() {
  const [timeframe, setTimeframe] = useState('month');

  // Calculate totals
  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + parseInt(p.amount.slice(1)), 0);
  
  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + parseInt(p.amount.slice(1)), 0);

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
          <Button variant="outline" size="md" icon="📥">Export</Button>
          <Button variant="primary" size="md" icon="💰">Payout</Button>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-xs text-gray-400 mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-[#003D5B]">${totalRevenue}</p>
          <p className="text-xs text-emerald-500 mt-2">↑ 8% from last {timeframe}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-xs text-gray-400 mb-2">Pending Payments</p>
          <p className="text-3xl font-bold text-[#EDAE49]">${pendingAmount}</p>
          <p className="text-xs text-gray-400 mt-2">{payments.filter(p => p.status === 'pending').length} transactions</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-xs text-gray-400 mb-2">Completed Transactions</p>
          <p className="text-3xl font-bold text-[#003D5B]">{payments.filter(p => p.status === 'completed').length}</p>
          <p className="text-xs text-gray-400 mt-2">This {timeframe}</p>
        </div>
      </div>

      {/* Filters and Timeframe */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search payments..."
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
            />
          </div>
          <select className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20">
            <option>All Payment Methods</option>
            <option>Credit Card</option>
            <option>Bank Transfer</option>
            <option>Mobile Money</option>
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
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
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
                    <span className="text-xs text-gray-400">{payment.transactionId}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-400">Showing 1-4 of 4 payments</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-lg border border-gray-200 text-gray-400 hover:border-[#EDAE49] hover:text-[#EDAE49] transition-colors">←</button>
            <button className="px-3 py-1 rounded-lg bg-[#003D5B] text-white">1</button>
            <button className="px-3 py-1 rounded-lg border border-gray-200 text-gray-400 hover:border-[#EDAE49] hover:text-[#EDAE49] transition-colors">→</button>
          </div>
        </div>
      </div>
    </div>
  );
}