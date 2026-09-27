import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
import Admin from './pages/Admin';
import AdminBookings from './pages/AdminBookings';
import AdminPoojas from './pages/AdminPoojas';
import AdminLocations from './pages/AdminLocations';
import AdminOfferings from './pages/AdminOfferings';
import AdminSimpleCrud from './pages/AdminSimpleCrud';
import AdminUsers from './pages/AdminUsers';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
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

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
              <Route path="/admin/bookings" element={<ProtectedRoute requireAdmin><AdminBookings /></ProtectedRoute>} />
              <Route path="/admin/bookings/:bookingId" element={<ProtectedRoute requireAdmin><AdminBookings /></ProtectedRoute>} />
              <Route path="/admin/poojas" element={<ProtectedRoute requireAdmin><AdminPoojas /></ProtectedRoute>} />
              <Route path="/admin/locations" element={<ProtectedRoute requireAdmin><AdminLocations /></ProtectedRoute>} />
              <Route path="/admin/offerings" element={<ProtectedRoute requireAdmin><AdminOfferings /></ProtectedRoute>} />
              <Route path="/admin/categories" element={<ProtectedRoute requireAdmin><AdminSimpleCrud config={{ title: 'Categories', table: 'categories', fields: [{ name: 'name', label: 'Name' }, { name: 'description', label: 'Description', type: 'textarea' }] }} /></ProtectedRoute>} />
              <Route path="/admin/states" element={<ProtectedRoute requireAdmin><AdminSimpleCrud config={{ title: 'States', table: 'states', fields: [{ name: 'name', label: 'Name' }, { name: 'description', label: 'Description', type: 'textarea' }, { name: 'image', label: 'Image URL' }] }} /></ProtectedRoute>} />
              <Route path="/admin/purposes" element={<ProtectedRoute requireAdmin><AdminSimpleCrud config={{ title: 'Purposes', table: 'purposes', fields: [{ name: 'name', label: 'Name' }, { name: 'description', label: 'Description', type: 'textarea' }, { name: 'icon', label: 'Icon name (lucide)' }] }} /></ProtectedRoute>} />
              <Route path="/admin/deities" element={<ProtectedRoute requireAdmin><AdminSimpleCrud config={{ title: 'Deities', table: 'deities', fields: [{ name: 'name', label: 'Name' }, { name: 'description', label: 'Description', type: 'textarea' }] }} /></ProtectedRoute>} />
              <Route path="/admin/occasions" element={<ProtectedRoute requireAdmin><AdminSimpleCrud config={{ title: 'Occasions', table: 'occasions', fields: [{ name: 'name', label: 'Name' }, { name: 'description', label: 'Description', type: 'textarea' }] }} /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminUsers /></ProtectedRoute>} />

              {/* 404 */}
              <Route path="*" element={
                <div className="section-container py-20 text-center">
                  <h1 className="text-4xl font-serif font-bold text-temple-900">404</h1>
                  <p className="text-temple-500 mt-2">Page not found</p>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
