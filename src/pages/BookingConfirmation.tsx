import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, Users, ArrowRight, Clock } from 'lucide-react';
import { getBookingById } from '../lib/api';
import type { Booking } from '../types/database';
import { formatPrice, formatDate, getStatusBgClass } from '../lib/helpers';
import { LoadingSpinner } from '../components/Loading';
import ErrorState from '../components/ErrorState';

export default function BookingConfirmation() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!bookingId) return;
    getBookingById(bookingId)
      .then((b) => setBooking(b))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [bookingId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;
  if (!booking) return <ErrorState message="Booking not found" />;

  return (
    <div className="section-container py-12 max-w-2xl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-temple-900">
          Booking Request Submitted Successfully
        </h1>
        <p className="text-temple-500 mt-2 max-w-md mx-auto">
          Our team will review your request and contact you to confirm availability.
        </p>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-temple-100">
          <div>
            <p className="text-xs text-temple-400 uppercase tracking-wider">Booking ID</p>
            <p className="text-lg font-serif font-bold text-temple-900">{booking.booking_number}</p>
          </div>
          <span className={`badge ${getStatusBgClass(booking.status)}`}>
            {booking.status}
          </span>
        </div>

        <dl className="space-y-4">
          <div className="flex items-center justify-between">
            <dt className="flex items-center gap-2 text-temple-500">
              <MapPin className="w-4 h-4" /> Pooja
            </dt>
            <dd className="font-medium text-temple-900">{booking.pooja?.name}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="flex items-center gap-2 text-temple-500">
              <MapPin className="w-4 h-4" /> Location
            </dt>
            <dd className="font-medium text-temple-900">{booking.location?.name}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="flex items-center gap-2 text-temple-500">
              <Calendar className="w-4 h-4" /> Date
            </dt>
            <dd className="font-medium text-temple-900">{formatDate(booking.preferred_date)}</dd>
          </div>
          {booking.preferred_time && (
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-temple-500">
                <Clock className="w-4 h-4" /> Time
              </dt>
              <dd className="font-medium text-temple-900">{booking.preferred_time}</dd>
            </div>
          )}
          <div className="flex items-center justify-between">
            <dt className="flex items-center gap-2 text-temple-500">
              <Users className="w-4 h-4" /> Devotees
            </dt>
            <dd className="font-medium text-temple-900">{booking.number_of_devotees}</dd>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-temple-100">
            <dt className="text-temple-700 font-medium">Amount</dt>
            <dd className="text-xl font-bold text-saffron-700">{formatPrice(booking.amount)}</dd>
          </div>
        </dl>

        <div className="mt-6 p-4 rounded-lg bg-amber-50 border border-amber-200">
          <p className="text-sm text-amber-700">
            Your booking is currently pending. Our team will contact you shortly to confirm.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link to={`/my-bookings/${booking.id}`} className="btn-primary flex-1">
            View My Booking <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/explore-poojas" className="btn-secondary flex-1">
            Browse More Poojas
          </Link>
        </div>
      </div>
    </div>
  );
}
