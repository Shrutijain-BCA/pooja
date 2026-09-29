import { useEffect, useState } from 'react';
import { Plus, Edit, Power, X, Save, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { slugify } from '../lib/helpers';
import { LoadingSpinner } from '../components/Loading';
import ErrorState from '../components/ErrorState';

interface CrudConfig {
  title: string;
  table: string;
  fields: { name: string; label: string; type?: 'text' | 'textarea' | 'number'; placeholder?: string }[];
}

export default function AdminSimpleCrud({ config }: { config: CrudConfig }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});

  useEffect(() => { load(); }, [config.table]);

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from(config.table).select('*').order('sort_order', { ascending: true });
      if (error) throw error;
      setItems(data || []);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditing(null);
    const initial: Record<string, any> = {};
    config.fields.forEach((f) => { initial[f.name] = f.type === 'number' ? 0 : ''; });
    initial.is_active = true;
    setForm(initial);
    setShowModal(true);
  };

  const openEdit = (item: any) => {
    setEditing(item);
    const form: Record<string, any> = {};
    config.fields.forEach((f) => { form[f.name] = item[f.name] || ''; });
    form.is_active = item.is_active;
    setForm(form);
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const slug = editing?.slug || slugify(form.name || '');
      const data: any = { ...form, slug };
      if (editing) {
        await supabase.from(config.table).update(data).eq('id', editing.id);
      } else {
        await supabase.from(config.table).insert(data);
      }
      setShowModal(false);
      await load();
    } catch (e: any) { alert(e.message); } finally { setSaving(false); }
  };

  const toggleActive = async (item: any) => {
    await supabase.from(config.table).update({ is_active: !item.is_active }).eq('id', item.id);
    await load();
  };

  const filtered = items.filter((item) =>
    (item.name || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="section-container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-serif font-bold text-temple-900">Manage {config.title}</h1>
        <button onClick={openAdd} className="btn-primary"><Plus className="w-4 h-4" /> Add {config.title.replace(/s$/, '')}</button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-temple-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${config.title.toLowerCase()}...`} className="input pl-10" />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-temple-50 text-temple-500">
              <tr>
                {config.fields.map((f) => (
                  <th key={f.name} className="text-left p-3 font-medium">{f.label}</th>
                ))}
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-temple-50">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-temple-50">
                  {config.fields.map((f) => (
                    <td key={f.name} className="p-3 text-temple-700">
                      {f.type === 'textarea' ? (
                        <span className="text-xs line-clamp-2">{item[f.name]}</span>
                      ) : (
                        item[f.name]
                      )}
                    </td>
                  ))}
                  <td className="p-3">
                    <span className={`badge ${item.is_active ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => openEdit(item)} className="p-1.5 rounded hover:bg-temple-100 text-temple-600"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => toggleActive(item)} className="p-1.5 rounded hover:bg-temple-100 text-temple-600"><Power className="w-4 h-4" /></button>
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
              <h2 className="text-xl font-serif font-semibold text-temple-900">{editing ? `Edit ${config.title.replace(/s$/, '')}` : `Add ${config.title.replace(/s$/, '')}`}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-temple-50"><X className="w-5 h-5 text-temple-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              {config.fields.map((f) => (
                <div key={f.name}>
                  <label className="label">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea value={form[f.name] || ''} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} rows={3} className="input" placeholder={f.placeholder} />
                  ) : (
                    <input type={f.type === 'number' ? 'number' : 'text'} value={form[f.name] || ''} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} className="input" placeholder={f.placeholder} />
                  )}
                </div>
              ))}
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded" />
                <span className="text-sm text-temple-700">Active</span>
              </label>
            </div>
            <div className="flex gap-3 p-6 border-t border-temple-100">
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
