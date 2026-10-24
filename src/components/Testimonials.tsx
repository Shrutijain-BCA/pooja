import { useState } from 'react';
import { MessageCircle, Play, Quote } from 'lucide-react';

/* ------------------------------------------------------------------
   EDIT THE CONTENT HERE. Nothing else in this file needs to change.
   Files live in:  public/testimonials/
   ------------------------------------------------------------------ */
const VIDEO = {
  src: '/public/havan-video.mp4',
  poster: '/public/havan-video-poster.jpeg',
  title: 'Havan Anushthan',
  caption: 'Watch a ceremony performed by Panditji',
};

const PHOTO = {
  src: '/public/havan-family.jpeg',
  alt: 'A family performing a havan with Panditji at home',
  title: 'Havan at the devotees’ home',
  caption: 'A family completes the ritual together',
};

const MESSAGE = {
  name: 'Nancy S.',
  context: 'Navratri Anushthan',
  text:
    'Areee wah! Pandit ji! Apko pata hai... yaha apko sb yaad kr rahe hai... hm sb apki hi baat krte hai jb ikathe baithe hote hai. Sb ko bahut hi achha laga... mere toh ye sb se best Navratri rahi... aur baki sb bhi esa hi keh rahe hai... Hm sb apko yaad kr rahe hai... asha hai k aap jaldi hi yaha pr aaoge 🙏😊',
  translation:
    'Oh wow, Panditji! Everyone here is remembering you. When we all sit together, we talk only about you. Everyone liked it so much. For me this was the best Navratri, and everyone else says the same. We all miss you and hope you will come here again soon.',
};

/* ---------------------------- Video card --------------------------- */
function VideoCard() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative h-[480px] overflow-hidden rounded-3xl bg-temple-900 shadow-lg lg:row-span-2 lg:h-auto lg:min-h-[560px]">
      {playing ? (
        <video
          src={VIDEO.src}
          poster={VIDEO.poster}
          controls
          autoPlay
          playsInline
          className="absolute inset-0 h-full w-full bg-black object-contain"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${VIDEO.title}`}
          className="group absolute inset-0 block h-full w-full text-left"
        >
          <img
            src={VIDEO.poster}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/25" />

          <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-saffron-600 text-white shadow-xl ring-8 ring-white/25 transition-transform duration-300 group-hover:scale-110">
            <Play className="ml-1 h-8 w-8" fill="currentColor" />
          </span>

          <span className="absolute inset-x-0 bottom-0 block p-6 text-white">
            <span className="block text-xs font-semibold uppercase tracking-wider text-saffron-400">
              Video
            </span>
            <span className="mt-1 block font-serif text-2xl font-bold">{VIDEO.title}</span>
            <span className="mt-1 block text-sm text-white/80">{VIDEO.caption}</span>
          </span>
        </button>
      )}
    </div>
  );
}

/* ---------------------------- Photo card --------------------------- */
function PhotoCard() {
  return (
    <figure className="group relative h-[300px] overflow-hidden rounded-3xl shadow-lg sm:h-[340px] lg:col-span-2">
      <img
        src={PHOTO.src}
        alt={PHOTO.alt}
        loading="lazy"
        className="h-full w-full object-cover [object-position:center_30%] transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
      <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white">
        <span className="block text-xs font-semibold uppercase tracking-wider text-saffron-400">
          Photo
        </span>
        <span className="mt-1 block font-serif text-2xl font-bold">{PHOTO.title}</span>
        <span className="mt-1 block text-sm text-white/80">{PHOTO.caption}</span>
      </figcaption>
    </figure>
  );
}

/* --------------------------- Message card -------------------------- */
function MessageCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-temple-100 bg-white p-6 shadow-lg sm:p-8 lg:col-span-2">
      <Quote
        className="pointer-events-none absolute right-6 top-6 h-16 w-16 text-saffron-100"
        aria-hidden="true"
      />

      <div className="relative flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-saffron-400 to-maroon-500 text-base font-semibold text-white">
          {MESSAGE.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-temple-900">{MESSAGE.name}</div>
          <div className="truncate text-xs text-temple-500">{MESSAGE.context}</div>
        </div>
        <span className="ml-auto hidden items-center gap-1.5 rounded-full bg-[#E7FFDB] px-3 py-1 text-xs font-medium text-temple-700 sm:flex">
          <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />
          WhatsApp message
        </span>
      </div>

      <div className="relative mt-5 rounded-2xl rounded-tl-sm bg-[#E7FFDB] px-5 py-4 text-[15px] leading-relaxed text-temple-900 shadow-sm">
        {MESSAGE.text}
      </div>

      <p className="relative mt-4 text-sm italic text-temple-500">
        <span className="font-medium not-italic text-temple-600">In English: </span>
        {MESSAGE.translation}
      </p>
    </div>
  );
}

/* ------------------------------ Section ---------------------------- */
export default function Testimonials() {
  return (
    <section className="bg-saffron-50/60">
      <div className="section-container py-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-saffron-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-saffron-700">
            Devotee Stories
          </span>
          <h2 className="section-title mt-4">Blessings from our devotees</h2>
          <p className="section-subtitle">
            Moments and words shared by the families we have served.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <VideoCard />
          <PhotoCard />
          <MessageCard />
        </div>
      </div>
    </section>
  );
}