import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-6 h-6 text-saffron-600 animate-spin" style={{ width: size, height: size }} />
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-10 h-10 text-saffron-600 animate-spin mx-auto" />
        <p className="mt-4 text-temple-500">Loading...</p>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="h-48 bg-temple-100" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-temple-100 rounded w-3/4" />
        <div className="h-4 bg-temple-100 rounded w-1/2" />
        <div className="h-4 bg-temple-100 rounded w-full" />
        <div className="h-4 bg-temple-100 rounded w-2/3" />
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
