import { useEffect, useState } from 'react';
import { Plus, Edit, Power, X, Save, Search } from 'lucide-react';
import { getAllPoojasAdmin, getCategories, getPurposes, getDeities, getOccasions, getAllLocationsAdmin } from '../lib/api';import { supabase } from '../lib/supabase';
import { slugify } from '../lib/helpers';
import type { Pooja, Category, Purpose, Deity, Occasion, Location } from '../types/database';
import { LoadingSpinner } from '../components/Loading';
import ErrorState from '../components/ErrorState';

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
    is_festive_special: false, festive_name: '', festive_start: '', festive_end: '',
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [selectedDeities, setSelectedDeities] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [offerings, setOfferings] = useState<Record<string, { selected: boolean; price: string }>>({});
  const [offeringsReady, setOfferingsReady] = useState(false);
  const [bulkPrice, setBulkPrice] = useState('');

  useEffect(() => {
    load();
  }, []);

    const load = async () => {
    setLoading(true);
    try {
      const [p, c, pu, d, o, l] = await Promise.all([getAllPoojasAdmin(), getCategories(), getPurposes(), getDeities(), getOccasions(), getAllLocationsAdmin()]);
      setPoojas(p);
      setCategories(c);
      setPurposes(pu);
      setDeities(d);
      setOccasions(o);
      setLocations(l.filter((x) => x.is_active));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
        setForm({
      name: '', description: '', long_description: '', image: '', duration: '', is_active: true,
      is_festive_special: false, festive_name: '', festive_start: '', festive_end: '',
    });
    setSelectedCategories([]);
    setSelectedPurposes([]);
    setSelectedDeities([]);
    setSelectedOccasions([]);
    setOfferings({});
    setOfferingsReady(true);
    setBulkPrice('');
    setShowModal(true);
  };

  const openEdit = (p: Pooja) => {
    setEditing(p);
    setForm({
      name: p.name, description: p.description, long_description: p.long_description || '',
      image: p.image, duration: p.duration, is_active: p.is_active,      is_festive_special: p.is_festive_special ?? false, festive_name: p.festive_name ?? '',
      festive_start: p.festive_start ?? '', festive_end: p.festive_end ?? '',
    });
    const cats = (p as any).categories?.map((c: any) => c.category?.id).filter(Boolean) ?? [];
    const pus = (p as any).purposes?.map((pu: any) => pu.purpose?.id).filter(Boolean) ?? [];
    const des = (p as any).deities?.map((d: any) => d.deity?.id).filter(Boolean) ?? [];
    const occs = (p as any).occasions?.map((o: any) => o.occasion?.id).filter(Boolean) ?? [];
    setSelectedCategories(cats);
    setSelectedPurposes(pus);
    setSelectedDeities(des);
    setSelectedOccasions(occs);

    // Load this pooja's current locations and prices.
    // If this fails, the locations are left untouched when you save.
    setOfferings({});
    setOfferingsReady(false);
    setBulkPrice('');
    supabase
      .from('location_poojas')
      .select('location_id, price, is_available')
      .eq('pooja_id', p.id)
      .then(({ data, error }) => {
        if (error) return;
        const next: Record<string, { selected: boolean; price: string }> = {};
        (data ?? []).forEach((row: any) => {
          next[row.location_id] = {
            selected: row.is_available,
            price: row.price != null ? String(Number(row.price)) : '',
          };
        });
        setOfferings(next);
        setOfferingsReady(true);
      });

    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const slug = editing?.slug || slugify(form.name);
            const payload = {
        ...form,
        festive_start: form.festive_start || null,
        festive_end: form.festive_end || null,
        slug,
      };
      let poojaId: string;

      if (editing) {
        const { error } = await supabase.from('poojas').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editing.id);
        if (error) throw error;
        poojaId = editing.id;
      } else {
        const { data, error } = await supabase.from('poojas').insert(payload).select().single();
        if (error) throw error;
        poojaId = data.id;
      }

      await syncRelations(poojaId, selectedCategories, selectedPurposes, selectedDeities, selectedOccasions);

      try {
        await saveOfferings(poojaId, !editing);
      } catch (e: any) {
        alert(`The pooja was saved, but its locations and prices could not be saved: ${e.message}`);
      }

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

    // ---- Locations & prices ----
  const toggleLocation = (id: string) =>
    setOfferings((prev) => ({ ...prev, [id]: { selected: !prev[id]?.selected, price: prev[id]?.price ?? '' } }));

  const setLocationPrice = (id: string, price: string) =>
    setOfferings((prev) => ({ ...prev, [id]: { selected: prev[id]?.selected ?? false, price } }));

  const selectAllLocations = (select: boolean) =>
    setOfferings((prev) => {
      const next = { ...prev };
      locations.forEach((l) => {
        next[l.id] = { selected: select, price: prev[l.id]?.price ?? '' };
      });
      return next;
    });

  const applyBulkPrice = () =>
    setOfferings((prev) => {
      const next = { ...prev };
      locations.forEach((l) => {
        if (next[l.id]?.selected) next[l.id] = { ...next[l.id], price: bulkPrice };
      });
      return next;
    });

  const saveOfferings = async (poojaId: string, isNew: boolean) => {
    if (!offeringsReady) return;
    const rows = locations
      .filter((l) => offerings[l.id] && (offerings[l.id].selected || !isNew))
      .map((l) => {
        const o = offerings[l.id];
        const n = o.price.trim() === '' ? null : Number(o.price);
        return {
          location_id: l.id,
          pooja_id: poojaId,
          price: n !== null && !Number.isNaN(n) && n >= 0 ? n : null,
          is_available: o.selected,
        };
      });
    if (!rows.length) return;
    const { error } = await supabase.from('location_poojas').upsert(rows, { onConflict: 'location_id,pooja_id' });
    if (error) throw error;
  };

  const selectedCount = locations.filter((l) => offerings[l.id]?.selected).length;

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
                            <div className="space-y-3 rounded-xl border border-saffron-200 bg-saffron-50/50 p-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.is_festive_special}
                    onChange={(e) => setForm({ ...form, is_festive_special: e.target.checked })}
                    className="h-4 w-4 rounded"
                  />
                  <span className="text-sm font-medium text-temple-900">Festive special</span>
                </label>
                {form.is_festive_special && (
                  <>
                    <div>
                      <label className="label">Festival name</label>
                      <input
                        type="text"
                        value={form.festive_name}
                        onChange={(e) => setForm({ ...form, festive_name: e.target.value })}
                        className="input"
                        placeholder="e.g. Diwali Special"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label">Show from (optional)</label>
                        <input
                          type="date"
                          value={form.festive_start}
                          onChange={(e) => setForm({ ...form, festive_start: e.target.value })}
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="label">Show until (optional)</label>
                        <input
                          type="date"
                          value={form.festive_end}
                          onChange={(e) => setForm({ ...form, festive_end: e.target.value })}
                          className="input"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-temple-500">Leave both dates empty to keep it a special until you switch it off.</p>
                  </>
                )}
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
                            <div>
                <div className="flex items-center justify-between">
                  <label className="label">Locations &amp; prices</label>
                  <span className="text-xs text-temple-400">{selectedCount} selected</span>
                </div>
                {!offeringsReady ? (
                  <p className="text-sm text-temple-400">Loading locations...</p>
                ) : (
                  <>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <button type="button" onClick={() => selectAllLocations(true)} className="btn-secondary px-3 py-1.5 text-xs">Select all</button>
                      <button type="button" onClick={() => selectAllLocations(false)} className="btn-secondary px-3 py-1.5 text-xs">Clear</button>
                      <div className="ml-auto flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          value={bulkPrice}
                          onChange={(e) => setBulkPrice(e.target.value)}
                          placeholder="Same price (₹)"
                          className="input w-36 py-1.5 text-sm"
                        />
                        <button type="button" onClick={applyBulkPrice} disabled={!bulkPrice} className="btn-primary px-3 py-1.5 text-xs">
                          Apply to selected
                        </button>
                      </div>
                    </div>
                    <div className="max-h-72 space-y-1 overflow-y-auto rounded-lg border border-temple-100 p-2">
                      {locations.map((l) => {
                        const o = offerings[l.id];
                        const on = !!o?.selected;
                        return (
                          <div key={l.id} className={`flex items-center gap-3 rounded-lg px-2 py-1.5 ${on ? 'bg-saffron-50' : ''}`}>
                            <input type="checkbox" checked={on} onChange={() => toggleLocation(l.id)} className="h-4 w-4 rounded" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-temple-900">{l.name}</p>
                              <p className="truncate text-xs text-temple-400">{l.state?.name}</p>
                            </div>
                            <input
                              type="number"
                              min="0"
                              value={o?.price ?? ''}
                              onChange={(e) => setLocationPrice(l.id, e.target.value)}
                              disabled={!on}
                              placeholder="Price ₹"
                              className="input w-28 py-1.5 text-sm disabled:opacity-40"
                            />
                          </div>
                        );
                      })}
                    </div>
                    <p className="mt-2 text-xs text-temple-400">Leave a price empty to show &ldquo;To Be Confirmed&rdquo; on the website.</p>
                  </>
                )}
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
