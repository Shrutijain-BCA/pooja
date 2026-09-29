import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-sand-50 to-temple-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-saffron-500 to-maroon-600 flex items-center justify-center mb-4">
            <span className="text-white font-serif text-2xl font-bold">PP</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-temple-900">Reset Password</h1>
          <p className="text-temple-500 mt-1">We'll send you a password reset link</p>
        </div>

        <div className="card p-6">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-temple-900 mb-2">Check Your Email</h3>
              <p className="text-temple-500 text-sm">
                We've sent a password reset link to <span className="font-medium text-temple-700">{email}</span>.
                Please check your inbox and follow the instructions.
              </p>
              <Link to="/login" className="btn-secondary mt-6">
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-maroon-50 border border-maroon-200 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-maroon-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-maroon-700">{error}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-temple-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="input pl-10"
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? 'Sending...' : 'Send Reset Link'} {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center mt-6 text-sm text-temple-500">
          Remembered your password?{' '}
          <Link to="/login" className="text-saffron-600 hover:text-saffron-700 font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
