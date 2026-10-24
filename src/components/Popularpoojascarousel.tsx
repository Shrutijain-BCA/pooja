import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Clock, RotateCw } from 'lucide-react';

/*
  Reads the pieces a card needs from a pooja object.
  If your pooja data uses different field names, change them here and nowhere else.
*/
function readPooja(pooja: any) {
  const names = (list: any[] | undefined, key?: string): string[] =>
    (list ?? []).map((x: any) => (key ? x?.[key]?.name : x?.name)).filter(Boolean);

  const tags = [
    ...names(pooja.categories),
    ...names(pooja.pooja_categories, 'categories'),
  ].slice(0, 3);

  const label =
    [...names(pooja.deities), ...names(pooja.pooja_deities, 'deities')][0] ?? '';

  return {
    slug: pooja.slug as string,
    name: pooja.name as string,
    summary: (pooja.short_description ?? pooja.description ?? '') as string,
    image: (pooja.image_url ?? pooja.image ?? '') as string,
    duration: (pooja.duration ?? '') as string,
    benefits: (pooja.laba ?? '') as string,
    tags,
    label,
  };
}

function FlipCard({ pooja }: { pooja: any }) {
  const [flipped, setFlipped] = useState(false);
  const d = readPooja(pooja);

  // Hover flips the card on mouse devices only. On phones, the Benefits button does it.
  const canHover = () =>
    typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

  return (
    <div
      className="h-[440px] [perspective:1200px]"
      onMouseEnter={() => canHover() && setFlipped(true)}
      onMouseLeave={() => canHover() && setFlipped(false)}
    >
      <div
        className={`relative h-full w-full transition-transform duration-700 ease-out motion-reduce:transition-none [transform-style:preserve-3d] ${
          flipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* FRONT */}
        <div
          className={`absolute inset-0 overflow-hidden rounded-2xl bg-temple-900 shadow-md [backface-visibility:hidden] ${
            flipped ? 'pointer-events-none' : ''
          }`}
        >
          {d.image ? (
            <img
              src={d.image}
              alt={d.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-saffron-400 to-maroon-500" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          <div className="absolute left-4 right-4 top-4 flex flex-wrap gap-2">
            {d.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-temple-700 backdrop-blur"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            {d.label && (
              <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-saffron-400">
                {d.label}
              </div>
            )}
            <h3 className="font-serif text-2xl font-bold leading-tight">{d.name}</h3>
            {d.summary && (
              <p className="mt-2 line-clamp-2 text-sm text-white/80">{d.summary}</p>
            )}
            <div className="mt-4 flex items-center justify-between gap-3">
              {d.duration ? (
                <span className="flex items-center gap-1.5 text-xs text-white/70">
                  <Clock className="h-3.5 w-3.5" />
                  {d.duration}
                </span>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={() => setFlipped(true)}
                tabIndex={flipped ? -1 : 0}
                className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur transition hover:bg-white/25"
              >
                <RotateCw className="h-3.5 w-3.5" />
                Benefits
              </button>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          className={`absolute inset-0 flex flex-col overflow-hidden rounded-2xl bg-temple-900 p-6 text-white shadow-md [backface-visibility:hidden] [transform:rotateY(180deg)] ${
            flipped ? '' : 'pointer-events-none'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-serif text-xl font-bold leading-snug">{d.name}</h3>
            <button
              type="button"
              onClick={() => setFlipped(false)}
              tabIndex={flipped ? 0 : -1}
              aria-label="Flip card back"
              className="shrink-0 rounded-full bg-white/10 p-2 transition hover:bg-white/20"
            >
              <RotateCw className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 h-px w-12 bg-saffron-400" />

          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-saffron-400">
            {d.benefits ? 'Benefits' : 'About'}
          </p>
          <p className="mt-2 min-h-0 flex-1 overflow-hidden text-sm leading-relaxed text-white/85 line-clamp-[8]">
            {d.benefits || d.summary}
          </p>

          {d.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {d.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/25 px-2.5 py-0.5 text-xs text-white/80"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <Link
            to={`/poojas/${d.slug}`}
            tabIndex={flipped ? 0 : -1}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-saffron-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-saffron-700"
          >
            View details &amp; pricing
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PopularPoojasCarousel({ poojas }: { poojas: any[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section className="section-container py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="section-title">Popular Poojas</h2>
          <p className="section-subtitle">Most sought-after Vedic rituals</p>
          <p className="mt-2 text-xs text-temple-400 sm:hidden">Swipe to see more &rarr;</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            aria-label="Previous poojas"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-temple-100 bg-white text-temple-600 shadow-sm transition hover:bg-temple-50 sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCards(1)}
            aria-label="Next poojas"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-temple-100 bg-white text-temple-600 shadow-sm transition hover:bg-temple-50 sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <Link
            to="/explore-poojas"
            className="hidden items-center gap-1 text-sm font-medium text-saffron-600 transition-all hover:gap-2 sm:flex"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain scroll-smooth pb-6 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {poojas.map((pooja) => (
          <div
            key={pooja.id}
            className="w-[82%] shrink-0 snap-start sm:w-[calc(50%_-_10px)] lg:w-[calc(25%_-_15px)]"
          >
            <FlipCard pooja={pooja} />
          </div>
        ))}
      </div>

      <Link
        to="/explore-poojas"
        className="mt-2 flex items-center justify-center gap-1 text-sm font-medium text-saffron-600 sm:hidden"
      >
        View All <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}