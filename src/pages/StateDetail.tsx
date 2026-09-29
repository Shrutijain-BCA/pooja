import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { getStateBySlug, getLocationsByState } from '../lib/api';
import type { State, Location } from '../types/database';
import { LoadingSpinner } from '../components/Loading';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

export default function StateDetail() {
  const { stateSlug } = useParams<{ stateSlug: string }>();
  const [state, setState] = useState<State | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!stateSlug) return;
    setLoading(true);
    (async () => {
      try {
        const s = await getStateBySlug(stateSlug);
        setState(s);
        if (s) {
          const locs = await getLocationsByState(s.id);
          setLocations(locs);
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [stateSlug]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;
  if (!state) return (
    <EmptyState
      icon={MapPin}
      title="State Not Found"
      description="The state you're looking for doesn't exist."
      action={<Link to="/locations" className="btn-primary">Browse Locations</Link>}
    />
  );

  return (
    <div>
      <div className="relative h-72 md:h-96 overflow-hidden">
        {state.image ? (
          <img src={state.image} alt={state.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-temple-800 to-temple-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-temple-950/90 via-temple-900/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 section-container pb-8">
          <nav className="text-sm text-white/60 mb-2">
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/locations" className="hover:text-white">Locations</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{state.name}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">{state.name}</h1>
          {state.description && <p className="text-white/70 mt-2 max-w-2xl">{state.description}</p>}
        </div>
      </div>

      <div className="section-container py-8">
        <h2 className="text-2xl font-serif font-bold text-temple-900 mb-4">
          Sacred Destinations in {state.name}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((loc) => (
            <Link
              key={loc.id}
              to={`/locations/${state.slug}/${loc.slug}`}
              className="card group h-40 overflow-hidden relative"
            >
              {loc.image ? (
                <img src={loc.image} alt={loc.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
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
    </div>
  );
}
