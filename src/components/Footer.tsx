import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-temple-950 text-temple-200 mt-20">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-saffron-500 to-maroon-600 flex items-center justify-center">
                <span className="text-white font-serif text-lg font-bold">PP</span>
              </div>
              <span className="font-serif text-xl font-bold text-white">Pooja Palace</span>
            </div>
            <p className="text-sm text-temple-400 leading-relaxed">
              Book authentic Vedic poojas at India's most revered sacred destinations. Arranged with trusted Pandit Ji.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">Discover</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/explore-poojas" className="hover:text-saffron-400 transition-colors">Explore Poojas</Link></li>
              <li><Link to="/locations" className="hover:text-saffron-400 transition-colors">Locations</Link></li>
              <li><Link to="/find-a-pooja" className="hover:text-saffron-400 transition-colors">Find a Pooja</Link></li>
              <li><Link to="/track-booking" className="hover:text-saffron-400 transition-colors">Track Booking</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/my-bookings" className="hover:text-saffron-400 transition-colors">My Bookings</Link></li>
              <li><Link to="/my-profile" className="hover:text-saffron-400 transition-colors">My Profile</Link></li>
              <li><Link to="/login" className="hover:text-saffron-400 transition-colors">Login</Link></li>
              <li><Link to="/signup" className="hover:text-saffron-400 transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-saffron-400 shrink-0" />
                <span>Haridwar, Uttarakhand, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-saffron-400 shrink-0" />
                <span>contact@poojapalace.in</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-saffron-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-temple-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-temple-400">
            &copy; {new Date().getFullYear()} Pooja Palace. All rights reserved.
          </p>
          <p className="text-sm text-temple-400 flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-maroon-400 fill-maroon-400" /> for devotees
          </p>
        </div>
      </div>
    </footer>
  );
}
