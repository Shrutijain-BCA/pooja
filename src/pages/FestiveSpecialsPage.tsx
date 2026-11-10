import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { getPoojas } from '../lib/api';
import type { Pooja } from '../types/database';
import { isFestiveNow } from '../lib/helpers';
import PoojaCard from '../components/PoojaCard';
import { LoadingSpinner } from '../components/Loading';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

export default function FestiveSpecialsPage() {
  const [poojas, setPoojas] = useState<Pooja[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPoojas()
      .then((all) => setPoojas(all.filter(isFestiveNow)))
      .catch((e: any) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;

  // Group the special poojas by festival name (Diwali Special, Navratri Special, ...)
  const groups = new Map<string, Pooja[]>();
  poojas.forEach((p) => {
    const key = (p.festive_name ?? '').trim() || 'Festive Special';
    groups.set(key, [...(groups.get(key) ?? []), p]);
  });
  const entries = Array.from(groups.entries());
  const title = entries.length === 1 ? entries[0][0] : 'Special Poojas';

  return (
    <div>
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-saffron-600 via-saffron-500 to-maroon-600 py-12 md:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-white/10" />
        <div className="section-container relative text-white">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            Special poojas
          </span>
          <h1 className="mt-4 font-serif text-3xl font-bold md:text-5xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-white/85">
            {poojas.length > 0
              ? `${poojas.length} special ${poojas.length === 1 ? 'pooja' : 'poojas'} available for the festival, performed by experienced Pandit Ji.`
              : 'Festive special poojas will appear here when a festival is near.'}
          </p>
        </div>
      </section>

      {/* The special poojas */}
      <div className="section-container py-10">
        {poojas.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No special poojas right now"
            description="Festive special poojas appear here when a festival is near. Meanwhile, you can browse all our poojas."
            action={<Link to="/explore-poojas" className="btn-primary">Explore Poojas</Link>}
          />
        ) : (
          <div className="space-y-12">
            {entries.map(([name, list]) => (
              <section key={name}>
                {entries.length > 1 && (
                  <h2 className="mb-5 font-serif text-2xl font-semibold text-temple-900">
                    {name} <span className="text-base font-normal text-temple-400">({list.length})</span>
                  </h2>
                )}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {list.map((pooja) => (
                    <PoojaCard key={pooja.id} pooja={pooja} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}