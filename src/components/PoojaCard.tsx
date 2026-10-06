import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Pooja } from '../types/database';

interface PoojaCardProps {
  pooja: Pooja;
}

export default function PoojaCard({ pooja }: PoojaCardProps) {
  const categories = (pooja as any).categories?.map((c: any) => c.category).filter(Boolean) ?? [];
  const deities = (pooja as any).deities?.map((d: any) => d.deity).filter(Boolean) ?? [];

  return (
    <Link to={`/poojas/${pooja.slug}`} className="card group block">
      <div className="relative h-48 overflow-hidden bg-temple-100">
        {pooja.image ? (
          <img
            src={pooja.image}
            alt={pooja.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-temple-300 font-serif text-2xl">{pooja.name.charAt(0)}</span>
          </div>
        )}
        {categories.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {categories.slice(0, 2).map((cat: any) => (
              <span key={cat.id} className="badge bg-white/90 text-temple-700 border-temple-200 backdrop-blur-sm">
                {cat.name}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg font-semibold text-temple-900 group-hover:text-saffron-700 transition-colors">
          {pooja.name}
        </h3>
        <p className="text-sm text-temple-500 mt-1 line-clamp-2">{pooja.description}</p>

        {deities.length > 0 && (
          <p className="text-xs text-saffron-600 mt-2 font-medium">
            {deities.map((d: any) => d.name).join(', ')}
          </p>
        )}

        {pooja.duration && (
          <p className="text-xs text-temple-400 mt-1">Duration: {pooja.duration}</p>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-temple-50">
          <span className="text-xs text-temple-400">View location-specific pricing</span>
          <span className="flex items-center gap-1 text-sm font-medium text-saffron-600 group-hover:text-saffron-700">
            Details <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
