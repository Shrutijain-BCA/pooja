import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { getStates, getLocations } from '@/lib/api';
import type { State, Location } from '@/types/database';
import { LoadingSpinner } from '@/components/Loading';
import ErrorState from '@/components/ErrorState';

export default function Locations() {
  const [states, setStates] = useState<State[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getStates(), getLocations()])
      .then(([s, l]) => {
        setStates(s);
        setLocations(l);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="section-container py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-temple-900">Sacred Locations</h1>
        <p className="text-temple-500 mt-2">Explore poojas available at holy destinations across India</p>
      </div>

      <div className="space-y-12">
        {states.map((state) => {
          const stateLocations = locations.filter((l) => l.state_id === state.id);
          return (
            <div key={state.id}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-temple-900">{state.name}</h2>
                  {state.description && <p className="text-temple-500 text-sm mt-1">{state.description}</p>}
                </div>
                <span className="text-sm text-temple-400">{stateLocations.length} locations</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stateLocations.map((loc) => (
                  <Link
                    key={loc.id}
                    to={`/locations/${state.slug}/${loc.slug}`}
                    className="card group h-40 overflow-hidden relative"
                  >
                    {loc.image ? (
                      <img
                        src={loc.image}
                        alt={loc.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-temple-700 to-temple-900" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-temple-950/90 via-temple-900/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-1.5 text-white/60 text-xs mb-1">
                        <MapPin className="w-3 h-3" />
                        <span className="capitalize">{loc.type}</span>
                      </div>
                      <h3 className="text-lg font-serif font-semibold text-white group-hover:text-saffron-300 transition-colors">
                        {loc.name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
