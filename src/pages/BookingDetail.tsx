import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Mail, Phone, FileText, Check, X, AlertCircle, ArrowRight } from 'lucide-react';
import { getBookingById } from '../lib/api';
import { supabase } from '../lib/supabase';
import type { Booking } from '../types/database';
import { formatPrice, formatDate, formatDateTime, getStatusBgClass, getStatusDotClass } from '../lib/helpers';
import { LoadingSpinner } from '../components/Loading';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

export default function BookingDetail() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!bookingId) return;
    (async () => {
      try {
        const b = await getBookingById(bookingId);
        setBooking(b);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();

    // Realtime subscription
    const channel = supabase
      .channel('booking-updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'bookings', filter: `id=eq.${bookingId}` },
        (payload: any) => {
          setBooking((prev) => prev ? { ...prev, ...payload.new } : prev);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookingId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;
  if (!booking) return (
    <EmptyState
      icon={FileText}
      title="Booking Not Found"
      description="This booking doesn't exist or you don't have access to it."
      action={<Link to="/my-bookings" className="btn-primary">View My Bookings</Link>}
    />
  );

  const isCancelled = booking.status === 'CANCELLED';
  const isConfirmed = ['CONFIRMED', 'COMPLETED'].includes(booking.status);
  const isCompleted = booking.status === 'COMPLETED';

  return (
    <div className="section-container py-8 max-w-4xl">
      <nav className="text-sm text-temple-400 mb-4">
        <Link to="/my-bookings" className="hover:text-saffron-600">My Bookings</Link>
        <span className="mx-2">/</span>
        <span className="text-temple-700">{booking.booking_number}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-temple-900">
            {booking.pooja?.name}
          </h1>
          <p className="text-temple-400 font-mono text-sm mt-1">{booking.booking_number}</p>
        </div>
        <span className={`badge ${getStatusBgClass(booking.status)} text-sm px-4 py-1.5`}>
          <span className={`w-2 h-2 rounded-full ${getStatusDotClass(booking.status)}`} />
          {booking.status}
        </span>
      </div>

      {isCancelled && booking.cancellation_reason && (
        <div className="card p-4 mb-6 bg-maroon-50 border-maroon-200">
          <div className="flex items-start gap-3">
            <X className="w-5 h-5 text-maroon-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-maroon-800">Booking Cancelled</h3>
              <p className="text-sm text-maroon-600 mt-1">Reason: {booking.cancellation_reason}</p>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-serif font-semibold text-temple-900 mb-6">Booking Timeline</h2>
        <div className="space-y-1">
          {/* Step 1: Submitted */}
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              true ? 'bg-green-100 text-green-600' : 'bg-temple-100 text-temple-400'
            }`}>
              <Check className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-temple-900">Booking Request Submitted</p>
              <p className="text-sm text-temple-400">{formatDateTime(booking.created_at)}</p>
            </div>
          </div>

          {/* Connector */}
          <div className={`ml-5 w-0.5 h-8 ${isConfirmed || isCancelled ? 'bg-green-300' : 'bg-temple-100'}`} />

          {/* Step 2: Confirmed or Cancelled */}
          {isCancelled ? (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-maroon-100 text-maroon-600 flex items-center justify-center shrink-0">
                <X className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-maroon-800">Booking Cancelled</p>
                <p className="text-sm text-maroon-400">{formatDateTime(booking.updated_at)}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  isConfirmed ? 'bg-green-100 text-green-600' : 'bg-temple-100 text-temple-400'
                }`}>
                  {isConfirmed ? <Check className="w-5 h-5" /> : <div className="w-3 h-3 rounded-full border-2 border-current" />}
                </div>
                <div>
                  <p className={`font-medium ${isConfirmed ? 'text-temple-900' : 'text-temple-400'}`}>
                    Booking Confirmed
                  </p>
                  {isConfirmed && <p className="text-sm text-temple-400">{formatDateTime(booking.updated_at)}</p>}
                </div>
              </div>

              <div className={`ml-5 w-0.5 h-8 ${isCompleted ? 'bg-green-300' : 'bg-temple-100'}`} />

              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  isCompleted ? 'bg-blue-100 text-blue-600' : 'bg-temple-100 text-temple-400'
                }`}>
                  {isCompleted ? <Check className="w-5 h-5" /> : <div className="w-3 h-3 rounded-full border-2 border-current" />}
                </div>
                <div>
                  <p className={`font-medium ${isCompleted ? 'text-temple-900' : 'text-temple-400'}`}>
                    Pooja Completed
                  </p>
                  {isCompleted && <p className="text-sm text-temple-400">{formatDateTime(booking.updated_at)}</p>}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Booking Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-serif font-semibold text-temple-900 mb-4">Booking Details</h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="flex items-center gap-2 text-temple-500 text-sm">
                <MapPin className="w-4 h-4" /> Location
              </dt>
              <dd className="font-medium text-temple-900 text-sm">{booking.location?.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="flex items-center gap-2 text-temple-500 text-sm">
                <Calendar className="w-4 h-4" /> Date
              </dt>
              <dd className="font-medium text-temple-900 text-sm">{formatDate(booking.preferred_date)}</dd>
            </div>
            {booking.preferred_time && (
              <div className="flex justify-between">
                <dt className="flex items-center gap-2 text-temple-500 text-sm">
                  <Clock className="w-4 h-4" /> Time
                </dt>
                <dd className="font-medium text-temple-900 text-sm">{booking.preferred_time}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="flex items-center gap-2 text-temple-500 text-sm">
                <Users className="w-4 h-4" /> Devotees
              </dt>
              <dd className="font-medium text-temple-900 text-sm">{booking.number_of_devotees}</dd>
            </div>
            <div className="flex justify-between pt-3 border-t border-temple-50">
              <dt className="text-temple-700 font-medium">Amount</dt>
              <dd className="text-lg font-bold text-saffron-700">{formatPrice(booking.amount)}</dd>
            </div>
          </dl>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-serif font-semibold text-temple-900 mb-4">Customer Information</h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-temple-500 text-sm">Name</dt>
              <dd className="font-medium text-temple-900 text-sm">{booking.customer_name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="flex items-center gap-2 text-temple-500 text-sm">
                <Phone className="w-4 h-4" /> Phone
              </dt>
              <dd className="font-medium text-temple-900 text-sm">{booking.customer_phone}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="flex items-center gap-2 text-temple-500 text-sm">
                <Mail className="w-4 h-4" /> Email
              </dt>
              <dd className="font-medium text-temple-900 text-sm truncate ml-2">{booking.customer_email}</dd>
            </div>
          </dl>
          {booking.customer_notes && (
            <div className="mt-4 pt-4 border-t border-temple-50">
              <p className="text-xs text-temple-400 uppercase tracking-wider mb-1">Notes</p>
              <p className="text-sm text-temple-600">{booking.customer_notes}</p>
            </div>
          )}
          {booking.admin_notes && (
            <div className="mt-4 pt-4 border-t border-temple-50">
              <p className="text-xs text-temple-400 uppercase tracking-wider mb-1">Admin Notes</p>
              <p className="text-sm text-temple-600">{booking.admin_notes}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <Link to="/my-bookings" className="btn-secondary">
          <ArrowRight className="w-4 h-4 rotate-180" /> Back to My Bookings
        </Link>
      </div>
    </div>
  );
}
