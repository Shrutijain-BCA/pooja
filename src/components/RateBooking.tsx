import { useEffect, useState } from 'react';
import { CheckCircle2, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Booking } from '../types/database';

type MyReview = { rating: number; comment: string; is_approved: boolean };

// "Priya Sharma" becomes "Priya S." so a full name is never shown publicly
function shortName(full: string) {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1].charAt(0).toUpperCase()}.`;
}

export default function RateBooking({ booking }: { booking: Booking }) {
  // undefined = still checking, null = not rated yet
  const [existing, setExisting] = useState<MyReview | null | undefined>(undefined);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (booking.status !== 'COMPLETED') return;
    supabase
      .from('pooja_reviews')
      .select('rating, comment, is_approved')
      .eq('booking_id', booking.id)
      .maybeSingle()
      .then(({ data }) => setExisting((data as MyReview | null) ?? null));
  }, [booking.id, booking.status]);

  // Only completed bookings can be rated
  if (booking.status !== 'COMPLETED' || existing === undefined) return null;

  const submit = async () => {
    if (rating < 1) {
      setError('Please choose a star rating.');
      return;
    }
    setSaving(true);
    setError('');
    const { error: err } = await supabase.from('pooja_reviews').insert({
      pooja_id: booking.pooja_id,
      booking_id: booking.id,
      reviewer_name: shortName(booking.customer_name),
      rating,
      comment: comment.trim(),
      source: 'customer',
      is_approved: false,
    });
    setSaving(false);
    if (err) {
      setError(
        err.code === '23505'
          ? 'You have already rated this booking.'
          : 'Sorry, your rating could not be saved. Please try again.',
      );
      return;
    }
    setExisting({ rating, comment: comment.trim(), is_approved: false });
  };

  // Already rated: show it back to the customer
  if (existing) {
    return (
      <div className="card mb-6 p-6">
        <h2 className="mb-3 text-lg font-serif font-semibold text-temple-900">Your rating</h2>
        <div className="flex gap-1" aria-label={`You rated ${existing.rating} out of 5`}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              className={`h-6 w-6 ${n <= existing.rating ? 'fill-saffron-500 text-saffron-500' : 'text-temple-200'}`}
            />
          ))}
        </div>
        {existing.comment && <p className="mt-3 text-temple-700">&ldquo;{existing.comment}&rdquo;</p>}
        <p className="mt-3 flex items-center gap-2 text-sm text-temple-500">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          {existing.is_approved
            ? 'Shown on the website. Thank you!'
            : 'Thank you! Your rating will appear on the website after a quick review.'}
        </p>
      </div>
    );
  }

  // Not rated yet: show the form
  const shown = hover || rating;
  return (
    <div className="card mb-6 p-6">
      <h2 className="text-lg font-serif font-semibold text-temple-900">How was your pooja?</h2>
      <p className="mt-1 text-sm text-temple-500">Your rating helps other families choose with confidence.</p>

      <div className="mt-4 flex gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            aria-pressed={rating === n}
            className="rounded p-0.5 transition-transform hover:scale-110"
          >
            <Star className={`h-9 w-9 ${n <= shown ? 'fill-saffron-500 text-saffron-500' : 'text-temple-200'}`} />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={300}
        rows={3}
        placeholder="Tell us about your experience (optional)"
        className="input mt-4 w-full"
      />

      {error && <p className="mt-2 text-sm text-maroon-600">{error}</p>}

      <button type="button" onClick={submit} disabled={saving} className="btn-primary mt-4">
        {saving ? 'Saving...' : 'Submit rating'}
      </button>
    </div>
  );
}