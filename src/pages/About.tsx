import { Link } from 'react-router-dom';
import { Heart, Shield, Users, MapPin, ArrowRight, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/16373496/pexels-photo-16373496.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Temple"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-temple-950/70 to-temple-950/80" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center section-container">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white">About Pooja Palace</h1>
            <p className="text-white/70 mt-4 max-w-2xl mx-auto">
              Connecting devotees with authentic Vedic rituals at India's most sacred destinations.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-container py-16">
        <div className="max-w-3xl mx-auto text-center">
          <Sparkles className="w-10 h-10 text-saffron-500 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-temple-900 mb-4">Our Mission</h2>
          <p className="text-temple-600 leading-relaxed text-lg">
            Pooja Palace was born from a simple vision: to make authentic Vedic rituals accessible to devotees
            across India and the world. We partner with trusted and experienced Pandit Ji at sacred destinations
            to ensure every pooja is performed with the utmost devotion and according to authentic Vedic traditions.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-temple-50 py-16">
        <div className="section-container">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-temple-900 text-center mb-10">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-8 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-saffron-50 flex items-center justify-center mb-4">
                <Heart className="w-7 h-7 text-saffron-600" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-temple-900 mb-2">Authenticity</h3>
              <p className="text-sm text-temple-500">
                Every pooja is performed according to authentic Vedic traditions by experienced Pandit Ji.
              </p>
            </div>
            <div className="card p-8 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-temple-50 flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-temple-600" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-temple-900 mb-2">Trust</h3>
              <p className="text-sm text-temple-500">
                We work only with verified and trusted Pandits at established sacred destinations.
              </p>
            </div>
            <div className="card p-8 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-maroon-50 flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-maroon-600" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-temple-900 mb-2">Devotion</h3>
              <p className="text-sm text-temple-500">
                We are devoted to making spiritual practices accessible and meaningful for every devotee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="section-container py-16">
        <div className="text-center mb-10">
          <MapPin className="w-10 h-10 text-saffron-500 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-temple-900">Our Coverage</h2>
          <p className="text-temple-500 mt-2">Sacred destinations across India</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="card p-6">
            <h3 className="text-lg font-serif font-semibold text-temple-900 mb-3">Uttarakhand</h3>
            <p className="text-sm text-temple-500">
              Haridwar, Rishikesh, Badrinath Dham, Kedarnath Dham, Gangotri Dham, Yamunotri Dham, Neelkanth,
              Dehradun, Narayan Shila, Kali Mandir, Daksh Prajapati, Triveni, Parmarth Niketan Ghat, Garud Shila
            </p>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-serif font-semibold text-temple-900 mb-3">Uttar Pradesh</h3>
            <p className="text-sm text-temple-500">
              Ayodhya, Vrindavan, Varanasi, Moradabad, Muzaffar Nagar
            </p>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link to="/locations" className="btn-primary">
            Explore All Locations <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="section-container pb-16">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-temple-800 to-temple-950 p-12 text-center">
          <h2 className="text-2xl font-serif font-bold text-white mb-4">Ready to Begin Your Spiritual Journey?</h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            Browse our catalogue and book your pooja at a sacred destination of your choice.
          </p>
          <Link to="/explore-poojas" className="btn-primary">
            Explore Poojas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
