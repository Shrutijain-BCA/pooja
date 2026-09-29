import { useEffect, useState } from 'react';
import { Search, Mail, Phone, Calendar } from 'lucide-react';
import { getAllUsersAdmin } from '../lib/api';
import { LoadingSpinner } from '../components/Loading';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { formatDate } from '../lib/helpers';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAllUsersAdmin()
      .then(setUsers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search)
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="section-container py-8">
      <h1 className="text-3xl font-serif font-bold text-temple-900 mb-6">Users</h1>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-temple-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="input pl-10" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Search} title="No Users Found" description="No users match your search." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((u) => (
            <div key={u.id} className="card p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron-400 to-maroon-500 flex items-center justify-center text-white font-medium">
                  {u.name?.charAt(0) || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-temple-900 truncate">{u.name || 'Unknown'}</p>
                  <p className="text-xs text-temple-400">Joined {formatDate(u.created_at)}</p>
                </div>
              </div>
              <div className="space-y-1 text-sm text-temple-500">
                <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {u.email || 'N/A'}</p>
                <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {u.phone || 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
