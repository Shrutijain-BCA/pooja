import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, Compass, Sparkles, ArrowRight, Calendar, Star } from 'lucide-react';
import { getStates, getLocations, getPoojas, getPurposes } from '../lib/api';
import type { State, Location, Pooja, Purpose } from '../types/database';
import { LoadingSpinner } from '../components/Loading';
import PoojaCard from '../components/PoojaCard';

export default function Home() {
  const [states, setStates] = useState<State[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [poojas, setPoojas] = useState<Pooja[]>([]);
  const [purposes, setPurposes] = useState<Purpose[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStates(), getLocations(), getPoojas(), getPurposes()])
      .then(([s, l, p, pu]) => {
        setStates(s);
        setLocations(l);
        setPoojas(p.slice(0, 8));
        setPurposes(pu);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/32111239/pexels-photo-32111239.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Ganga Aarti ceremony"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-temple-950/80 via-temple-900/60 to-temple-950/80" />
        </div>
        <div className="relative section-container text-center py-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-saffron-300" />
            <span className="text-sm text-white/90 font-medium">Authentic Vedic Rituals</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white max-w-3xl mx-auto leading-tight text-balance animate-slide-up">
            Book Sacred Poojas at India's Most Revered Destinations
          </h1>
          <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Experience authentic Vedic rituals arranged with trusted Pandit Ji at sacred destinations across India.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/explore-poojas" className="btn-primary text-base px-8 py-3.5">
              Explore Poojas <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/find-a-pooja" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-white/10 backdrop-blur-sm text-white font-medium border border-white/20 hover:bg-white/20 transition-all duration-200">
              <Search className="w-5 h-5" /> Find a Pooja
            </Link>
          </div>
        </div>
      </section>

      {/* Discovery Methods */}
      <section className="section-container py-16">
        <div className="text-center mb-12">
          <h2 className="section-title">Three Ways to Find Your Pooja</h2>
          <p className="section-subtitle">Choose the path that suits you best</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Explore by Location */}
          <Link to="/locations" className="card group p-8 text-center hover:border-saffron-200">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-saffron-50 flex items-center justify-center mb-4 group-hover:bg-saffron-100 transition-colors">
              <MapPin className="w-7 h-7 text-saffron-600" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-temple-900 mb-2">Explore by Location</h3>
            <p className="text-temple-500 text-sm mb-4">I know where I want my pooja</p>
            <div className="text-xs text-temple-400 space-y-1">
              <p>State → Destination → Religious Place → Available Poojas</p>
            </div>
            <span className="inline-flex items-center gap-1 text-saffron-600 font-medium text-sm mt-4 group-hover:gap-2 transition-all">
              Browse Locations <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          {/* Explore Poojas */}
          <Link to="/explore-poojas" className="card group p-8 text-center hover:border-saffron-200">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-temple-50 flex items-center justify-center mb-4 group-hover:bg-temple-100 transition-colors">
              <Compass className="w-7 h-7 text-temple-600" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-temple-900 mb-2">Explore Poojas</h3>
            <p className="text-temple-500 text-sm mb-4">I know which pooja I want</p>
            <div className="text-xs text-temple-400 space-y-1">
              <p>Rudrabhishek → Available Locations → Location-specific pricing</p>
            </div>
            <span className="inline-flex items-center gap-1 text-saffron-600 font-medium text-sm mt-4 group-hover:gap-2 transition-all">
              Browse Poojas <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          {/* Find a Pooja */}
          <Link to="/find-a-pooja" className="card group p-8 text-center hover:border-saffron-200">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-maroon-50 flex items-center justify-center mb-4 group-hover:bg-maroon-100 transition-colors">
              <Sparkles className="w-7 h-7 text-maroon-600" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-temple-900 mb-2">Find a Pooja</h3>
            <p className="text-temple-500 text-sm mb-4">I'm not sure which pooja I need</p>
            <div className="text-xs text-temple-400 space-y-1">
              <p>Select a purpose → Get relevant pooja suggestions</p>
            </div>
            <span className="inline-flex items-center gap-1 text-saffron-600 font-medium text-sm mt-4 group-hover:gap-2 transition-all">
              Get Suggestions <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </section>

      {/* Popular States */}
      <section className="bg-temple-50 py-16">
        <div className="section-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Sacred States</h2>
              <p className="section-subtitle">Discover poojas across India's holy regions</p>
            </div>
            <Link to="/locations" className="hidden sm:flex items-center gap-1 text-saffron-600 font-medium text-sm hover:gap-2 transition-all">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {states.map((state) => {
              const stateLocations = locations.filter((l) => l.state_id === state.id);
              return (
                <Link
                  key={state.id}
                  to={`/locations/${state.slug}`}
                  className="card group relative h-56 overflow-hidden"
                >
                  {state.image && (
                    <img
                      src={state.image}
                      alt={state.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-temple-950/90 via-temple-900/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-serif font-bold text-white">{state.name}</h3>
                    <p className="text-white/70 text-sm mt-1">{stateLocations.length} sacred locations</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Poojas */}
      <section className="section-container py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Popular Poojas</h2>
            <p className="section-subtitle">Most sought-after Vedic rituals</p>
          </div>
          <Link to="/explore-poojas" className="hidden sm:flex items-center gap-1 text-saffron-600 font-medium text-sm hover:gap-2 transition-all">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {poojas.map((pooja) => (
            <PoojaCard key={pooja.id} pooja={pooja} />
          ))}
        </div>
      </section>

      {/* Find by Purpose */}
      <section className="bg-gradient-to-b from-saffron-50 to-sand-50 py-16">
        <div className="section-container">
          <div className="text-center mb-10">
            <h2 className="section-title">What Would You Like Help With?</h2>
            <p className="section-subtitle">Select your purpose and we'll suggest the right pooja</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {purposes.map((purpose) => (
              <Link
                key={purpose.id}
                to={`/find-a-pooja?purpose=${purpose.slug}`}
                className="card group p-6 text-center hover:border-saffron-200 hover:shadow-md"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-white shadow-sm flex items-center justify-center mb-3 group-hover:bg-saffron-50 transition-colors">
                  <Star className="w-6 h-6 text-saffron-500" />
                </div>
                <h3 className="text-sm font-medium text-temple-800 group-hover:text-saffron-700 transition-colors">
                  {purpose.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-container py-16">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-temple-800 to-temple-950 p-12 text-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 border-2 border-saffron-400 rounded-full -translate-x-20 -translate-y-20" />
            <div className="absolute bottom-0 right-0 w-60 h-60 border-2 border-saffron-400 rounded-full translate-x-30 translate-y-30" />
          </div>
          <div className="relative">
            <Calendar className="w-12 h-12 text-saffron-400 mx-auto mb-4" />
            <h2 className="text-3xl font-serif font-bold text-white mb-4">Ready to Book Your Pooja?</h2>
            <p className="text-white/70 max-w-xl mx-auto mb-8">
              Browse our catalogue of authentic Vedic rituals and book at your preferred sacred destination.
            </p>
            <Link to="/explore-poojas" className="btn-primary text-base px-8 py-3.5">
              Book a Pooja <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
