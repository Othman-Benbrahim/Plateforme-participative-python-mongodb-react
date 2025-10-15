import { MessageCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const statusConfig = {
  discussion: {
    label: 'En discussion',
    icon: MessageCircle,
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  },
  approved: {
    label: 'Approuvée',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  },
  rejected: {
    label: 'Rejetée',
    icon: XCircle,
    className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  },
  in_progress: {
    label: 'En cours',
    icon: Clock,
    className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  }
};

export function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.discussion;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={config.className}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
}
