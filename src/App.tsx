import { BrowserRouter, Routes, Outlet, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ExplorePoojas from './pages/ExplorePoojas';
import PoojaDetail from './pages/PoojaDetail';
import Locations from './pages/Locations';
import StateDetail from './pages/StateDetail';
import LocationDetail from './pages/LocationDetail';
import FindAPooja from './pages/FindAPooja';
import Book from './pages/Book';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import BookingDetail from './pages/BookingDetail';
import TrackBooking from './pages/TrackBooking';
import MyProfile from './pages/MyProfile';
import About from './pages/About';
import Contact from './pages/Contact';
import WhatsAppFloat from './components/WhatsAppFloat';
import Admin from './pages/Admin';
import AdminBookings from './pages/AdminBookings';
import AdminPoojas from './pages/AdminPoojas';
import AdminLocations from './pages/AdminLocations';
import AdminOfferings from './pages/AdminOfferings';
import AdminSimpleCrud from './pages/AdminSimpleCrud';
import AdminUsers from './pages/AdminUsers';
import AdminLayout from './components/AdminLayout';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* The public website: header, footer and WhatsApp button */}
          <Route element={<PublicLayout />}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/explore-poojas" element={<ExplorePoojas />} />
            <Route path="/poojas/:slug" element={<PoojaDetail />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/locations/:stateSlug" element={<StateDetail />} />
            <Route path="/locations/:stateSlug/:locationSlug" element={<LocationDetail />} />
            <Route path="/find-a-pooja" element={<FindAPooja />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/track-booking" element={<TrackBooking />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes */}
            <Route path="/book/:poojaSlug" element={<ProtectedRoute><Book /></ProtectedRoute>} />
            <Route path="/booking-confirmation/:bookingId" element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />
            <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
            <Route path="/my-bookings/:bookingId" element={<ProtectedRoute><BookingDetail /></ProtectedRoute>} />
            <Route path="/my-profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={
              <div className="section-container py-20 text-center">
                <h1 className="text-4xl font-serif font-bold text-temple-900">404</h1>
                <p className="text-temple-500 mt-2">Page not found</p>
              </div>
            } />
          </Route>

          {/* The admin portal: its own layout, only for admins */}
          <Route element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/bookings/:bookingId" element={<AdminBookings />} />
            <Route path="/admin/poojas" element={<AdminPoojas />} />
            <Route path="/admin/locations" element={<AdminLocations />} />
            <Route path="/admin/offerings" element={<AdminOfferings />} />
            <Route path="/admin/categories" element={<AdminSimpleCrud config={{ title: 'Categories', table: 'categories', fields: [{ name: 'name', label: 'Name' }, { name: 'description', label: 'Description', type: 'textarea' }] }} />} />
            <Route path="/admin/states" element={<AdminSimpleCrud config={{ title: 'States', table: 'states', fields: [{ name: 'name', label: 'Name' }, { name: 'description', label: 'Description', type: 'textarea' }, { name: 'image', label: 'Image URL' }] }} />} />
            <Route path="/admin/purposes" element={<AdminSimpleCrud config={{ title: 'Purposes', table: 'purposes', fields: [{ name: 'name', label: 'Name' }, { name: 'description', label: 'Description', type: 'textarea' }, { name: 'icon', label: 'Icon name (lucide)' }] }} />} />
            <Route path="/admin/deities" element={<AdminSimpleCrud config={{ title: 'Deities', table: 'deities', fields: [{ name: 'name', label: 'Name' }, { name: 'description', label: 'Description', type: 'textarea' }] }} />} />
            <Route path="/admin/occasions" element={<AdminSimpleCrud config={{ title: 'Occasions', table: 'occasions', fields: [{ name: 'name', label: 'Name' }, { name: 'description', label: 'Description', type: 'textarea' }] }} />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
