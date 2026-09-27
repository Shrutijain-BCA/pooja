import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Calendar } from 'lucide-react';
import { getPoojas, getCategories, getPurposes, getDeities, getStates, getLocations, getAllActiveOfferings } from '@/lib/api';
import type { Pooja, Category, Purpose, Deity, State, Location } from '@/types/database';
import PoojaCard from '@/components/PoojaCard';
import { LoadingSpinner } from '@/components/Loading';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { Search as SearchIcon } from 'lucide-react';

export default function ExplorePoojas() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [poojas, setPoojas] = useState<Pooja[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [purposes, setPurposes] = useState<Purpose[]>([]);
  const [deities, setDeities] = useState<Deity[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [offerings, setOfferings] = useState<{ pooja_id: string; location_id: string; price: number | null }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [selectedDeity, setSelectedDeity] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    Promise.all([getPoojas(), getCategories(), getPurposes(), getDeities(), getStates(), getLocations(), getAllActiveOfferings()])
      .then(([p, c, pu, d, s, l, o]) => {
        setPoojas(p);
        setCategories(c);
        setPurposes(pu);
        setDeities(d);
        setStates(s);
        setLocations(l);
        setOfferings(o);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredPoojas = useMemo(() => {
    let result = poojas;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
      );
    }
    if (selectedCategory) {
      result = result.filter((p: any) =>
        p.categories?.some((c: any) => c.category?.id === selectedCategory)
      );
    }
    if (selectedPurpose) {
      result = result.filter((p: any) =>
        p.purposes?.some((pu: any) => pu.purpose?.id === selectedPurpose)
      );
    }
    if (selectedDeity) {
      result = result.filter((p: any) =>
        p.deities?.some((d: any) => d.deity?.id === selectedDeity)
      );
    }
    if (selectedState) {
      const stateLocationIds = locations.filter((l) => l.state_id === selectedState).map((l) => l.id);
      const poojaIdsAtState = new Set(offerings.filter((o) => stateLocationIds.includes(o.location_id)).map((o) => o.pooja_id));
      result = result.filter((p) => poojaIdsAtState.has(p.id));
    }

    return result;
  }, [poojas, search, selectedCategory, selectedPurpose, selectedDeity, selectedState, locations, offerings]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedPurpose('');
    setSelectedDeity('');
    setSelectedState('');
  };

  const activeFilterCount = [selectedCategory, selectedPurpose, selectedDeity, selectedState].filter(Boolean).length;

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="section-container py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-temple-900">Explore Poojas</h1>
        <p className="text-temple-500 mt-2">Browse our complete catalogue of Vedic rituals</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-temple-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search poojas by name or description..."
            className="input pl-10"
          />
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-temple-200 text-sm font-medium text-temple-700 hover:bg-temple-50 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-saffron-100 text-saffron-700 text-xs">
              {activeFilterCount}
            </span>
          )}
        </button>
        <p className="text-sm text-temple-500">{filteredPoojas.length} poojas found</p>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="card p-4 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-temple-900">Filter By</h3>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-sm text-maroon-600 hover:text-maroon-700 flex items-center gap-1">
                <X className="w-4 h-4" /> Clear All
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="label">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Purpose</label>
              <select
                value={selectedPurpose}
                onChange={(e) => setSelectedPurpose(e.target.value)}
                className="input"
              >
                <option value="">All Purposes</option>
                {purposes.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Deity</label>
              <select
                value={selectedDeity}
                onChange={(e) => setSelectedDeity(e.target.value)}
                className="input"
              >
                <option value="">All Deities</option>
                {deities.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="input"
              >
                <option value="">All States</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {filteredPoojas.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No Poojas Found"
          description="Try adjusting your search or filters to find what you're looking for."
          action={<button onClick={clearFilters} className="btn-secondary">Clear Filters</button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPoojas.map((pooja) => (
            <PoojaCard key={pooja.id} pooja={pooja} />
          ))}
        </div>
      )}
    </div>
  );
}
