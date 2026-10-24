
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSent(false);
    setError('');

    try {
      const response = await fetch('https://formspree.io/f/mqpparyg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });

      if (response.ok) {
        setSent(true);
        setName('');
        setEmail('');
        setMessage('');
        setTimeout(() => setSent(false), 5000);
      } else {
        setError('Unable to send your message. Please try again.');
      }
    } catch (err) {
      console.error('Form submission failed:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-temple-900">
          Contact Us
        </h1>
        <p className="text-temple-500 mt-2">
          We're here to help with your spiritual journey
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-4">
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-saffron-50 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-saffron-600" />
              </div>
              <div>
                <h3 className="font-medium text-temple-900">Address</h3>
                <p className="text-sm text-temple-500 mt-1">
                  Haridwar, Uttarakhand, India
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-temple-50 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-temple-600" />
              </div>
              <div>
                <h3 className="font-medium text-temple-900">Email</h3>
                <p className="text-sm text-temple-500 mt-1">
                  contact@poojapalace.in
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-maroon-50 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-maroon-600" />
              </div>
              <div>
                <h3 className="font-medium text-temple-900">Phone</h3>
                <p className="text-sm text-temple-500 mt-1">
                  +91 76681 19521
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card p-6">
          {sent && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 flex items-center gap-2 text-sm text-green-700">
              <CheckCircle className="w-4 h-4 shrink-0" />
              Thank you! We'll get back to you soon.
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Your Name</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input w-full"
                placeholder="Full name"
              />
            </div>

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input w-full"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="label">Message</label>
              <textarea
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="input w-full"
                placeholder="How can we help you?"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send Message'}
              {!loading && <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
