import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Trash2, Calendar, Shield, User, CreditCard } from 'lucide-react';
import type { SavedPsiraOfficer } from '@/api/services/psiraApi';

interface PsiraCardProps {
  officer: SavedPsiraOfficer;
  onDelete: (id: string)=> void;
  isDeleting?: boolean;
}

export function PsiraCard({ officer, onDelete, isDeleting }: PsiraCardProps): React.JSX.Element {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleConfirmDelete = (): void => {
    onDelete(officer.id);
    setConfirmOpen(false);
  };

  const { isExpired, isExpiringSoon } = useMemo(() => {
    const now = new Date();
    const expiryDate = new Date(officer.expiry_date);
    if (isNaN(expiryDate.getTime())) {
      return { isExpired: false, isExpiringSoon: false };
    }
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const expired = expiryDate < now;
    return {
      isExpired: expired,
      isExpiringSoon: !expired && expiryDate < thirtyDaysFromNow,
    };
  }, [officer.expiry_date]);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-base font-medium">
              {officer.first_name} {officer.last_name}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setConfirmOpen(true)}
            disabled={isDeleting}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <CreditCard className="h-3 w-3" />
                ID Number
              </span>
              <span className="font-mono">{officer.id_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <User className="h-3 w-3" />
                Gender
              </span>
              <span>{officer.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">SIRA No.</span>
              <span className="font-mono">{officer.sira_no}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                officer.request_status === 'Registered'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}>
                {officer.request_status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Expires
              </span>
              <span className={
                isExpired
                  ? 'text-destructive font-medium'
                  : isExpiringSoon
                    ? 'text-orange-500 font-medium'
                    : ''
              }>
                {formatDate(officer.expiry_date)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete PSIRA Record"
        description={`Are you sure you want to delete the record for ${officer.first_name} ${officer.last_name}? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
    </>
  );
}
