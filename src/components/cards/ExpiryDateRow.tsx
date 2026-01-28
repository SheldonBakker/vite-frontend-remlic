import { Calendar } from 'lucide-react';
import { formatDate, getExpiryStatus } from '@/lib/utils';

interface ExpiryDateRowProps {
  expiryDate: string;
  daysThreshold?: number;
}

export function ExpiryDateRow({ expiryDate, daysThreshold = 30 }: ExpiryDateRowProps): React.JSX.Element {
  const { isExpired, isExpiringSoon } = getExpiryStatus(expiryDate, daysThreshold);

  const getStatusClassName = (): string => {
    if (isExpired) {
      return 'text-destructive font-medium';
    }
    if (isExpiringSoon) {
      return 'text-orange-500 font-medium';
    }
    return '';
  };

  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        Expires
      </span>
      <span className={getStatusClassName()}>
        {formatDate(expiryDate)}
      </span>
    </div>
  );
}
