import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

export default function PayoutModal({ isOpen, onClose, availableBalance, onRequestPayout }) {
  const [amount, setAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('bank');
  const [accountDetails, setAccountDetails] = useState({
    bankName: '',
    accountNumber: '',
    accountName: '',
    phoneNumber: '',
  });

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and decimal
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
    }
  };

  const maxAmount = availableBalance;
  const isValidAmount = amount && parseFloat(amount) > 0 && parseFloat(amount) <= maxAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValidAmount) {
      onRequestPayout({
        amount: parseFloat(amount),
        method: payoutMethod,
        accountDetails: payoutMethod === 'bank' 
          ? { ...accountDetails }
          : { phoneNumber: accountDetails.phoneNumber },
        requestedDate: new Date().toISOString(),
      });
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Payout" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Available balance */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <p className="text-xs text-gray-400 mb-1">Available Balance</p>
          <p className="text-2xl font-bold text-[#003D5B]">${availableBalance.toLocaleString()}</p>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount to Withdraw *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              className="w-full pl-8 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
              placeholder="0.00"
              required
            />
          </div>
          {amount && parseFloat(amount) > maxAmount && (
            <p className="text-xs text-[#D1495B] mt-1">Amount exceeds available balance</p>
          )}
        </div>

        {/* Payout method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payout Method
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPayoutMethod('bank')}
              className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                payoutMethod === 'bank'
                  ? 'border-[#EDAE49] bg-[#EDAE49]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="block text-2xl mb-1">🏦</span>
              <span className="text-sm font-medium">Bank Transfer</span>
            </button>
            <button
              type="button"
              onClick={() => setPayoutMethod('mpesa')}
              className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                payoutMethod === 'mpesa'
                  ? 'border-[#EDAE49] bg-[#EDAE49]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="block text-2xl mb-1">📱</span>
              <span className="text-sm font-medium">M-Pesa</span>
            </button>
          </div>
        </div>

        {/* Account details based on method */}
        {payoutMethod === 'bank' ? (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                value={accountDetails.bankName}
                onChange={(e) => setAccountDetails({...accountDetails, bankName: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
                placeholder="e.g., Equity Bank"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={accountDetails.accountNumber}
                onChange={(e) => setAccountDetails({...accountDetails, accountNumber: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
                placeholder="1234567890"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Name
              </label>
              <input
                type="text"
                value={accountDetails.accountName}
                onChange={(e) => setAccountDetails({...accountDetails, accountName: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
                placeholder="John Doe"
                required
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              M-Pesa Phone Number
            </label>
            <input
              type="tel"
              value={accountDetails.phoneNumber}
              onChange={(e) => setAccountDetails({...accountDetails, phoneNumber: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
              placeholder="0712 345 678"
              required
            />
          </div>
        )}

        {/* Info message */}
        <div className="bg-blue-50 p-3 rounded-xl text-xs text-blue-700">
          ⏱️ Payouts typically take 1-3 business days to process.
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            disabled={!isValidAmount || (payoutMethod === 'bank' 
              ? !accountDetails.bankName || !accountDetails.accountNumber || !accountDetails.accountName
              : !accountDetails.phoneNumber
            )}
          >
            Request Payout
          </Button>
        </div>
      </form>
    </Modal>
  );
}