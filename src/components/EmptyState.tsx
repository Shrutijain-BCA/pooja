import { type LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-16 h-16 mx-auto rounded-full bg-temple-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-temple-400" />
      </div>
      <h3 className="text-lg font-semibold text-temple-900 mb-2">{title}</h3>
      <p className="text-temple-500 max-w-md mx-auto mb-6">{description}</p>
      {action}
    </div>
  );
}
