import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, Inbox } from 'lucide-react';
import { getMyBookings } from '../lib/api';
import type { Booking, BookingStatus } from '../types/database';
import { formatPrice, formatDate, getStatusBgClass } from '../lib/helpers';
import { LoadingSpinner } from '../components/Loading';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

const TABS: { label: string; value: string }[] = [
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    getMyBookings()
      .then(setBookings)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'upcoming') {
      return b.status === 'PENDING' || b.status === 'CONFIRMED';
    }
    return b.status === activeTab;
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="section-container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-bold text-temple-900">My Bookings</h1>
        <p className="text-temple-500 mt-1">View and track all your pooja bookings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto scrollbar-hide border-b border-temple-100">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.value
                ? 'border-saffron-600 text-saffron-700'
                : 'border-transparent text-temple-500 hover:text-temple-700'
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs text-temple-400">
              {tab.value === 'upcoming'
                ? bookings.filter((b) => b.status === 'PENDING' || b.status === 'CONFIRMED').length
                : bookings.filter((b) => b.status === tab.value).length}
            </span>
          </button>
        ))}
      </div>

      {/* Bookings */}
      {filteredBookings.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No Bookings Found"
          description="You don't have any bookings in this category yet."
          action={<Link to="/explore-poojas" className="btn-primary">Book a Pooja</Link>}
        />
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Link
              key={booking.id}
              to={`/my-bookings/${booking.id}`}
              className="card group p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-temple-400">{booking.booking_number}</span>
                    <span className={`badge ${getStatusBgClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-temple-900 group-hover:text-saffron-700 transition-colors">
                    {booking.pooja?.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-temple-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {booking.location?.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {formatDate(booking.preferred_date)}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-temple-400">Amount</p>
                  <p className="font-semibold text-saffron-700">{formatPrice(booking.amount)}</p>
                  <span className="inline-flex items-center gap-1 text-xs text-saffron-600 mt-2 group-hover:gap-2 transition-all">
                    View Details <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
