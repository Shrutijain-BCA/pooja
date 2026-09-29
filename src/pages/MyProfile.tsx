import { useState } from 'react';
import { User, Mail, Phone, MapPin, Save, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/Loading';

export default function MyProfile() {
  const { profile, updateProfile, user } = useAuth();
  const [name, setName] = useState(profile?.name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [address, setAddress] = useState(profile?.address || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    const { error } = await updateProfile({ name, phone, address });
    setSaving(false);
    if (error) {
      setError(error);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (!profile) return <LoadingSpinner />;

  return (
    <div className="section-container py-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-bold text-temple-900">My Profile</h1>
        <p className="text-temple-500 mt-1">Manage your account information</p>
      </div>

      {/* Profile Header */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-saffron-400 to-maroon-500 flex items-center justify-center text-white text-2xl font-medium">
            {profile.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-serif font-semibold text-temple-900">{profile.name || 'User'}</h2>
            <p className="text-sm text-temple-500">{profile.email || user?.email}</p>
            <p className="text-xs text-temple-400 mt-1">
              Member since {new Date(profile.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="card p-6">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-maroon-50 border border-maroon-200 text-sm text-maroon-700">
            {error}
          </div>
        )}
        {saved && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 flex items-center gap-2 text-sm text-green-700">
            <CheckCircle className="w-4 h-4" /> Profile updated successfully
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-temple-400" />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="input pl-10" />
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-temple-400" />
              <input type="email" value={profile.email || user?.email || ''} disabled className="input pl-10 bg-temple-50" />
            </div>
            <p className="text-xs text-temple-400 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="label">Mobile Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-temple-400" />
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="input pl-10" />
            </div>
          </div>
          <div>
            <label className="label">Address (Optional)</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-temple-400" />
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                placeholder="Your address..."
                className="input pl-10"
              />
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Save Changes'} {!saving && <Save className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  );
}
