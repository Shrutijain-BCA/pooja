import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CalendarCheck, Sparkles, MapPin, Tag, Star, Gift, Layers, Users, Settings, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAllBookings, getAllPoojasAdmin, getAllLocationsAdmin, getAllStatesAdmin } from '../lib/api';
import type { Booking } from '../types/database';
import { formatPrice, formatDate, getStatusBgClass } from '../lib/helpers';
import { LoadingSpinner } from '../components/Loading';

const NAV = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Bookings', path: '/admin/bookings', icon: CalendarCheck },
  { label: 'Poojas', path: '/admin/poojas', icon: Sparkles },
  { label: 'Categories', path: '/admin/categories', icon: Tag },
  { label: 'States', path: '/admin/states', icon: MapPin },
  { label: 'Locations', path: '/admin/locations', icon: MapPin },
  { label: 'Purposes', path: '/admin/purposes', icon: Star },
  { label: 'Deities', path: '/admin/deities', icon: Star },
  { label: 'Occasions', path: '/admin/occasions', icon: Gift },
  { label: 'Offerings', path: '/admin/offerings', icon: Layers },
  { label: 'Users', path: '/admin/users', icon: Users },
];

export default function Admin() {
  const location = useLocation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [poojas, setPoojas] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllBookings(), getAllPoojasAdmin(), getAllLocationsAdmin(), getAllStatesAdmin()])
      .then(([b, p, l, s]) => {
        setBookings(b);
        setPoojas(p);
        setLocations(l);
        setStates(s);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'PENDING').length,
    confirmed: bookings.filter((b) => b.status === 'CONFIRMED').length,
    completed: bookings.filter((b) => b.status === 'COMPLETED').length,
    cancelled: bookings.filter((b) => b.status === 'CANCELLED').length,
    activePoojas: poojas.filter((p: any) => p.is_active).length,
    activeLocations: locations.filter((l: any) => l.is_active).length,
    activeStates: states.filter((s: any) => s.is_active).length,
  };

  const recentBookings = bookings.slice(0, 5);
  const upcomingConfirmed = bookings
    .filter((b) => b.status === 'CONFIRMED')
    .sort((a, b) => new Date(a.preferred_date).getTime() - new Date(b.preferred_date).getTime())
    .slice(0, 5);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="section-container py-8">
      <h1 className="text-3xl font-serif font-bold text-temple-900 mb-6">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-4">
          <p className="text-xs text-temple-400 uppercase tracking-wider">Total Bookings</p>
          <p className="text-2xl font-serif font-bold text-temple-900 mt-1">{stats.total}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-temple-400 uppercase tracking-wider">Pending</p>
          <p className="text-2xl font-serif font-bold text-amber-600 mt-1">{stats.pending}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-temple-400 uppercase tracking-wider">Confirmed</p>
          <p className="text-2xl font-serif font-bold text-green-600 mt-1">{stats.confirmed}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-temple-400 uppercase tracking-wider">Completed</p>
          <p className="text-2xl font-serif font-bold text-blue-600 mt-1">{stats.completed}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-temple-400 uppercase tracking-wider">Cancelled</p>
          <p className="text-2xl font-serif font-bold text-maroon-600 mt-1">{stats.cancelled}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-temple-400 uppercase tracking-wider">Active Poojas</p>
          <p className="text-2xl font-serif font-bold text-temple-900 mt-1">{stats.activePoojas}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-temple-400 uppercase tracking-wider">Active Locations</p>
          <p className="text-2xl font-serif font-bold text-temple-900 mt-1">{stats.activeLocations}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-temple-400 uppercase tracking-wider">Active States</p>
          <p className="text-2xl font-serif font-bold text-temple-900 mt-1">{stats.activeStates}</p>
        </div>
      </div>

      {/* Quick Nav */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-8">
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`card p-4 text-center transition-all ${
                isActive ? 'border-saffron-400 bg-saffron-50' : 'hover:border-temple-200'
              }`}
            >
              <Icon className={`w-6 h-6 mx-auto mb-2 ${isActive ? 'text-saffron-600' : 'text-temple-500'}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-saffron-700' : 'text-temple-600'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Recent & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-serif font-semibold text-temple-900 mb-4">Recent Bookings</h2>
          {recentBookings.length === 0 ? (
            <p className="text-sm text-temple-400 text-center py-4">No bookings yet</p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((b) => (
                <Link key={b.id} to={`/admin/bookings/${b.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-temple-50 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-temple-900 truncate">{b.pooja?.name}</p>
                    <p className="text-xs text-temple-400">{b.booking_number} · {b.customer_name}</p>
                  </div>
                  <span className={`badge ${getStatusBgClass(b.status)} text-xs`}>{b.status}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-serif font-semibold text-temple-900 mb-4">Upcoming Confirmed</h2>
          {upcomingConfirmed.length === 0 ? (
            <p className="text-sm text-temple-400 text-center py-4">No upcoming confirmed bookings</p>
          ) : (
            <div className="space-y-3">
              {upcomingConfirmed.map((b) => (
                <Link key={b.id} to={`/admin/bookings/${b.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-temple-50 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-temple-900 truncate">{b.pooja?.name}</p>
                    <p className="text-xs text-temple-400">{b.location?.name} · {formatDate(b.preferred_date)}</p>
                  </div>
                  <p className="text-sm font-semibold text-saffron-700">{formatPrice(b.amount)}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
