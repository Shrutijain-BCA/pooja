import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Home, Heart, Users, Star, UserRound, Activity, Sun, Gift, ArrowRight, Check } from 'lucide-react';
import { getPurposes, getPoojas } from '../lib/api';
import type { Purpose, Pooja } from '../types/database';
import PoojaCard from '../components/PoojaCard';
import { LoadingSpinner } from '../components/Loading';

const ICONS: Record<string, any> = {
  home: Home,
  heart: Heart,
  users: Users,
  star: Star,
  ancestor: UserRound,
  activity: Activity,
  sun: Sun,
  gift: Gift,
};

export default function FindAPooja() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPurpose = searchParams.get('purpose') || '';
  const [purposes, setPurposes] = useState<Purpose[]>([]);
  const [poojas, setPoojas] = useState<Pooja[]>([]);
  const [selectedPurpose, setSelectedPurpose] = useState(initialPurpose);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getPurposes(), getPoojas()])
      .then(([p, poojas]) => {
        setPurposes(p);
        setPoojas(poojas);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedPurpose) {
      setSearchParams({ purpose: selectedPurpose });
    } else {
      setSearchParams({});
    }
  }, [selectedPurpose]);

  const filteredPoojas = selectedPurpose
    ? poojas.filter((p: any) =>
        p.purposes?.some((pu: any) => pu.purpose?.slug === selectedPurpose)
      )
    : [];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="section-container py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-temple-900">Find a Pooja</h1>
        <p className="text-temple-500 mt-2 text-lg">What would you like help with?</p>
      </div>

      {/* Purpose Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {purposes.map((purpose) => {
          const Icon = ICONS[purpose.icon] || Star;
          const isSelected = selectedPurpose === purpose.slug;
          return (
            <button
              key={purpose.id}
              onClick={() => setSelectedPurpose(isSelected ? '' : purpose.slug)}
              className={`card group p-6 text-center transition-all ${
                isSelected ? 'border-saffron-400 bg-saffron-50 shadow-md' : 'hover:border-saffron-200'
              }`}
            >
              <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 transition-colors ${
                isSelected ? 'bg-saffron-100' : 'bg-temple-50 group-hover:bg-saffron-50'
              }`}>
                <Icon className={`w-6 h-6 ${isSelected ? 'text-saffron-600' : 'text-temple-500'}`} />
              </div>
              <h3 className={`text-sm font-medium ${isSelected ? 'text-saffron-700' : 'text-temple-800'}`}>
                {purpose.name}
              </h3>
              {isSelected && (
                <div className="mt-2 inline-flex items-center gap-1 text-xs text-saffron-600">
                  <Check className="w-3 h-3" /> Selected
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Results */}
      {selectedPurpose ? (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-temple-900">
                Recommended Poojas
              </h2>
              <p className="text-temple-500 text-sm mt-1">
                {filteredPoojas.length} pooja{filteredPoojas.length !== 1 ? 's' : ''} found for this purpose
              </p>
            </div>
            <button onClick={() => setSelectedPurpose('')} className="btn-ghost text-sm">
              Clear Selection
            </button>
          </div>
          {filteredPoojas.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-temple-500">No poojas found for this purpose. Try selecting a different option.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPoojas.map((pooja) => (
                <PoojaCard key={pooja.id} pooja={pooja} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="card p-12 text-center bg-gradient-to-br from-saffron-50 to-sand-50">
          <Star className="w-12 h-12 text-saffron-300 mx-auto mb-4" />
          <h3 className="text-lg font-serif font-semibold text-temple-900 mb-2">
            Select a Purpose Above
          </h3>
          <p className="text-temple-500 max-w-md mx-auto">
            Choose what you'd like help with and we'll suggest the most relevant poojas for your needs.
          </p>
          <Link to="/explore-poojas" className="btn-secondary mt-6">
            Or Browse All Poojas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
