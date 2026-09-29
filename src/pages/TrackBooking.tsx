import { useState } from 'react';
import { Search, Calendar, MapPin, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { getBookingByNumberAndPhone } from '../lib/api';
import type { Booking } from '../types/database';
import { formatDate, getStatusBgClass, getStatusDotClass } from '../lib/helpers';

export default function TrackBooking() {
  const [bookingNumber, setBookingNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingNumber.trim() || !phone.trim()) return;
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const b = await getBookingByNumberAndPhone(bookingNumber.trim(), phone.trim());
      setBooking(b);
      if (!b) {
        setError('No booking found with the provided details. Please check your Booking ID and Mobile Number.');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container py-12 max-w-2xl">
      <div className="text-center mb-8">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-temple-50 flex items-center justify-center mb-4">
          <Search className="w-7 h-7 text-temple-500" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-temple-900">Track Your Booking</h1>
        <p className="text-temple-500 mt-2">Enter your booking ID and mobile number to check status</p>
      </div>

      <div className="card p-6 mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="label">Booking ID</label>
            <input
              type="text"
              value={bookingNumber}
              onChange={(e) => setBookingNumber(e.target.value)}
              required
              placeholder="PP-2026-00001"
              className="input font-mono"
            />
          </div>
          <div>
            <label className="label">Mobile Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="+91 98765 43210"
              className="input"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Searching...' : 'Track Booking'} {!loading && <Search className="w-4 h-4" />}
          </button>
        </form>
      </div>

      {/* Error */}
      {error && !booking && searched && (
        <div className="card p-6 text-center">
          <AlertCircle className="w-10 h-10 text-maroon-400 mx-auto mb-3" />
          <h3 className="font-medium text-temple-900 mb-1">Booking Not Found</h3>
          <p className="text-sm text-temple-500">{error}</p>
        </div>
      )}

      {/* Result */}
      {booking && (
        <div className="card p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-temple-100">
            <div>
              <p className="text-xs text-temple-400 uppercase tracking-wider">Booking ID</p>
              <p className="text-lg font-serif font-bold text-temple-900 font-mono">{booking.booking_number}</p>
            </div>
            <span className={`badge ${getStatusBgClass(booking.status)} text-sm px-4 py-1.5`}>
              <span className={`w-2 h-2 rounded-full ${getStatusDotClass(booking.status)}`} />
              {booking.status}
            </span>
          </div>

          <dl className="space-y-3">
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-temple-500 text-sm">
                <FileText className="w-4 h-4" /> Pooja
              </dt>
              <dd className="font-medium text-temple-900">{booking.pooja?.name}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-temple-500 text-sm">
                <MapPin className="w-4 h-4" /> Location
              </dt>
              <dd className="font-medium text-temple-900">{booking.location?.name}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-temple-500 text-sm">
                <Calendar className="w-4 h-4" /> Date
              </dt>
              <dd className="font-medium text-temple-900">{formatDate(booking.preferred_date)}</dd>
            </div>
          </dl>

          {booking.status === 'PENDING' && (
            <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
              <p className="text-sm text-amber-700">
                Your booking is pending review. Our team will contact you soon to confirm.
              </p>
            </div>
          )}
          {booking.status === 'CONFIRMED' && (
            <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200">
              <p className="text-sm text-green-700">
                Your booking has been confirmed. Our team will contact you with further details.
              </p>
            </div>
          )}
          {booking.status === 'CANCELLED' && (
            <div className="mt-4 p-3 rounded-lg bg-maroon-50 border border-maroon-200">
              <p className="text-sm text-maroon-700">
                This booking has been cancelled. {booking.cancellation_reason && `Reason: ${booking.cancellation_reason}`}
              </p>
            </div>
          )}
          {booking.status === 'COMPLETED' && (
            <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-sm text-blue-700">
                This pooja has been completed. Thank you for choosing Pooja Palace.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
