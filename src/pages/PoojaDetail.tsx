import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Clock, MapPin, Check, ArrowRight, Calendar, Users, Star } from 'lucide-react';
import { getPoojaBySlug, getOfferingsByPooja } from '../lib/api';
import type { Pooja, LocationPooja } from '../types/database';
import { formatPrice } from '../lib/helpers';
import { LoadingSpinner } from '../components/Loading';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { MapPin as MapPinIcon } from 'lucide-react';

export default function PoojaDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [pooja, setPooja] = useState<Pooja | null>(null);
  const [offerings, setOfferings] = useState<LocationPooja[]>([]);
  const [selectedOffering, setSelectedOffering] = useState<LocationPooja | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    (async () => {
      try {
        const p = await getPoojaBySlug(slug);
        setPooja(p);
        if (p) {
          const offs = await getOfferingsByPooja(p.id);
          setOfferings(offs);
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })()
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const categories = (pooja as any)?.categories?.map((c: any) => c.category).filter(Boolean) ?? [];
  const purposes = (pooja as any)?.purposes?.map((p: any) => p.purpose).filter(Boolean) ?? [];
  const deities = (pooja as any)?.deities?.map((d: any) => d.deity).filter(Boolean) ?? [];
  const occasions = (pooja as any)?.occasions?.map((o: any) => o.occasion).filter(Boolean) ?? [];

  const handleBook = () => {
    if (!pooja || !selectedOffering) return;
    navigate(`/book/${pooja.slug}?offering=${selectedOffering.id}`);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;
  if (!pooja) return (
    <EmptyState
      icon={MapPinIcon}
      title="Pooja Not Found"
      description="The pooja you're looking for doesn't exist or has been deactivated."
      action={<Link to="/explore-poojas" className="btn-primary">Browse Poojas</Link>}
    />
  );

  return (
    <div>
      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        {pooja.image ? (
          <img src={pooja.image} alt={pooja.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-temple-800 to-temple-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-temple-950/90 via-temple-900/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 section-container pb-8">
          <nav className="text-sm text-white/60 mb-2">
            <Link to="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/explore-poojas" className="hover:text-white">Poojas</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{pooja.name}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">{pooja.name}</h1>
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {categories.map((cat: any) => (
                <span key={cat.id} className="badge bg-white/10 text-white border-white/20 backdrop-blur-sm">
                  {cat.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="section-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="card p-6">
              <h2 className="text-xl font-serif font-semibold text-temple-900 mb-3">About This Pooja</h2>
              <p className="text-temple-600 leading-relaxed">{pooja.long_description || pooja.description}</p>
              {pooja.duration && (
                <div className="flex items-center gap-2 mt-4 text-sm text-temple-500">
                  <Clock className="w-4 h-4" />
                  <span>Approximate duration: {pooja.duration}</span>
                </div>
              )}
            </div>

            {/* Attributes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {deities.length > 0 && (
                <div className="card p-4">
                  <h3 className="text-sm font-medium text-temple-400 uppercase tracking-wider mb-2">Deity</h3>
                  <div className="flex flex-wrap gap-2">
                    {deities.map((d: any) => (
                      <span key={d.id} className="badge bg-saffron-50 text-saffron-700 border-saffron-200">
                        <Star className="w-3 h-3" /> {d.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {purposes.length > 0 && (
                <div className="card p-4">
                  <h3 className="text-sm font-medium text-temple-400 uppercase tracking-wider mb-2">Purpose</h3>
                  <div className="flex flex-wrap gap-2">
                    {purposes.map((p: any) => (
                      <span key={p.id} className="badge bg-temple-50 text-temple-700 border-temple-200">
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {occasions.length > 0 && (
                <div className="card p-4">
                  <h3 className="text-sm font-medium text-temple-400 uppercase tracking-wider mb-2">Occasion</h3>
                  <div className="flex flex-wrap gap-2">
                    {occasions.map((o: any) => (
                      <span key={o.id} className="badge bg-maroon-50 text-maroon-700 border-maroon-200">
                        {o.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {categories.length > 0 && (
                <div className="card p-4">
                  <h3 className="text-sm font-medium text-temple-400 uppercase tracking-wider mb-2">Category</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c: any) => (
                      <span key={c.id} className="badge bg-sand-100 text-sand-800 border-sand-200">
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Available Locations */}
            <div className="card p-6">
              <h2 className="text-xl font-serif font-semibold text-temple-900 mb-4">
                Available Locations & Pricing
              </h2>
              {offerings.length === 0 ? (
                <p className="text-temple-500 text-sm">No locations currently available for this pooja.</p>
              ) : (
                <div className="space-y-3">
                  {offerings.map((offering) => {
                    const loc = offering.location;
                    const isSelected = selectedOffering?.id === offering.id;
                    return (
                      <button
                        key={offering.id}
                        onClick={() => setSelectedOffering(offering)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-saffron-400 bg-saffron-50'
                            : 'border-temple-100 hover:border-temple-200 hover:bg-temple-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <MapPin className={`w-5 h-5 ${isSelected ? 'text-saffron-600' : 'text-temple-400'}`} />
                            <div>
                              <p className="font-medium text-temple-900">{loc?.name}</p>
                              <p className="text-xs text-temple-400">{loc?.state?.name}</p>
                              {offering.duration && (
                                <p className="text-xs text-temple-400 mt-0.5">Duration: {offering.duration}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-saffron-700">
                              {formatPrice(offering.price)}
                            </p>
                            {isSelected && (
                              <Check className="w-4 h-4 text-saffron-600 ml-auto mt-1" />
                            )}
                          </div>
                        </div>
                        {offering.description && offering.description !== 'To Be Confirmed' && (
                          <p className="text-xs text-temple-500 mt-2 pl-8">{offering.description}</p>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <h3 className="text-lg font-serif font-semibold text-temple-900 mb-4">Book This Pooja</h3>

              {selectedOffering ? (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-temple-50">
                    <div className="flex items-center gap-2 text-sm text-temple-600">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedOffering.location?.name}, {selectedOffering.location?.state?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-temple-600 mt-1">
                      <Clock className="w-4 h-4" />
                      <span>{selectedOffering.duration || pooja.duration || 'Duration TBD'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-saffron-50">
                    <span className="text-sm font-medium text-temple-700">Price</span>
                    <span className="text-xl font-bold text-saffron-700">
                      {formatPrice(selectedOffering.price)}
                    </span>
                  </div>
                  <button onClick={handleBook} className="btn-primary w-full">
                    Book This Pooja <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-temple-500 mb-4">
                    Select a location from the list to see pricing and proceed with booking.
                  </p>
                  <div className="flex flex-col gap-2 text-sm text-temple-400">
                    <div className="flex items-center gap-2 justify-center">
                      <MapPin className="w-4 h-4" /> Choose location
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <Calendar className="w-4 h-4" /> Select date
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <Users className="w-4 h-4" /> Enter details
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
