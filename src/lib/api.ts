import { supabase } from '../lib/supabase';
import type { State, Location, Category, Purpose, Deity, Occasion, Pooja, LocationPooja, Booking } from '../types/database';

// ===== States =====
export async function getStates(): Promise<State[]> {
  const { data, error } = await supabase
    .from('states')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  if (error) throw error;
  return data ?? [];
}

export async function getStateBySlug(slug: string): Promise<State | null> {
  const { data, error } = await supabase
    .from('states')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// ===== Locations =====
export async function getLocations(stateSlug?: string): Promise<Location[]> {
  let query = supabase
    .from('locations')
    .select('*, state:states(*)')
    .eq('is_active', true)
    .order('sort_order');

  if (stateSlug) {
    const state = await getStateBySlug(stateSlug);
    if (state) query = query.eq('state_id', state.id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getLocationBySlug(stateSlug: string, locationSlug: string): Promise<Location | null> {
  const state = await getStateBySlug(stateSlug);
  if (!state) return null;

  const { data, error } = await supabase
    .from('locations')
    .select('*, state:states(*), parent_location:locations(*)')
    .eq('slug', locationSlug)
    .eq('state_id', state.id)
    .eq('is_active', true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getLocationsByState(stateId: string): Promise<Location[]> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('state_id', stateId)
    .eq('is_active', true)
    .order('sort_order');
  if (error) throw error;
  return data ?? [];
}

// ===== Categories =====
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  if (error) throw error;
  return data ?? [];
}

// ===== Purposes =====
export async function getPurposes(): Promise<Purpose[]> {
  const { data, error } = await supabase
    .from('purposes')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  if (error) throw error;
  return data ?? [];
}

// ===== Deities =====
export async function getDeities(): Promise<Deity[]> {
  const { data, error } = await supabase
    .from('deities')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  if (error) throw error;
  return data ?? [];
}

// ===== Occasions =====
export async function getOccasions(): Promise<Occasion[]> {
  const { data, error } = await supabase
    .from('occasions')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  if (error) throw error;
  return data ?? [];
}

// ===== Poojas =====
export async function getPoojas(filters?: {
  categoryId?: string;
  purposeId?: string;
  deityId?: string;
  occasionId?: string;
  stateId?: string;
  locationId?: string;
  search?: string;
}): Promise<Pooja[]> {
  let query = supabase
    .from('poojas')
    .select(`
      *,
      categories:pooja_categories(category:categories(*)),
      purposes:pooja_purposes(purpose:purposes(*)),
      deities:pooja_deities(deity:deities(*)),
      occasions:pooja_occasions(occasion:occasions(*))
    `)
    .eq('is_active', true)
    .order('name');

  const { data, error } = await query;
  if (error) throw error;

  let poojas = data ?? [];

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    poojas = poojas.filter((p: any) =>
      p.name.toLowerCase().includes(search) ||
      p.description?.toLowerCase().includes(search)
    );
  }

  if (filters?.categoryId) {
    poojas = poojas.filter((p: any) =>
      p.categories?.some((c: any) => c.category?.id === filters.categoryId)
    );
  }

  if (filters?.purposeId) {
    poojas = poojas.filter((p: any) =>
      p.purposes?.some((pu: any) => pu.purpose?.id === filters.purposeId)
    );
  }

  if (filters?.deityId) {
    poojas = poojas.filter((p: any) =>
      p.deities?.some((d: any) => d.deity?.id === filters.deityId)
    );
  }

  if (filters?.occasionId) {
    poojas = poojas.filter((p: any) =>
      p.occasions?.some((o: any) => o.occasion?.id === filters.occasionId)
    );
  }

  return poojas as unknown as Pooja[];
}

export async function getPoojaBySlug(slug: string): Promise<Pooja | null> {
  const { data, error } = await supabase
    .from('poojas')
    .select(`
      *,
      categories:pooja_categories(category:categories(*)),
      purposes:pooja_purposes(purpose:purposes(*)),
      deities:pooja_deities(deity:deities(*)),
      occasions:pooja_occasions(occasion:occasions(*))
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as Pooja;
}

// ===== Location Poojas (Offerings) =====
export async function getAllActiveOfferings(): Promise<{ pooja_id: string; location_id: string; price: number | null }[]> {
  const { data, error } = await supabase
    .from('location_poojas')
    .select('pooja_id, location_id, price')
    .eq('is_available', true);
  if (error) throw error;
  return data ?? [];
}

export async function getOfferingsByPooja(poojaId: string): Promise<LocationPooja[]> {
  const { data, error } = await supabase
    .from('location_poojas')
    .select('*, location:locations(*, state:states(*)), pooja:poojas(*)')
    .eq('pooja_id', poojaId)
    .eq('is_available', true);
  if (error) throw error;
  return (data ?? []).filter((o: any) => o.location?.is_active === true);
}

export async function getOfferingsByLocation(locationId: string): Promise<LocationPooja[]> {
  const { data, error } = await supabase
    .from('location_poojas')
    .select('*, pooja:poojas(*), location:locations(*)')
    .eq('location_id', locationId)
    .eq('is_available', true);
  if (error) throw error;
  return (data ?? []).filter((o: any) => o.pooja?.is_active === true);
}

export async function getOfferingByPoojaAndLocation(poojaId: string, locationId: string): Promise<LocationPooja | null> {
  const { data, error } = await supabase
    .from('location_poojas')
    .select('*')
    .eq('pooja_id', poojaId)
    .eq('location_id', locationId)
    .eq('is_available', true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// ===== Bookings =====
export async function createBooking(booking: {
  user_id: string;
  pooja_id: string;
  location_id: string;
  offering_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  preferred_date: string;
  preferred_time: string;
  number_of_devotees: number;
  amount: number | null;
  customer_notes: string;
}): Promise<{ data: Booking | null; error: string | null }> {
  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select('*')
    .single();
  if (error) return { data: null, error: error.message };
  return { data: data as unknown as Booking, error: null };
}

export async function getMyBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, pooja:poojas(*), location:locations(*, state:states(*)), offering:location_poojas(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as unknown as Booking[] ?? [];
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, pooja:poojas(*), location:locations(*, state:states(*)), offering:location_poojas(*)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as Booking;
}

export async function getBookingByNumberAndPhone(
  bookingNumber: string,
  phone: string
): Promise<Booking | null> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, pooja:poojas(*), location:locations(*, state:states(*))')
    .eq('booking_number', bookingNumber.toUpperCase())
    .eq('customer_phone', phone)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as Booking;
}

// ===== Notifications =====
export async function getNotifications() {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return data ?? [];
}

export async function markNotificationRead(id: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id);
  if (error) throw error;
}

// ===== Admin APIs =====
export async function getAllBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, pooja:poojas(*), location:locations(*, state:states(*))')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as unknown as Booking[]) ?? [];
}

export async function updateBookingStatus(
  id: string,
  status: string,
  extra?: { admin_notes?: string; cancellation_reason?: string }
): Promise<{ error: string | null }> {
  const updates: Record<string, any> = { status };
  if (extra?.admin_notes !== undefined) updates.admin_notes = extra.admin_notes;
  if (extra?.cancellation_reason !== undefined) updates.cancellation_reason = extra.cancellation_reason;

  const { error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', id);
  if (error) return { error: error.message };
  return { error: null };
}

export async function getAllPoojasAdmin(): Promise<Pooja[]> {
  const { data, error } = await supabase
    .from('poojas')
    .select(`
      *,
      categories:pooja_categories(category:categories(*)),
      purposes:pooja_purposes(purpose:purposes(*)),
      deities:pooja_deities(deity:deities(*)),
      occasions:pooja_occasions(occasion:occasions(*))
    `)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as unknown as Pooja[]) ?? [];
}

export async function getAllLocationsAdmin(): Promise<Location[]> {
  const { data, error } = await supabase
    .from('locations')
    .select('*, state:states(*), parent_location:locations(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getAllStatesAdmin(): Promise<State[]> {
  const { data, error } = await supabase
    .from('states')
    .select('*')
    .order('sort_order');
  if (error) throw error;
  return data ?? [];
}

export async function getAllOfferingsAdmin(): Promise<LocationPooja[]> {
  const { data, error } = await supabase
    .from('location_poojas')
    .select('*, location:locations(*, state:states(*)), pooja:poojas(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getAllUsersAdmin() {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
