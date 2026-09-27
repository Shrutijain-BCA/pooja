export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email: string;
  profile_image: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface State {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  name: string;
  slug: string;
  state_id: string;
  parent_location_id: string | null;
  type: string;
  description: string;
  significance: string;
  image: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  state?: State;
  parent_location?: Location | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  sort_order: number;
}

export interface Purpose {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  is_active: boolean;
  sort_order: number;
}

export interface Deity {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  sort_order: number;
}

export interface Occasion {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  sort_order: number;
}

export interface Pooja {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description: string;
  image: string;
  duration: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  categories?: Category[];
  purposes?: Purpose[];
  deities?: Deity[];
  occasions?: Occasion[];
  offerings?: LocationPooja[];
}

export interface LocationPooja {
  id: string;
  location_id: string;
  pooja_id: string;
  price: number | null;
  duration: string;
  description: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  location?: Location;
  pooja?: Pooja;
}

export interface Booking {
  id: string;
  booking_number: string;
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
  admin_notes: string;
  cancellation_reason: string;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
  pooja?: Pooja;
  location?: Location;
  offering?: LocationPooja;
}

export interface Notification {
  id: string;
  user_id: string;
  booking_id: string | null;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
