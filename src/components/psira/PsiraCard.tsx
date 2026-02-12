import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Trash2, Calendar, Shield, User, CreditCard } from 'lucide-react';
import type { SavedPsiraOfficer } from '@/api/services/psiraApi';
import { getExpiryBadgeProps } from '@/lib/utils';

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

  const expiryStatus = getExpiryBadgeProps(officer.expiry_date);

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
              <span className="text-muted-foreground">Registration</span>
              <Badge variant={officer.request_status === 'Registered' ? 'default' : 'secondary'}>
                {officer.request_status}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Expires
              </span>
              <span>{formatDate(officer.expiry_date)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={expiryStatus.variant}>{expiryStatus.label}</Badge>
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
