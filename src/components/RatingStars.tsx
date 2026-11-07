import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Summary = { avg: number; count: number };
type SummaryMap = Record<string, Summary>;

// The ratings are fetched once and shared by every card on the page
let cache: Promise<SummaryMap> | null = null;

async function fetchSummaries(): Promise<SummaryMap> {
  const { data, error } = await supabase
    .from('pooja_rating_summary')
    .select('pooja_id, avg_rating, review_count');
  if (error) throw error;
  const map: SummaryMap = {};
  (data ?? []).forEach((r: any) => {
    map[r.pooja_id] = { avg: Number(r.avg_rating), count: Number(r.review_count) };
  });
  return map;
}

function loadSummaries(): Promise<SummaryMap> {
  if (!cache) {
    cache = fetchSummaries().catch(() => {
      cache = null;
      return {} as SummaryMap;
    });
  }
  return cache;
}

// Call this after a new rating is saved so the next view shows fresh numbers
export function refreshRatings() {
  cache = null;
}

export default function RatingStars({
  poojaId,
  light = false,
  className = '',
}: {
  poojaId: string;
  light?: boolean;
  className?: string;
}) {
  // undefined = still loading, null = this pooja has no ratings yet
  const [summary, setSummary] = useState<Summary | null | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    loadSummaries().then((map) => {
      if (alive) setSummary(map[poojaId] ?? null);
    });
    return () => {
      alive = false;
    };
  }, [poojaId]);

  // Keep the space reserved while loading so the card doesn't jump
  if (summary === undefined) return <div className={`h-4 ${className}`} />;

  const avg = summary?.avg ?? 0;
  const count = summary?.count ?? 0;
  const width = `${Math.max(0, Math.min(100, (avg / 5) * 100))}%`;
  const empty = light ? 'text-white/30' : 'text-temple-200';
  const muted = light ? 'text-white/75' : 'text-temple-400';
  const strong = light ? 'text-white' : 'text-temple-800';

  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      aria-label={count > 0 ? `Rated ${avg.toFixed(1)} out of 5 from ${count} ratings` : 'No ratings yet'}
    >
      <span className="relative inline-flex">
        <span className={`flex ${empty}`}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} className="h-4 w-4 shrink-0 fill-current" />
          ))}
        </span>
        <span className="absolute inset-y-0 left-0 flex overflow-hidden text-saffron-500" style={{ width }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} className="h-4 w-4 shrink-0 fill-current" />
          ))}
        </span>
      </span>
      {count > 0 ? (
        <span className={`text-xs ${muted}`}>
          <span className={`font-semibold ${strong}`}>{avg.toFixed(1)}</span> ({count})
        </span>
      ) : (
        <span className={`text-xs ${muted}`}>No ratings yet</span>
      )}
    </div>
  );
}