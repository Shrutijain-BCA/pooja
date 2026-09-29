import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Check, X, CheckCircle, AlertCircle, Users, Calendar, MapPin, Clock, Mail, Phone } from 'lucide-react';
import { getAllBookings, updateBookingStatus } from '../lib/api';
import type { Booking } from '../types/database';
import { formatPrice, formatDate, formatDateTime, getStatusBgClass } from '../lib/helpers';
import { LoadingSpinner } from '../components/Loading';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

export default function AdminBookings() {
  const { bookingId } = useParams<{ bookingId?: string }>();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const b = await getAllBookings();
      setBookings(b);
      if (bookingId) {
        const found = b.find((x) => x.id === bookingId);
        if (found) {
          setSelectedBooking(found);
          setAdminNotes(found.admin_notes || '');
        }
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter && b.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        b.booking_number?.toLowerCase().includes(q) ||
        b.customer_name?.toLowerCase().includes(q) ||
        b.customer_phone?.includes(search) ||
        b.pooja?.name?.toLowerCase().includes(q) ||
        b.location?.name?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAction = async (action: 'CONFIRM' | 'CANCEL' | 'COMPLETED') => {
    if (!selectedBooking) return;
    if (action === 'CANCEL' && !cancelReason.trim()) return;

    setActionLoading(true);
    const extra: any = {};
    if (action === 'CANCEL') extra.cancellation_reason = cancelReason;
    if (action === 'CONFIRM') extra.admin_notes = adminNotes;

    const { error } = await updateBookingStatus(selectedBooking.id, action, extra);
    setActionLoading(false);

    if (error) {
      alert(error);
    } else {
      setShowCancelModal(false);
      setCancelReason('');
      await loadBookings();
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;

  // Detail View
  if (selectedBooking) {
    return (
      <div className="section-container py-8 max-w-4xl">
        <button onClick={() => { setSelectedBooking(null); navigate('/admin/bookings'); }} className="btn-ghost mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Bookings
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-serif font-bold text-temple-900">{selectedBooking.pooja?.name}</h1>
            <p className="text-temple-400 font-mono text-sm mt-1">{selectedBooking.booking_number}</p>
          </div>
          <span className={`badge ${getStatusBgClass(selectedBooking.status)} text-sm px-4 py-1.5`}>
            {selectedBooking.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="card p-6">
            <h2 className="text-lg font-serif font-semibold text-temple-900 mb-4">Booking Details</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-temple-500">Pooja</dt><dd className="font-medium text-temple-900">{selectedBooking.pooja?.name}</dd></div>
              <div className="flex justify-between"><dt className="flex items-center gap-2 text-temple-500"><MapPin className="w-4 h-4" /> Location</dt><dd className="font-medium text-temple-900">{selectedBooking.location?.name}</dd></div>
              <div className="flex justify-between"><dt className="text-temple-500">Date</dt><dd className="font-medium text-temple-900">{formatDate(selectedBooking.preferred_date)}</dd></div>
              {selectedBooking.preferred_time && <div className="flex justify-between"><dt className="text-temple-500">Time</dt><dd className="font-medium text-temple-900">{selectedBooking.preferred_time}</dd></div>}
              <div className="flex justify-between"><dt className="text-temple-500">Devotees</dt><dd className="font-medium text-temple-900">{selectedBooking.number_of_devotees}</dd></div>
              <div className="flex justify-between pt-2 border-t border-temple-50"><dt className="text-temple-700 font-medium">Amount</dt><dd className="text-lg font-bold text-saffron-700">{formatPrice(selectedBooking.amount)}</dd></div>
            </dl>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-serif font-semibold text-temple-900 mb-4">Customer Information</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-temple-500">Name</dt><dd className="font-medium text-temple-900">{selectedBooking.customer_name}</dd></div>
              <div className="flex justify-between"><dt className="text-temple-500">Phone</dt><dd className="font-medium text-temple-900">{selectedBooking.customer_phone}</dd></div>
              <div className="flex justify-between"><dt className="text-temple-500">Email</dt><dd className="font-medium text-temple-900 text-sm truncate">{selectedBooking.customer_email}</dd></div>
              <div className="flex justify-between"><dt className="text-temple-500">Created</dt><dd className="font-medium text-temple-900 text-sm">{formatDateTime(selectedBooking.created_at)}</dd></div>
            </dl>
            {selectedBooking.customer_notes && (
              <div className="mt-4 pt-4 border-t border-temple-50">
                <p className="text-xs text-temple-400 uppercase tracking-wider mb-1">Customer Notes</p>
                <p className="text-sm text-temple-600">{selectedBooking.customer_notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Admin Actions */}
        {selectedBooking.status === 'PENDING' && (
          <div className="card p-6">
            <h2 className="text-lg font-serif font-semibold text-temple-900 mb-4">Actions</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Admin Notes (Optional)</label>
                <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} rows={2} className="input" placeholder="Add notes for this booking..." />
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => handleAction('CONFIRM')} disabled={actionLoading} className="btn-primary bg-green-600 hover:bg-green-700">
                  <Check className="w-4 h-4" /> Confirm Booking
                </button>
                <button onClick={() => setShowCancelModal(true)} disabled={actionLoading} className="btn-primary bg-maroon-600 hover:bg-maroon-700">
                  <X className="w-4 h-4" /> Cancel Booking
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedBooking.status === 'CONFIRMED' && (
          <div className="card p-6">
            <h2 className="text-lg font-serif font-semibold text-temple-900 mb-4">Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => handleAction('COMPLETED')} disabled={actionLoading} className="btn-primary bg-blue-600 hover:bg-blue-700">
                <CheckCircle className="w-4 h-4" /> Mark Completed
              </button>
              <button onClick={() => setShowCancelModal(true)} disabled={actionLoading} className="btn-primary bg-maroon-600 hover:bg-maroon-700">
                <X className="w-4 h-4" /> Cancel Booking
              </button>
            </div>
          </div>
        )}

        {selectedBooking.status === 'CANCELLED' && selectedBooking.cancellation_reason && (
          <div className="card p-4 bg-maroon-50 border-maroon-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-maroon-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-maroon-800">Cancellation Reason</h3>
                <p className="text-sm text-maroon-600 mt-1">{selectedBooking.cancellation_reason}</p>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-serif font-semibold text-temple-900 mb-2">Cancel Booking</h3>
              <p className="text-sm text-temple-500 mb-4">Please provide a reason for cancelling this booking.</p>
              <textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} rows={3} className="input" placeholder="Cancellation reason..." />
              <div className="flex gap-3 mt-4">
                <button onClick={() => { setShowCancelModal(false); setCancelReason(''); }} className="btn-secondary flex-1">Close</button>
                <button onClick={() => handleAction('CANCEL')} disabled={!cancelReason.trim() || actionLoading} className="btn-primary bg-maroon-600 hover:bg-maroon-700 flex-1">
                  {actionLoading ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // List View
  return (
    <div className="section-container py-8">
      <h1 className="text-3xl font-serif font-bold text-temple-900 mb-6">Manage Bookings</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-temple-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by booking ID, name, phone..." className="input pl-10" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input sm:w-48">
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {filteredBookings.length === 0 ? (
        <EmptyState icon={Search} title="No Bookings Found" description="No bookings match your search." />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-temple-50 text-temple-500">
                <tr>
                  <th className="text-left p-3 font-medium">Booking ID</th>
                  <th className="text-left p-3 font-medium">Customer</th>
                  <th className="text-left p-3 font-medium">Pooja</th>
                  <th className="text-left p-3 font-medium">Location</th>
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">Amount</th>
                  <th className="text-left p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-temple-50">
                {filteredBookings.map((b) => (
                  <tr key={b.id} onClick={() => { setSelectedBooking(b); setAdminNotes(b.admin_notes || ''); navigate(`/admin/bookings/${b.id}`); }} className="cursor-pointer hover:bg-temple-50 transition-colors">
                    <td className="p-3 font-mono text-xs text-temple-600">{b.booking_number}</td>
                    <td className="p-3">
                      <p className="font-medium text-temple-900">{b.customer_name}</p>
                      <p className="text-xs text-temple-400">{b.customer_phone}</p>
                    </td>
                    <td className="p-3 text-temple-700">{b.pooja?.name}</td>
                    <td className="p-3 text-temple-700">{b.location?.name}</td>
                    <td className="p-3 text-temple-600">{formatDate(b.preferred_date)}</td>
                    <td className="p-3 font-semibold text-saffron-700">{formatPrice(b.amount)}</td>
                    <td className="p-3"><span className={`badge ${getStatusBgClass(b.status)} text-xs`}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
