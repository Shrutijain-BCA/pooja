import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setName('');
    setEmail('');
    setMessage('');
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="section-container py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-temple-900">Contact Us</h1>
        <p className="text-temple-500 mt-2">We're here to help with your spiritual journey</p>
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
                <p className="text-sm text-temple-500 mt-1">Haridwar, Uttarakhand, India</p>
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
                <p className="text-sm text-temple-500 mt-1">contact@poojapalace.in</p>
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
                <p className="text-sm text-temple-500 mt-1">+91 98765 43210</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card p-6">
          {sent && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 flex items-center gap-2 text-sm text-green-700">
              <CheckCircle className="w-4 h-4" /> Thank you! We'll get back to you soon.
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Your Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="input" placeholder="Full name" />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input" placeholder="you@example.com" />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                placeholder="How can we help you?"
                className="input"
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Send Message <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
