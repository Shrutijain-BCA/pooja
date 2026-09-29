import { useEffect, useState } from 'react';
import { Plus, Edit, Power, X, Save, Search } from 'lucide-react';
import { getAllLocationsAdmin, getAllStatesAdmin } from '../lib/api';
import { supabase } from '../lib/supabase';
import { slugify } from '../lib/helpers';
import type { Location, State } from '../types/database';
import { LoadingSpinner } from '../components/Loading';
import ErrorState from '../components/ErrorState';

export default function AdminLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Location | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', slug: '', state_id: '', parent_location_id: '', type: 'city',
    description: '', significance: '', image: '', is_active: true, sort_order: 0,
  });

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [l, s] = await Promise.all([getAllLocationsAdmin(), getAllStatesAdmin()]);
      setLocations(l);
      setStates(s);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', slug: '', state_id: states[0]?.id || '', parent_location_id: '', type: 'city', description: '', significance: '', image: '', is_active: true, sort_order: 0 });
    setShowModal(true);
  };

  const openEdit = (l: Location) => {
    setEditing(l);
    setForm({
      name: l.name, slug: l.slug, state_id: l.state_id, parent_location_id: l.parent_location_id || '',
      type: l.type, description: l.description, significance: l.significance, image: l.image,
      is_active: l.is_active, sort_order: l.sort_order,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const slug = editing?.slug || slugify(form.name);
      const data: any = { ...form, slug, parent_location_id: form.parent_location_id || null };
      if (editing) {
        await supabase.from('locations').update(data).eq('id', editing.id);
      } else {
        await supabase.from('locations').insert(data);
      }
      setShowModal(false);
      await load();
    } catch (e: any) { alert(e.message); } finally { setSaving(false); }
  };

  const toggleActive = async (l: Location) => {
    await supabase.from('locations').update({ is_active: !l.is_active }).eq('id', l.id);
    await load();
  };

  const filtered = locations.filter((l) => l.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="section-container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-serif font-bold text-temple-900">Manage Locations</h1>
        <button onClick={openAdd} className="btn-primary"><Plus className="w-4 h-4" /> Add Location</button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-temple-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search locations..." className="input pl-10" />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-temple-50 text-temple-500">
              <tr>
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">State</th>
                <th className="text-left p-3 font-medium">Type</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-temple-50">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-temple-50">
                  <td className="p-3 font-medium text-temple-900">{l.name}</td>
                  <td className="p-3 text-temple-600">{(l as any).state?.name || '-'}</td>
                  <td className="p-3 text-temple-600 capitalize">{l.type}</td>
                  <td className="p-3">
                    <span className={`badge ${l.is_active ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                      {l.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => openEdit(l)} className="p-1.5 rounded hover:bg-temple-100 text-temple-600"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => toggleActive(l)} className="p-1.5 rounded hover:bg-temple-100 text-temple-600"><Power className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-temple-100 sticky top-0 bg-white">
              <h2 className="text-xl font-serif font-semibold text-temple-900">{editing ? 'Edit Location' : 'Add Location'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-temple-50"><X className="w-5 h-5 text-temple-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
              </div>
              <div>
                <label className="label">State</label>
                <select value={form.state_id} onChange={(e) => setForm({ ...form, state_id: e.target.value })} className="input">
                  {states.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input">
                  <option value="city">City</option>
                  <option value="dham">Dham</option>
                  <option value="temple">Temple</option>
                  <option value="ghat">Ghat</option>
                  <option value="religious_place">Religious Place</option>
                </select>
              </div>
              <div>
                <label className="label">Parent Location (Optional)</label>
                <select value={form.parent_location_id} onChange={(e) => setForm({ ...form, parent_location_id: e.target.value })} className="input">
                  <option value="">None</option>
                  {locations.filter((l) => l.state_id === form.state_id).map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="input" />
              </div>
              <div>
                <label className="label">Religious Significance</label>
                <textarea value={form.significance} onChange={(e) => setForm({ ...form, significance: e.target.value })} rows={2} className="input" />
              </div>
              <div>
                <label className="label">Image URL</label>
                <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="input" placeholder="https://..." />
              </div>
              <div>
                <label className="label">Sort Order</label>
                <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="input" />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded" />
                <span className="text-sm text-temple-700">Active</span>
              </label>
            </div>
            <div className="flex gap-3 p-6 border-t border-temple-100 sticky bottom-0 bg-white">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name} className="btn-primary flex-1">
                {saving ? 'Saving...' : 'Save'} {!saving && <Save className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
