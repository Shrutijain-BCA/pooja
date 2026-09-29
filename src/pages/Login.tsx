import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      navigate(from);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-sand-50 to-temple-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-saffron-500 to-maroon-600 flex items-center justify-center mb-4">
            <span className="text-white font-serif text-2xl font-bold">PP</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-temple-900">Welcome Back</h1>
          <p className="text-temple-500 mt-1">Sign in to your Pooja Palace account</p>
        </div>

        <div className="card p-6">
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
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-temple-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="input pl-10"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Signing in...' : 'Sign In'} {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link to="/forgot-password" className="text-sm text-saffron-600 hover:text-saffron-700 font-medium">
              Forgot password?
            </Link>
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-temple-500">
          Don't have an account?{' '}
          <Link to="/signup" className="text-saffron-600 hover:text-saffron-700 font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
