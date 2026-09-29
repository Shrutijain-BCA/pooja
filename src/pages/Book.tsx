import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Check, ArrowRight, ArrowLeft, Calendar, Users, MapPin, FileText, AlertCircle } from 'lucide-react';
import { getPoojaBySlug, getOfferingsByPooja } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../lib/api';
import type { Pooja, LocationPooja } from '../types/database';
import { formatPrice } from '../lib/helpers';
import { LoadingSpinner } from '../components/Loading';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

const STEPS = ['Pooja', 'Location', 'Date', 'Devotees', 'Details', 'Review', 'Submit'];

export default function Book() {
  const { poojaSlug } = useParams<{ poojaSlug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [pooja, setPooja] = useState<Pooja | null>(null);
  const [offerings, setOfferings] = useState<LocationPooja[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [selectedOfferingId, setSelectedOfferingId] = useState(searchParams.get('offering') || '');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [devotees, setDevotees] = useState(1);
  const [customerName, setCustomerName] = useState(profile?.name || '');
  const [customerPhone, setCustomerPhone] = useState(profile?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(profile?.email || user?.email || '');
  const [customerNotes, setCustomerNotes] = useState('');

  useEffect(() => {
    if (!poojaSlug) return;
    (async () => {
      try {
        const p = await getPoojaBySlug(poojaSlug);
        setPooja(p);
        if (p) {
          const offs = await getOfferingsByPooja(p.id);
          setOfferings(offs);
          if (searchParams.get('offering')) {
            setStep(2);
          }
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [poojaSlug]);

  useEffect(() => {
    if (profile) {
      setCustomerName(profile.name || customerName);
      setCustomerPhone(profile.phone || customerPhone);
      setCustomerEmail(profile.email || customerEmail);
    }
  }, [profile]);

  const selectedOffering = offerings.find((o) => o.id === selectedOfferingId);

  const canProceed = () => {
    switch (step) {
      case 0: return !!pooja;
      case 1: return !!selectedOfferingId;
      case 2: return !!preferredDate;
      case 3: return devotees > 0;
      case 4: return customerName && customerPhone && customerEmail;
      case 5: return true;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (!user || !pooja || !selectedOffering) return;
    setSubmitting(true);
    setSubmitError('');
    const { data, error } = await createBooking({
      user_id: user.id,
      pooja_id: pooja.id,
      location_id: selectedOffering.location_id,
      offering_id: selectedOffering.id,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      preferred_date: preferredDate,
      preferred_time: preferredTime,
      number_of_devotees: devotees,
      amount: selectedOffering.price,
      customer_notes: customerNotes,
    });
    setSubmitting(false);
    if (error) {
      setSubmitError(error);
    } else if (data) {
      navigate(`/booking-confirmation/${data.id}`);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;
  if (!pooja) return (
    <EmptyState
      icon={MapPin}
      title="Pooja Not Found"
      description="The pooja you're trying to book doesn't exist."
      action={<Link to="/explore-poojas" className="btn-primary">Browse Poojas</Link>}
    />
  );

  return (
    <div className="section-container py-8 max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <nav className="text-sm text-temple-400 mb-2">
          <Link to="/explore-poojas" className="hover:text-saffron-600">Poojas</Link>
          <span className="mx-2">/</span>
          <Link to={`/poojas/${pooja.slug}`} className="hover:text-saffron-600">{pooja.name}</Link>
          <span className="mx-2">/</span>
          <span className="text-temple-700">Book</span>
        </nav>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-temple-900">Book {pooja.name}</h1>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8 overflow-x-auto scrollbar-hide">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
              i < step ? 'bg-green-500 text-white' :
              i === step ? 'bg-saffron-600 text-white' :
              'bg-temple-100 text-temple-400'
            }`}>
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`ml-2 text-xs font-medium hidden sm:block ${
              i === step ? 'text-saffron-700' : i < step ? 'text-green-600' : 'text-temple-400'
            }`}>
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`w-6 sm:w-12 h-0.5 mx-2 ${i < step ? 'bg-green-400' : 'bg-temple-100'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Auth Check */}
      {!user && step >= 4 && (
        <div className="card p-6 mb-6 bg-maroon-50 border-maroon-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-maroon-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-maroon-800">Login Required</h3>
              <p className="text-sm text-maroon-600 mt-1">
                Please create an account or login to continue with your booking.
              </p>
              <div className="flex gap-3 mt-3">
                <Link to="/login" state={{ from: `/book/${poojaSlug}?offering=${selectedOfferingId}` }} className="btn-primary text-sm py-2">
                  Login
                </Link>
                <Link to="/signup" state={{ from: `/book/${poojaSlug}?offering=${selectedOfferingId}` }} className="btn-secondary text-sm py-2">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="card p-6">
        {/* Step 0: Pooja (auto-selected) */}
        {step === 0 && (
          <div>
            <h2 className="text-lg font-serif font-semibold text-temple-900 mb-4">Confirm Your Pooja</h2>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-temple-50">
              {pooja.image && <img src={pooja.image} alt={pooja.name} className="w-16 h-16 rounded-lg object-cover" />}
              <div>
                <p className="font-medium text-temple-900">{pooja.name}</p>
                <p className="text-sm text-temple-500">{pooja.description}</p>
                {pooja.duration && <p className="text-xs text-temple-400 mt-1">Duration: {pooja.duration}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Location */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-serif font-semibold text-temple-900 mb-4">Select Location</h2>
            <div className="space-y-3">
              {offerings.map((offering) => (
                <button
                  key={offering.id}
                  onClick={() => setSelectedOfferingId(offering.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedOfferingId === offering.id
                      ? 'border-saffron-400 bg-saffron-50'
                      : 'border-temple-100 hover:border-temple-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-temple-400" />
                      <div>
                        <p className="font-medium text-temple-900">{offering.location?.name}</p>
                        <p className="text-xs text-temple-400">{offering.location?.state?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-saffron-700">{formatPrice(offering.price)}</p>
                      {selectedOfferingId === offering.id && <Check className="w-4 h-4 text-saffron-600 ml-auto mt-1" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Date */}
        {step === 2 && (
          <div>
            <h2 className="text-lg font-serif font-semibold text-temple-900 mb-4">Select Preferred Date</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Preferred Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-temple-400" />
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="input pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="label">Preferred Time (Optional)</label>
                <input
                  type="time"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="input"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Devotees */}
        {step === 3 && (
          <div>
            <h2 className="text-lg font-serif font-semibold text-temple-900 mb-4">Number of Devotees</h2>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Users className="w-12 h-12 text-temple-300 mx-auto mb-4" />
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setDevotees(Math.max(1, devotees - 1))}
                    className="w-10 h-10 rounded-full border border-temple-200 text-temple-600 hover:bg-temple-50 text-xl font-medium"
                  >
                    -
                  </button>
                  <span className="text-3xl font-serif font-bold text-temple-900 w-16 text-center">{devotees}</span>
                  <button
                    onClick={() => setDevotees(devotees + 1)}
                    className="w-10 h-10 rounded-full border border-temple-200 text-temple-600 hover:bg-temple-50 text-xl font-medium"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-temple-500 mt-4">How many people will participate?</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Customer Details */}
        {step === 4 && user && (
          <div>
            <h2 className="text-lg font-serif font-semibold text-temple-900 mb-4">Your Details</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required className="input" />
              </div>
              <div>
                <label className="label">Mobile Number</label>
                <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required className="input" />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} required className="input" />
              </div>
              <div>
                <label className="label">Special Requirements / Message (Optional)</label>
                <textarea
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  rows={3}
                  placeholder="Any special requirements or message for the Pandit Ji..."
                  className="input"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {step === 5 && user && (
          <div>
            <h2 className="text-lg font-serif font-semibold text-temple-900 mb-4">Review Your Booking</h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-temple-50">
                <span className="text-temple-500">Pooja</span>
                <span className="font-medium text-temple-900">{pooja.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-temple-50">
                <span className="text-temple-500">Location</span>
                <span className="font-medium text-temple-900">{selectedOffering?.location?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-temple-50">
                <span className="text-temple-500">Date</span>
                <span className="font-medium text-temple-900">{preferredDate}</span>
              </div>
              {preferredTime && (
                <div className="flex justify-between py-2 border-b border-temple-50">
                  <span className="text-temple-500">Time</span>
                  <span className="font-medium text-temple-900">{preferredTime}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-temple-50">
                <span className="text-temple-500">Devotees</span>
                <span className="font-medium text-temple-900">{devotees}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-temple-50">
                <span className="text-temple-500">Name</span>
                <span className="font-medium text-temple-900">{customerName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-temple-50">
                <span className="text-temple-500">Mobile</span>
                <span className="font-medium text-temple-900">{customerPhone}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-temple-50">
                <span className="text-temple-500">Email</span>
                <span className="font-medium text-temple-900 text-sm">{customerEmail}</span>
              </div>
              {customerNotes && (
                <div className="py-2 border-b border-temple-50">
                  <span className="text-temple-500 block mb-1">Notes</span>
                  <span className="text-sm text-temple-700">{customerNotes}</span>
                </div>
              )}
              <div className="flex justify-between py-3 bg-saffron-50 px-3 rounded-lg">
                <span className="font-medium text-temple-700">Amount</span>
                <span className="text-xl font-bold text-saffron-700">{formatPrice(selectedOffering?.price)}</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <p className="text-sm text-amber-700">
                  This is a booking request. Our team will review and confirm availability. The booking is not confirmed yet.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Submit */}
        {step === 6 && (
          <div className="text-center py-8">
            {submitError && (
              <div className="mb-4 p-3 rounded-lg bg-maroon-50 border border-maroon-200 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-maroon-500 shrink-0 mt-0.5" />
                <p className="text-sm text-maroon-700">{submitError}</p>
              </div>
            )}
            <FileText className="w-12 h-12 text-temple-300 mx-auto mb-4" />
            <h2 className="text-lg font-serif font-semibold text-temple-900 mb-2">Ready to Submit?</h2>
            <p className="text-temple-500 text-sm mb-6 max-w-md mx-auto">
              Click submit to send your booking request. Our team will review it and contact you to confirm.
            </p>
            <button onClick={handleSubmit} disabled={submitting} className="btn-primary text-base px-8">
              {submitting ? 'Submitting...' : 'Submit Booking Request'}
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-temple-50">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0 || submitting}
            className="btn-ghost disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          {step < 6 && (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed() || (!user && step >= 4)}
              className="btn-primary"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
