import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, Compass, Sparkles, ArrowRight, Calendar, Star, BadgeCheck, BookOpen, Languages, Quote, Play, Image as ImageIcon, Video, MessageCircle, CheckCheck } from 'lucide-react';
import { getStates, getLocations, getPoojas, getPurposes } from '../lib/api';
import type { State, Location, Pooja, Purpose } from '../types/database';
import { LoadingSpinner } from '../components/Loading';
import PoojaCard from '../components/PoojaCard';
import PopularPoojasCarousel from '../components/Popularpoojascarousel';

const panditJi = [
  {
    name: 'Acharya Dinesh Sati',
    title: 'Sri Vidya Acharya',
    experience: '10 years of experience',
    specialty: 'Sri Vidya Dikshit · Purva Pujari, Shankaracharya Jyotirpith',
    languages: 'Hindi · Sanskrit',
    image: '/Acharya_dinesh_sati .jpeg',
  },
  {
    name: 'Dr Vedacharya Vinayak Bhatta Ji',
    title: 'Vedic Ritual Specialist',
    experience: '20 years of experience',
    specialty: 'Chandi Havan · All Pooja · 10 Mahavidya Mantra Dikshit',
    languages: 'Hindi · Sanskrit · English',
    image: '/Dr_vedacharya_Vinayak_Bhatta_ji.jpeg',
  },
  {
    name: 'Dr Acharya Badri Prasad Sati',
    title: 'Vedic Ritual & Shanti Specialist',
    experience: '18 years of experience',
    specialty: 'Navagraha Shanti · Navagraha Pooja · Vastu Pooja · Rudra Abhishek',
    languages: 'Hindi · Sanskrit · English',
    image: '/Dr_Acharya_Badri_Prasad_Sati.jpeg',
  },
  {
    name: 'Acharya Ajay Dimri',
    title: 'Vedic Ritual Specialist',
    experience: '14 years of experience',
    specialty: 'All Pooja Specialist',
    languages: 'Hindi · Sanskrit · English',
    image: '/Acharya_Ajay_Dimri .jpeg',
  },
  {
    name: 'Dr Santosh Sati',
    title: 'Senior Vedic Acharya',
    experience: '25 years of experience',
    specialty: 'All Pooja Specialist',
    languages: 'Hindi · English · Sanskrit',
    image: '/Dr_Santosh_sati.jpeg',
  },
  {
    name: 'Vedacharya Aman Sharma',
    title: 'Vedic Ritual Specialist',
    experience: '7 years of experience',
    specialty: 'Rudra Abhishek · Havan',
    languages: 'Hindi · English · Sanskrit',
    image: '/Vedacharya_Aman_Sharma.jpeg',
  },
  {
    name: 'Acharya Kamal Joshi',
    title: 'Pitri Pooja Specialist',
    experience: '9 years of experience',
    specialty: 'Pitri Pooja · Narayanbali · Tripindi · Rudrabhishek',
    languages: 'Hindi · Sanskrit · Punjabi',
    image: '/Acharya_kamal_joshi.jpeg',
  },
];

const devoteeExperiences = [
  {
    type: 'message',
    label: 'Message',
    name: 'Ananya Sharma',
    location: 'New Delhi',
    pooja: 'Griha Pravesh',
    quote: 'The entire ceremony felt peaceful, personal, and beautifully managed from start to finish.',
    image: '/public/havan-video-poster.jpeg',
  },
  {
    type: 'photo',
    label: 'Pooja memory',
    name: 'Rahul Mehta',
    location: 'Mumbai',
    pooja: 'Pitru Tarpan',
    quote: 'A sacred moment our family will always remember.',
    image: '/public/havan-video-poster.jpeg',
  },
  {
    type: 'video',
    label: 'Client video',
    name: 'Meera Joshi',
    location: 'Jaipur',
    pooja: 'Ganga Poojan',
    quote: 'Sharing a glimpse of our blessed day by the holy Ganga.',
    image: '/havan-video.mp4',
  },
  {
    type: 'message',
    label: 'Message',
    name: 'Vikram Singh',
    location: 'Bengaluru',
    pooja: 'Rudrabhishek',
    quote: 'The Pandit Ji explained every step with patience. We felt completely cared for.',
    image: '/images/WhatsApp_Image_2026-09-17_at_12.34.11_(1).jpeg',
  },
  {
    type: 'video',
    label: 'Client video',
    name: 'Kavita Agarwal',
    location: 'Lucknow',
    pooja: 'Satyanarayan Katha',
    quote: 'A beautiful experience filled with devotion and warm memories.',
    image: '/images/WhatsApp_Image_2026-09-17_at_12.34.12_(1).jpeg',
  },
];

const experienceFilters = [
  { value: 'all', label: 'All stories', icon: MessageCircle },
  { value: 'message', label: 'Messages', icon: Quote },
  { value: 'photo', label: 'Photos', icon: ImageIcon },
  { value: 'video', label: 'Videos', icon: Video },
] as const;

type Experience = (typeof devoteeExperiences)[number];

// How a "message" story is shown: as a chat message instead of a photo card
function MessageCard({ experience }: { experience: Experience }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-temple-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg">
      {/* Who sent it */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-saffron-400 to-maroon-500 text-base font-semibold text-white">
          {experience.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-temple-900">{experience.name}</p>
          <p className="truncate text-xs text-temple-500">{experience.location}</p>
        </div>
        <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#E7FFDB] px-3 py-1 text-xs font-medium text-temple-700">
          <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />
          {experience.label}
        </span>
      </div>

      {/* The message, shown as a chat bubble */}
      <div className="mt-4 flex-1 rounded-xl bg-[#EFEAE2] p-4">
        <div className="max-w-[94%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-[15px] leading-relaxed text-temple-900 shadow-sm">
          {experience.quote}
          <span className="mt-1 flex justify-end">
            <CheckCheck className="h-4 w-4 text-[#53BDEB]" aria-hidden="true" />
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1 text-xs text-temple-400">
        <BadgeCheck className="h-4 w-4 text-green-600" />
        Verified devotee experience · {experience.pooja}
      </div>
    </article>
  );
}

export default function Home() {
  const [states, setStates] = useState<State[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [poojas, setPoojas] = useState<Pooja[]>([]);
  const [purposes, setPurposes] = useState<Purpose[]>([]);
  const [experienceFilter, setExperienceFilter] = useState<(typeof experienceFilters)[number]['value']>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStates(), getLocations(), getPoojas(), getPurposes()])
      .then(([s, l, p, pu]) => {
        setStates(s);
        setLocations(l);
        setPoojas(p.slice(0, 8));
        setPurposes(pu);
      })
      .finally(() => setLoading(false));
  }, []);

  const visibleExperiences = experienceFilter === 'all'
    ? devoteeExperiences
    : devoteeExperiences.filter((experience) => experience.type === experienceFilter);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/32111239/pexels-photo-32111239.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Ganga Aarti ceremony"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-temple-950/80 via-temple-900/60 to-temple-950/80" />
        </div>
        <div className="relative section-container text-center py-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-saffron-300" />
            <span className="text-sm text-white/90 font-medium">Authentic Vedic Rituals</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white max-w-3xl mx-auto leading-tight text-balance animate-slide-up">
            Book Sacred Poojas at India's Most Revered Destinations
          </h1>
          <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Experience authentic Vedic rituals arranged with trusted Pandit Ji at sacred destinations across India.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/explore-poojas" className="btn-primary text-base px-8 py-3.5">
              Explore Poojas <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/find-a-pooja" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-white/10 backdrop-blur-sm text-white font-medium border border-white/20 hover:bg-white/20 transition-all duration-200">
              <Search className="w-5 h-5" /> Find a Pooja
            </Link>
          </div>
        </div>
      </section>

      {/* Certified Pandit Ji */}
      <section className="section-container py-16 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-saffron-700 text-sm font-semibold uppercase tracking-[0.18em] mb-3">
              <span className="w-8 h-px bg-saffron-400" />
              Meet your spiritual guide
            </div>
            <h2 className="section-title">Experienced Pandit Ji, Trusted by Families</h2>
            <p className="section-subtitle max-w-xl">
              Every ritual is led with traditional knowledge, personal care, and the dignity your sacred occasion deserves.
            </p>
          </div>
          <Link to="/contact" className="hidden sm:inline-flex items-center gap-2 text-saffron-700 font-semibold hover:gap-3 transition-all">
            Need help choosing a Pandit Ji <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {panditJi.map((pandit, index) => (
            <article
              key={pandit.name}
              className="group relative overflow-hidden rounded-2xl bg-temple-950 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={pandit.image}
                  alt={`${pandit.name}, ${pandit.title}`}
                  className="w-full h-full object-cover object-top grayscale-[15%] group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-temple-950 via-temple-950/20 to-transparent" />
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-temple-800 shadow-sm">
                  <BadgeCheck className="w-4 h-4 text-green-600" /> Certified
                </div>
                <div className="absolute bottom-4 left-5 right-5">
                  <h3 className="text-xl font-serif font-bold text-white">{pandit.name}</h3>
                  <p className="text-saffron-300 text-sm mt-1">{pandit.title}</p>
                </div>
              </div>
              <div className="p-5 text-white">
                <div className="flex items-center gap-2 text-sm text-white/75 mb-4">
                  <Star className="w-4 h-4 fill-saffron-400 text-saffron-400" />
                  <span>{pandit.experience}</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2.5">
                    <BookOpen className="w-4 h-4 text-saffron-400 mt-0.5 shrink-0" />
                    <span className="text-white/80">{pandit.specialty}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Languages className="w-4 h-4 text-saffron-400 mt-0.5 shrink-0" />
                    <span className="text-white/80">{pandit.languages}</span>
                  </div>
                </div>
                <Link to="/explore-poojas" className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-sm font-semibold text-saffron-300 hover:text-saffron-200 transition-colors">
                  Book a pooja <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Devotee Experiences */}
      {/* <section className="bg-temple-50 py-16 md:py-20 bg-saffron-50">
        <div className="section-container bg-saffron-50 pb-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-saffron-700 text-sm font-semibold uppercase tracking-[0.18em] mb-3">
                <span className="w-8 h-px bg-saffron-400" />
                From our devotee family
              </div>
              <h2 className="section-title">Sacred Moments, Shared with Us</h2>
              <p className="section-subtitle">
                Read heartfelt messages and discover the moments families entrusted to us.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {experienceFilters.map((filter) => {
                const Icon = filter.icon;
                const active = experienceFilter === filter.value;
                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setExperienceFilter(filter.value)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border transition-all duration-200 ${active
                        ? 'bg-temple-900 text-white border-temple-900 shadow-sm'
                        : 'bg-white text-temple-600 border-temple-200 hover:border-saffron-300 hover:text-saffron-700'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleExperiences.map((experience) => {
              const key = `${experience.name}-${experience.type}`;

              // A message: show only the message card
              if (experience.type === 'message') {
                return <MessageCard key={key} experience={experience} />;
              }

              // Photo or video: the existing card
              return (
                <article key={key} className="group bg-white rounded-2xl border border-temple-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="relative h-56 overflow-hidden bg-temple-100">
                    <img
                      src={experience.image}
                      alt={`${experience.name}'s ${experience.pooja} experience`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-temple-950/70 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-temple-800 shadow-sm">
                      {experience.label}
                    </div>
                    {experience.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/95 text-saffron-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 ml-0.5 fill-current" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-4 left-5 text-white">
                      <p className="font-semibold">{experience.name}</p>
                      <p className="text-xs text-white/75 mt-0.5">{experience.location}</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-saffron-700 mb-3">{experience.pooja}</p>
                    <p className="text-temple-700 leading-relaxed">“{experience.quote}”</p>
                    <div className="flex items-center gap-1 mt-4 text-xs text-temple-400">
                      <BadgeCheck className="w-4 h-4 text-green-600" />
                      Verified devotee experience · {experience.pooja}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section> */}

      {/* Discovery Methods */}
      <section className="section-container py-16">
        <div className="text-center mb-12">
          <h2 className="section-title">Three Ways to Find Your Pooja</h2>
          <p className="section-subtitle">Choose the path that suits you best</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Explore by Location */}
          <Link to="/locations" className="card group p-8 text-center hover:border-saffron-200">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-saffron-50 flex items-center justify-center mb-4 group-hover:bg-saffron-100 transition-colors">
              <MapPin className="w-7 h-7 text-saffron-600" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-temple-900 mb-2">Explore by Location</h3>
            <p className="text-temple-500 text-sm mb-4">I know where I want my pooja</p>
            <div className="text-xs text-temple-400 space-y-1">
              <p>State → Destination → Religious Place → Available Poojas</p>
            </div>
            <span className="inline-flex items-center gap-1 text-saffron-600 font-medium text-sm mt-4 group-hover:gap-2 transition-all">
              Browse Locations <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          {/* Explore Poojas */}
          <Link to="/explore-poojas" className="card group p-8 text-center hover:border-saffron-200">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-temple-50 flex items-center justify-center mb-4 group-hover:bg-temple-100 transition-colors">
              <Compass className="w-7 h-7 text-temple-600" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-temple-900 mb-2">Explore Poojas</h3>
            <p className="text-temple-500 text-sm mb-4">I know which pooja I want</p>
            <div className="text-xs text-temple-400 space-y-1">
              <p>Rudrabhishek → Available Locations → Location-specific pricing</p>
            </div>
            <span className="inline-flex items-center gap-1 text-saffron-600 font-medium text-sm mt-4 group-hover:gap-2 transition-all">
              Browse Poojas <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          {/* Find a Pooja */}
          <Link to="/find-a-pooja" className="card group p-8 text-center hover:border-saffron-200">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-maroon-50 flex items-center justify-center mb-4 group-hover:bg-maroon-100 transition-colors">
              <Sparkles className="w-7 h-7 text-maroon-600" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-temple-900 mb-2">Find a Pooja</h3>
            <p className="text-temple-500 text-sm mb-4">I'm not sure which pooja I need</p>
            <div className="text-xs text-temple-400 space-y-1">
              <p>Select a purpose → Get relevant pooja suggestions</p>
            </div>
            <span className="inline-flex items-center gap-1 text-saffron-600 font-medium text-sm mt-4 group-hover:gap-2 transition-all">
              Get Suggestions <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </section>

      {/* Popular States */}
      <section className="bg-temple-50 py-16">
        <div className="section-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Sacred States</h2>
              <p className="section-subtitle">Discover poojas across India's holy regions</p>
            </div>
            <Link to="/locations" className="hidden sm:flex items-center gap-1 text-saffron-600 font-medium text-sm hover:gap-2 transition-all">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {states.map((state) => {
              const stateLocations = locations.filter((l) => l.state_id === state.id);
              return (
                <Link
                  key={state.id}
                  to={`/locations/${state.slug}`}
                  className="card group relative h-56 overflow-hidden"
                >
                  {state.image && (
                    <img
                      src={state.image}
                      alt={state.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-temple-950/90 via-temple-900/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-serif font-bold text-white">{state.name}</h3>
                    <p className="text-white/70 text-sm mt-1">{stateLocations.length} sacred locations</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Poojas */}
      {/* <section className="section-container py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Popular Poojas</h2>
            <p className="section-subtitle">Most sought-after Vedic rituals</p>
          </div>
          <Link to="/explore-poojas" className="hidden sm:flex items-center gap-1 text-saffron-600 font-medium text-sm hover:gap-2 transition-all">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {poojas.map((pooja) => (
            <PoojaCard key={pooja.id} pooja={pooja} />
          ))}
        </div>
      </section> */}
      <PopularPoojasCarousel poojas={poojas}/>

      {/* Find by Purpose */}
      <section className="bg-gradient-to-b from-saffron-50 to-sand-50 py-16">
        <div className="section-container">
          <div className="text-center mb-10">
            <h2 className="section-title">What Would You Like Help With?</h2>
            <p className="section-subtitle">Select your purpose and we'll suggest the right pooja</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {purposes.map((purpose) => (
              <Link
                key={purpose.id}
                to={`/find-a-pooja?purpose=${purpose.slug}`}
                className="card group p-6 text-center hover:border-saffron-200 hover:shadow-md"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-white shadow-sm flex items-center justify-center mb-3 group-hover:bg-saffron-50 transition-colors">
                  <Star className="w-6 h-6 text-saffron-500" />
                </div>
                <h3 className="text-sm font-medium text-temple-800 group-hover:text-saffron-700 transition-colors">
                  {purpose.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-container py-16">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-temple-800 to-temple-950 p-12 text-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 border-2 border-saffron-400 rounded-full -translate-x-20 -translate-y-20" />
            <div className="absolute bottom-0 right-0 w-60 h-60 border-2 border-saffron-400 rounded-full translate-x-30 translate-y-30" />
          </div>
          <div className="relative">
            <Calendar className="w-12 h-12 text-saffron-400 mx-auto mb-4" />
            <h2 className="text-3xl font-serif font-bold text-white mb-4">Ready to Book Your Pooja?</h2>
            <p className="text-white/70 max-w-xl mx-auto mb-8">
              Browse our catalogue of authentic Vedic rituals and book at your preferred sacred destination.
            </p>
            <Link to="/explore-poojas" className="btn-primary text-base px-8 py-3.5">
              Book a Pooja <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
