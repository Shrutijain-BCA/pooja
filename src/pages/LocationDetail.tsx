import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ArrowRight, Search as SearchIcon, Info } from 'lucide-react';
import { getLocationBySlug, getOfferingsByLocation } from '@/lib/api';
import type { Location, LocationPooja } from '@/types/database';
import { formatPrice } from '@/lib/helpers';
import { LoadingSpinner } from '@/components/Loading';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';

export default function LocationDetail() {
  const { stateSlug, locationSlug } = useParams<{ stateSlug: string; locationSlug: string }>();
  const [location, setLocation] = useState<Location | null>(null);
  const [offerings, setOfferings] = useState<LocationPooja[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!stateSlug || !locationSlug) return;
    setLoading(true);
    (async () => {
      try {
        const loc = await getLocationBySlug(stateSlug, locationSlug);
        setLocation(loc);
        if (loc) {
          const offs = await getOfferingsByLocation(loc.id);
          setOfferings(offs);
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [stateSlug, locationSlug]);

  const filteredOfferings = offerings.filter((o) =>
    o.pooja?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;
  if (!location) return (
    <EmptyState
      icon={MapPin}
      title="Location Not Found"
      description="The location you're looking for doesn't exist or has been deactivated."
      action={<Link to="/locations" className="btn-primary">Browse Locations</Link>}
    />
  );

  return (
    <div>
      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        {location.image ? (
          <img src={location.image} alt={location.name} className="w-full h-full object-cover" />
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
            <Link to={`/locations/${location.state?.slug}`} className="hover:text-white">{location.state?.name}</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{location.name}</span>
          </nav>
          <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
            <MapPin className="w-4 h-4" />
            <span className="capitalize">{location.type}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">{location.name}</h1>
        </div>
      </div>

      <div className="section-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {location.description && (
              <div className="card p-6">
                <h2 className="text-xl font-serif font-semibold text-temple-900 mb-3">About {location.name}</h2>
                <p className="text-temple-600 leading-relaxed">{location.description}</p>
              </div>
            )}

            {/* Significance */}
            {location.significance && (
              <div className="card p-6 bg-gradient-to-br from-saffron-50 to-sand-50 border-saffron-100">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-saffron-600 shrink-0 mt-0.5" />
                  <div>
                    <h2 className="text-lg font-serif font-semibold text-temple-900 mb-2">Religious Significance</h2>
                    <p className="text-temple-600 leading-relaxed">{location.significance}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Available Poojas */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-serif font-semibold text-temple-900">Available Poojas</h2>
                <span className="text-sm text-temple-400">{offerings.length} poojas</span>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-temple-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search poojas at this location..."
                  className="input pl-10"
                />
              </div>

              {filteredOfferings.length === 0 ? (
                <p className="text-temple-500 text-sm text-center py-8">
                  {search ? 'No poojas match your search.' : 'No poojas currently available at this location.'}
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredOfferings.map((offering) => (
                    <Link
                      key={offering.id}
                      to={`/poojas/${offering.pooja?.slug}`}
                      className="flex items-center justify-between p-4 rounded-lg border border-temple-100 hover:border-temple-200 hover:bg-temple-50 transition-all group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-temple-900 group-hover:text-saffron-700 transition-colors">
                          {offering.pooja?.name}
                        </p>
                        {offering.pooja?.description && (
                          <p className="text-sm text-temple-500 truncate mt-0.5">{offering.pooja.description}</p>
                        )}
                        {offering.duration && (
                          <p className="text-xs text-temple-400 mt-1">Duration: {offering.duration}</p>
                        )}
                      </div>
                      <div className="text-right ml-4 shrink-0">
                        <p className="font-semibold text-saffron-700">{formatPrice(offering.price)}</p>
                        <span className="inline-flex items-center gap-1 text-xs text-saffron-600 mt-1">
                          View <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <h3 className="text-lg font-serif font-semibold text-temple-900 mb-4">Quick Info</h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-temple-400">State</dt>
                  <dd className="text-temple-700 font-medium">{location.state?.name}</dd>
                </div>
                <div>
                  <dt className="text-temple-400">Type</dt>
                  <dd className="text-temple-700 font-medium capitalize">{location.type}</dd>
                </div>
                <div>
                  <dt className="text-temple-400">Available Poojas</dt>
                  <dd className="text-temple-700 font-medium">{offerings.length}</dd>
                </div>
              </dl>
              <Link to="/explore-poojas" className="btn-primary w-full mt-6">
                Book a Pooja <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
