import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

export default function ExportModal({ isOpen, onClose, onExport }) {
  const [format, setFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [includeFields, setIncludeFields] = useState({
    id: true,
    customer: true,
    service: true,
    date: true,
    amount: true,
    method: true,
    status: true,
    transactionId: true,
  });

  const formats = [
    { id: 'csv', name: 'CSV', icon: '📊', desc: 'Comma-separated values (Excel compatible)' },
    { id: 'pdf', name: 'PDF', icon: '📄', desc: 'PDF document with formatting' },
    { id: 'excel', name: 'Excel', icon: '📑', desc: 'Excel spreadsheet (.xlsx)' },
  ];

  const dateRanges = [
    { id: 'all', name: 'All Time' },
    { id: 'month', name: 'This Month' },
    { id: 'quarter', name: 'This Quarter' },
    { id: 'year', name: 'This Year' },
    { id: 'custom', name: 'Custom Range' },
  ];

  const handleFieldToggle = (field) => {
    setIncludeFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleExport = () => {
    const options = {
      format,
      dateRange,
      customStart: dateRange === 'custom' ? customStart : null,
      customEnd: dateRange === 'custom' ? customEnd : null,
      includeFields,
    };
    onExport(options);
    onClose();
  };

  const selectAll = () => {
    const allTrue = Object.keys(includeFields).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setIncludeFields(allTrue);
  };

  const deselectAll = () => {
    const allFalse = Object.keys(includeFields).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});
    setIncludeFields(allFalse);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Payments" size="lg">
      <div className="space-y-6">
        {/* Format selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Export Format
          </label>
          <div className="grid grid-cols-3 gap-3">
            {formats.map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFormat(f.id)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  format === f.id
                    ? 'border-[#EDAE49] bg-[#EDAE49]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="block text-2xl mb-1">{f.icon}</span>
                <span className="text-sm font-medium">{f.name}</span>
                <span className="text-xs text-gray-400 block mt-1">{f.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {dateRanges.map(range => (
              <button
                key={range.id}
                onClick={() => setDateRange(range.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  dateRange === range.id
                    ? 'bg-[#003D5B] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {range.name}
              </button>
            ))}
          </div>

          {/* Custom date range */}
          {dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Start Date</label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">End Date</label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EDAE49]/20"
                />
              </div>
            </div>
          )}
        </div>

        {/* Fields to include */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Fields to Include
            </label>
            <div className="flex gap-2">
              <button
                onClick={selectAll}
                className="text-xs text-[#00798C] hover:underline"
              >
                Select All
              </button>
              <span className="text-xs text-gray-300">|</span>
              <button
                onClick={deselectAll}
                className="text-xs text-gray-400 hover:underline"
              >
                Deselect All
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(includeFields).map(([field, value]) => (
              <label key={field} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleFieldToggle(field)}
                  className="rounded border-gray-300 text-[#EDAE49] focus:ring-[#EDAE49]"
                />
                <span className="text-sm text-gray-700 capitalize">
                  {field.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Email report option */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 text-[#EDAE49] focus:ring-[#EDAE49]" />
            <div>
              <p className="text-sm font-medium text-[#003D5B]">Email me when ready</p>
              <p className="text-xs text-gray-400">We'll send the exported file to your email</p>
            </div>
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleExport}>
            Export {format.toUpperCase()}
          </Button>
        </div>
      </div>
    </Modal>
  );
}