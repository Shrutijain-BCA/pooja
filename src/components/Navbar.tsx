import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, CalendarCheck, UserCircle, Bell, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Notification } from '@/types/database';

export default function Navbar() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setNotifOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (user) {
      supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(5)
        .then(({ data }) => setNotifications(data ?? []));
    }
  }, [user, location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore-poojas?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Explore Poojas', path: '/explore-poojas' },
    { label: 'Locations', path: '/locations' },
    { label: 'Find a Pooja', path: '/find-a-pooja' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Track Booking', path: '/track-booking' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-temple-100 shadow-sm">
      <nav className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-saffron-500 to-maroon-600 flex items-center justify-center">
              <span className="text-white font-serif text-lg font-bold">PP</span>
            </div>
            <span className="font-serif text-xl font-bold text-temple-900 hidden sm:block">
              Pooja Palace
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'text-saffron-700 bg-saffron-50'
                    : 'text-temple-600 hover:text-temple-900 hover:bg-temple-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg text-temple-600 hover:bg-temple-50 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            {user && (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="p-2 rounded-lg text-temple-600 hover:bg-temple-50 transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-maroon-500 rounded-full" />
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-temple-100 overflow-hidden z-50">
                    <div className="p-3 border-b border-temple-100 font-medium text-temple-900">
                      Notifications
                    </div>
                    {notifications.length === 0 ? (
                      <div className="p-4 text-sm text-temple-400 text-center">
                        No new notifications
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="p-3 border-b border-temple-50 hover:bg-temple-50">
                          <div className="text-sm font-medium text-temple-900">{n.title}</div>
                          <div className="text-xs text-temple-500 mt-0.5">{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* User Menu */}
            {user ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-temple-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron-400 to-maroon-500 flex items-center justify-center text-white text-sm font-medium">
                    {profile?.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium text-temple-700 max-w-24 truncate">
                    {profile?.name || 'Account'}
                  </span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-temple-100 overflow-hidden z-50">
                    <div className="p-3 border-b border-temple-100">
                      <div className="text-sm font-medium text-temple-900 truncate">
                        {profile?.name || 'User'}
                      </div>
                      <div className="text-xs text-temple-400 truncate">{user.email}</div>
                    </div>
                    <Link to="/my-bookings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-temple-700 hover:bg-temple-50">
                      <CalendarCheck className="w-4 h-4" /> My Bookings
                    </Link>
                    <Link to="/my-profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-temple-700 hover:bg-temple-50">
                      <UserCircle className="w-4 h-4" /> My Profile
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-saffron-700 hover:bg-saffron-50 font-medium">
                        <User className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-maroon-600 hover:bg-maroon-50 border-t border-temple-100"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden sm:block btn-ghost text-sm">
                Login
              </Link>
            )}

            {/* Book a Pooja CTA */}
            <Link to="/explore-poojas" className="hidden md:block btn-primary text-sm py-2 px-4">
              Book a Pooja
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-temple-600 hover:bg-temple-50"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="pb-3 animate-fade-in">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-temple-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search poojas, locations, categories..."
                  className="input pl-10"
                  autoFocus
                />
              </div>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-temple-100 bg-white animate-slide-down">
          <div className="section-container py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${
                  location.pathname === link.path
                    ? 'text-saffron-700 bg-saffron-50'
                    : 'text-temple-600 hover:bg-temple-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/my-bookings" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-temple-600 hover:bg-temple-50">
                  My Bookings
                </Link>
                <Link to="/my-profile" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-temple-600 hover:bg-temple-50">
                  My Profile
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-saffron-700 hover:bg-saffron-50">
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-maroon-600 hover:bg-maroon-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-temple-600 hover:bg-temple-50">
                Login / Sign Up
              </Link>
            )}
            <Link to="/explore-poojas" className="btn-primary w-full mt-3">
              Book a Pooja
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
