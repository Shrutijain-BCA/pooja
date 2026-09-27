import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = 'Something went wrong', onRetry }: ErrorStateProps) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-16 h-16 mx-auto rounded-full bg-maroon-50 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-maroon-500" />
      </div>
      <h3 className="text-lg font-semibold text-temple-900 mb-2">Oops!</h3>
      <p className="text-temple-500 max-w-md mx-auto mb-6">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          Try Again
        </button>
      )}
    </div>
  );
}
