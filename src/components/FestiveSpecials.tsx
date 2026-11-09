import { Link } from 'react-router-dom';
import { ArrowRight, CalendarClock, Sparkles } from 'lucide-react';
import type { Pooja } from '../types/database';
import PoojaCard from './PoojaCard';

export default function FestiveSpecials({ poojas }: { poojas: Pooja[] }) {
  if (poojas.length === 0) return null;

  // One festival name = use it as the title. Several = a general title.
  const names = Array.from(
    new Set(poojas.map((p) => (p.festive_name ?? '').trim()).filter(Boolean)),
  );
  const title = names.length === 1 ? names[0] : 'Festive Specials';

  // Show the earliest end date among these poojas, if any has one
  const ends = poojas
    .map((p) => p.festive_end)
    .filter((d): d is string => !!d)
    .sort();
  const until = ends.length
    ? new Date(`${ends[0]}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    : '';

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-saffron-600 via-saffron-500 to-maroon-600 py-14 md:py-16">
      <div aria-hidden="true" className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-white/10" />

      <div className="section-container relative">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl text-white">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Festive special
              {until && (
                <>
                  <span className="opacity-60">·</span>
                  <CalendarClock className="h-4 w-4" />
                  Until {until}
                </>
              )}
            </span>
            <h2 className="mt-4 font-serif text-3xl font-bold md:text-4xl">{title}</h2>
            <p className="mt-2 text-white/85">
              Book these auspicious rituals for the festival, performed by experienced Pandit Ji.
            </p>
          </div>
          <Link
            to="/explore-poojas"
            className="inline-flex items-center gap-2 self-start rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-saffron-700 shadow-md transition-all hover:gap-3 md:self-auto"
          >
            View all poojas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {poojas.map((pooja) => (
            <div
              key={pooja.id}
              className="w-[80%] shrink-0 snap-start sm:w-[calc((100%_-_20px)/2)] lg:w-[calc((100%_-_60px)/4)]"
            >
              <PoojaCard pooja={pooja} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}