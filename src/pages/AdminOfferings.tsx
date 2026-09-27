import { useEffect, useState } from 'react';
import { Plus, Edit, X, Save, Search, Layers } from 'lucide-react';
import { getAllOfferingsAdmin, getAllPoojasAdmin, getAllLocationsAdmin } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/helpers';
import type { LocationPooja, Pooja, Location } from '@/types/database';
import { LoadingSpinner } from '@/components/Loading';
import ErrorState from '@/components/ErrorState';

export default function AdminOfferings() {
  const [offerings, setOfferings] = useState<LocationPooja[]>([]);
  const [poojas, setPoojas] = useState<Pooja[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<LocationPooja | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    location_id: '', pooja_id: '', price: '', duration: '', description: '', is_available: true,
  });

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [o, p, l] = await Promise.all([getAllOfferingsAdmin(), getAllPoojasAdmin(), getAllLocationsAdmin()]);
      setOfferings(o);
      setPoojas(p);
      setLocations(l);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ location_id: '', pooja_id: '', price: '', duration: '', description: '', is_available: true });
    setShowModal(true);
  };

  const openEdit = (o: LocationPooja) => {
    setEditing(o);
    setForm({
      location_id: o.location_id, pooja_id: o.pooja_id,
      price: o.price?.toString() || '', duration: o.duration, description: o.description, is_available: o.is_available,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const price = form.price ? parseFloat(form.price) : null;
      const data = { ...form, price, updated_at: new Date().toISOString() };
      if (editing) {
        await supabase.from('location_poojas').update(data).eq('id', editing.id);
      } else {
        await supabase.from('location_poojas').insert(data);
      }
      setShowModal(false);
      await load();
    } catch (e: any) { alert(e.message); } finally { setSaving(false); }
  };

  const filtered = offerings.filter((o) =>
    (o.pooja?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (o.location?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="section-container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-temple-900">Location-Pooja Offerings</h1>
          <p className="text-temple-500 text-sm mt-1">Manage location-specific pricing and availability</p>
        </div>
        <button onClick={openAdd} className="btn-primary"><Plus className="w-4 h-4" /> Add Offering</button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-temple-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search offerings..." className="input pl-10" />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-temple-50 text-temple-500">
              <tr>
                <th className="text-left p-3 font-medium">Location</th>
                <th className="text-left p-3 font-medium">Pooja</th>
                <th className="text-left p-3 font-medium">Price</th>
                <th className="text-left p-3 font-medium">Duration</th>
                <th className="text-left p-3 font-medium">Available</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-temple-50">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-temple-50">
                  <td className="p-3 font-medium text-temple-900">{o.location?.name}</td>
                  <td className="p-3 text-temple-700">{o.pooja?.name}</td>
                  <td className="p-3 font-semibold text-saffron-700">{formatPrice(o.price)}</td>
                  <td className="p-3 text-temple-600">{o.duration || '-'}</td>
                  <td className="p-3">
                    <span className={`badge ${o.is_available ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                      {o.is_available ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => openEdit(o)} className="p-1.5 rounded hover:bg-temple-100 text-temple-600"><Edit className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-temple-100">
              <h2 className="text-xl font-serif font-semibold text-temple-900">{editing ? 'Edit Offering' : 'Add Offering'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-temple-50"><X className="w-5 h-5 text-temple-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label">Location</label>
                <select value={form.location_id} onChange={(e) => setForm({ ...form, location_id: e.target.value })} className="input" disabled={!!editing}>
                  <option value="">Select location</option>
                  {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Pooja</label>
                <select value={form.pooja_id} onChange={(e) => setForm({ ...form, pooja_id: e.target.value })} className="input" disabled={!!editing}>
                  <option value="">Select pooja</option>
                  {poojas.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Price (₹) — Leave empty for "To Be Confirmed"</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input" placeholder="e.g. 5100" />
              </div>
              <div>
                <label className="label">Duration</label>
                <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="input" placeholder="e.g. 2-3 hours" />
              </div>
              <div>
                <label className="label">Location-specific Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="input" />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} className="w-4 h-4 rounded" />
                <span className="text-sm text-temple-700">Available for booking</span>
              </label>
            </div>
            <div className="flex gap-3 p-6 border-t border-temple-100">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleSave} disabled={saving || (!editing && (!form.location_id || !form.pooja_id))} className="btn-primary flex-1">
                {saving ? 'Saving...' : 'Save'} {!saving && <Save className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
