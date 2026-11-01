import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Sparkles,
  MapPin,
  Tag,
  Star,
  Gift,
  Layers,
  Users,
  Menu,
  X,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MENU = [
  {
    heading: 'Overview',
    items: [{ label: 'Dashboard', path: '/admin', icon: LayoutDashboard }],
  },
  {
    heading: 'Orders',
    items: [{ label: 'Bookings', path: '/admin/bookings', icon: CalendarCheck }],
  },
  {
    heading: 'Catalogue',
    items: [
      { label: 'Poojas', path: '/admin/poojas', icon: Sparkles },
      { label: 'Offerings & prices', path: '/admin/offerings', icon: Layers },
      { label: 'Locations', path: '/admin/locations', icon: MapPin },
      { label: 'States', path: '/admin/states', icon: MapPin },
    ],
  },
  {
    heading: 'Tags',
    items: [
      { label: 'Categories', path: '/admin/categories', icon: Tag },
      { label: 'Purposes', path: '/admin/purposes', icon: Star },
      { label: 'Deities', path: '/admin/deities', icon: Star },
      { label: 'Occasions', path: '/admin/occasions', icon: Gift },
    ],
  },
  {
    heading: 'People',
    items: [{ label: 'Users', path: '/admin/users', icon: Users }],
  },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation();
  const { user, profile, signOut } = useAuth();

  const isActive = (path: string) =>
    path === '/admin' ? pathname === '/admin' : pathname.startsWith(path);

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-saffron-500 to-maroon-600 font-serif text-lg font-bold">
          PP
        </div>
        <div>
          <p className="font-serif text-base font-bold leading-tight">Pandit Pooja Seva</p>
          <p className="text-xs text-saffron-300">Admin Portal</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {MENU.map((group) => (
          <div key={group.heading}>
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
              {group.heading}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-white/10 text-white'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? 'text-saffron-400' : ''}`} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Signed-in user */}
      <div className="space-y-3 border-t border-white/10 p-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{profile?.name || 'Admin'}</p>
          <p className="truncate text-xs text-white/50">{user?.email}</p>
        </div>
        <div className="flex gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium transition-colors hover:bg-white/15"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View site
          </a>
          <button
            type="button"
            onClick={() => signOut()}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium transition-colors hover:bg-white/15"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  // Close the phone menu whenever you go to another page
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-temple-50">
      {/* Desktop side menu */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-temple-950 text-white lg:block">
        <SidebarContent />
      </aside>

      {/* Phone top bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between bg-temple-950 px-4 text-white lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-2 transition-colors hover:bg-white/10"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-serif text-base font-bold">Admin Portal</span>
        <span className="w-9" />
      </header>

      {/* Phone menu drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-temple-950 text-white shadow-xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-4 rounded-lg p-2 transition-colors hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      {/* The admin page itself */}
      <div className="lg:pl-64">
        <Outlet />
      </div>
    </div>
  );
}