export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return 'To Be Confirmed';
  return `₹${price.toLocaleString('en-IN')}`;
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'amber';
    case 'CONFIRMED':
      return 'green';
    case 'COMPLETED':
      return 'blue';
    case 'CANCELLED':
      return 'red';
    default:
      return 'gray';
  }
}

export function getStatusBgClass(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'CONFIRMED':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'COMPLETED':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function getStatusDotClass(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'bg-amber-500';
    case 'CONFIRMED':
      return 'bg-green-500';
    case 'COMPLETED':
      return 'bg-blue-500';
    case 'CANCELLED':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}
