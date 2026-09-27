import { useEffect, useState } from 'react';
import { Plus, Edit, Power, X, Save, Search } from 'lucide-react';
import { getAllPoojasAdmin, getCategories, getPurposes, getDeities, getOccasions } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/helpers';
import type { Pooja, Category, Purpose, Deity, Occasion } from '@/types/database';
import { LoadingSpinner } from '@/components/Loading';
import ErrorState from '@/components/ErrorState';

export default function AdminPoojas() {
  const [poojas, setPoojas] = useState<Pooja[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [purposes, setPurposes] = useState<Purpose[]>([]);
  const [deities, setDeities] = useState<Deity[]>([]);
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Pooja | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', long_description: '', image: '', duration: '', is_active: true,
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [selectedDeities, setSelectedDeities] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [p, c, pu, d, o] = await Promise.all([getAllPoojasAdmin(), getCategories(), getPurposes(), getDeities(), getOccasions()]);
      setPoojas(p);
      setCategories(c);
      setPurposes(pu);
      setDeities(d);
      setOccasions(o);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', description: '', long_description: '', image: '', duration: '', is_active: true });
    setSelectedCategories([]);
    setSelectedPurposes([]);
    setSelectedDeities([]);
    setSelectedOccasions([]);
    setShowModal(true);
  };

  const openEdit = (p: Pooja) => {
    setEditing(p);
    setForm({
      name: p.name, description: p.description, long_description: p.long_description || '',
      image: p.image, duration: p.duration, is_active: p.is_active,
    });
    const cats = (p as any).categories?.map((c: any) => c.category?.id).filter(Boolean) ?? [];
    const pus = (p as any).purposes?.map((pu: any) => pu.purpose?.id).filter(Boolean) ?? [];
    const des = (p as any).deities?.map((d: any) => d.deity?.id).filter(Boolean) ?? [];
    const occs = (p as any).occasions?.map((o: any) => o.occasion?.id).filter(Boolean) ?? [];
    setSelectedCategories(cats);
    setSelectedPurposes(pus);
    setSelectedDeities(des);
    setSelectedOccasions(occs);
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const slug = editing?.slug || slugify(form.name);
      if (editing) {
        await supabase.from('poojas').update({ ...form, slug, updated_at: new Date().toISOString() }).eq('id', editing.id);
      } else {
        const { data } = await supabase.from('poojas').insert({ ...form, slug }).select().single();
        if (data) {
          await syncRelations(data.id, selectedCategories, selectedPurposes, selectedDeities, selectedOccasions);
        }
        setShowModal(false);
        await load();
        return;
      }

      // Update relations
      await syncRelations(editing.id, selectedCategories, selectedPurposes, selectedDeities, selectedOccasions);
      setShowModal(false);
      await load();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const syncRelations = async (poojaId: string, catIds: string[], purpIds: string[], deityIds: string[], occIds: string[]) => {
    await supabase.from('pooja_categories').delete().eq('pooja_id', poojaId);
    await supabase.from('pooja_purposes').delete().eq('pooja_id', poojaId);
    await supabase.from('pooja_deities').delete().eq('pooja_id', poojaId);
    await supabase.from('pooja_occasions').delete().eq('pooja_id', poojaId);

    if (catIds.length) await supabase.from('pooja_categories').insert(catIds.map(id => ({ pooja_id: poojaId, category_id: id })));
    if (purpIds.length) await supabase.from('pooja_purposes').insert(purpIds.map(id => ({ pooja_id: poojaId, purpose_id: id })));
    if (deityIds.length) await supabase.from('pooja_deities').insert(deityIds.map(id => ({ pooja_id: poojaId, deity_id: id })));
    if (occIds.length) await supabase.from('pooja_occasions').insert(occIds.map(id => ({ pooja_id: poojaId, occasion_id: id })));
  };

  const toggleActive = async (p: Pooja) => {
    await supabase.from('poojas').update({ is_active: !p.is_active }).eq('id', p.id);
    await load();
  };

  const filtered = poojas.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="section-container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-serif font-bold text-temple-900">Manage Poojas</h1>
        <button onClick={openAdd} className="btn-primary"><Plus className="w-4 h-4" /> Add Pooja</button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-temple-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search poojas..." className="input pl-10" />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-temple-50 text-temple-500">
              <tr>
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">Slug</th>
                <th className="text-left p-3 font-medium">Duration</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-temple-50">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-temple-50">
                  <td className="p-3 font-medium text-temple-900">{p.name}</td>
                  <td className="p-3 text-temple-400 font-mono text-xs">{p.slug}</td>
                  <td className="p-3 text-temple-600">{p.duration || '-'}</td>
                  <td className="p-3">
                    <span className={`badge ${p.is_active ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => openEdit(p)} className="p-1.5 rounded hover:bg-temple-100 text-temple-600"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => toggleActive(p)} className="p-1.5 rounded hover:bg-temple-100 text-temple-600"><Power className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-temple-100 sticky top-0 bg-white">
              <h2 className="text-xl font-serif font-semibold text-temple-900">{editing ? 'Edit Pooja' : 'Add Pooja'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-temple-50"><X className="w-5 h-5 text-temple-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
              </div>
              <div>
                <label className="label">Short Description</label>
                <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input" />
              </div>
              <div>
                <label className="label">Long Description</label>
                <textarea value={form.long_description} onChange={(e) => setForm({ ...form, long_description: e.target.value })} rows={4} className="input" />
              </div>
              <div>
                <label className="label">Image URL</label>
                <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="input" placeholder="https://..." />
              </div>
              <div>
                <label className="label">Duration</label>
                <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="input" placeholder="e.g. 2-3 hours" />
              </div>

              <div>
                <label className="label">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button key={c.id} onClick={() => setSelectedCategories(prev => prev.includes(c.id) ? prev.filter(x => x !== c.id) : [...prev, c.id])} className={`badge cursor-pointer ${selectedCategories.includes(c.id) ? 'bg-saffron-100 text-saffron-700 border-saffron-300' : 'bg-temple-50 text-temple-500 border-temple-200'}`}>
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Purposes</label>
                <div className="flex flex-wrap gap-2">
                  {purposes.map((p) => (
                    <button key={p.id} onClick={() => setSelectedPurposes(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])} className={`badge cursor-pointer ${selectedPurposes.includes(p.id) ? 'bg-saffron-100 text-saffron-700 border-saffron-300' : 'bg-temple-50 text-temple-500 border-temple-200'}`}>
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Deities</label>
                <div className="flex flex-wrap gap-2">
                  {deities.map((d) => (
                    <button key={d.id} onClick={() => setSelectedDeities(prev => prev.includes(d.id) ? prev.filter(x => x !== d.id) : [...prev, d.id])} className={`badge cursor-pointer ${selectedDeities.includes(d.id) ? 'bg-saffron-100 text-saffron-700 border-saffron-300' : 'bg-temple-50 text-temple-500 border-temple-200'}`}>
                      {d.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Occasions</label>
                <div className="flex flex-wrap gap-2">
                  {occasions.map((o) => (
                    <button key={o.id} onClick={() => setSelectedOccasions(prev => prev.includes(o.id) ? prev.filter(x => x !== o.id) : [...prev, o.id])} className={`badge cursor-pointer ${selectedOccasions.includes(o.id) ? 'bg-saffron-100 text-saffron-700 border-saffron-300' : 'bg-temple-50 text-temple-500 border-temple-200'}`}>
                      {o.name}
                    </button>
                  ))}
                </div>
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
