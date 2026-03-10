import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

export default function CalendarViewModel({ isOpen, onClose, bookings }) {
  const [currentMonth, setCurrentMonth] = useState('March 2026');
  
  // Mock calendar data
  const daysInMonth = 31;
  const firstDayOfMonth = 6; // Saturday (0 = Sunday, 1 = Monday, etc.)

  // Group bookings by date
  const bookingsByDate = bookings.reduce((acc, booking) => {
    const date = booking.date.split(',')[0]; // "Feb 24"
    if (!acc[date]) acc[date] = [];
    acc[date].push(booking);
    return acc;
  }, {});

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Generate calendar days
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push({ empty: true });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `Mar ${i}, 2026`;
    const dayBookings = bookingsByDate[`Mar ${i}`] || [];
    days.push({ day: i, bookings: dayBookings });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Calendar View" size="xl">
      <div className="space-y-4">
        {/* Month navigation */}
        <div className="flex items-center justify-between">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            ←
          </button>
          <h2 className="text-xl font-bold text-[#003D5B]">{currentMonth}</h2>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            →
          </button>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Weekday headers */}
          {weekdays.map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-400 py-2">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, index) => (
            <div
              key={index}
              className={`min-h-[100px] p-2 rounded-xl border ${
                day.empty 
                  ? 'border-transparent' 
                  : 'border-gray-100 hover:border-[#EDAE49] cursor-pointer transition-colors'
              }`}
            >
              {!day.empty && (
                <>
                  <p className="text-sm font-bold text-[#003D5B] mb-1">{day.day}</p>
                  {day.bookings.length > 0 && (
                    <>
                      <div className="space-y-1">
                        {day.bookings.slice(0, 2).map(booking => (
                          <div key={booking.id} className="text-xs bg-gray-50 p-1 rounded">
                            <p className="font-medium truncate">{booking.customer.split(' ')[0]}</p>
                          </div>
                        ))}
                      </div>
                      {day.bookings.length > 2 && (
                        <p className="text-xs text-[#EDAE49] mt-1">
                          +{day.bookings.length - 2} more
                        </p>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-100"></div>
            <span className="text-xs text-gray-500">Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#EDAE49]/20"></div>
            <span className="text-xs text-gray-500">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#D1495B]/10"></div>
            <span className="text-xs text-gray-500">Cancelled</span>
          </div>
        </div>

        {/* Close button */}
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}