import { useState } from 'react';
import type { IDriver } from '@/types/driver';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import EditDriverDialog from './EditDriverDialog';
import { Trash2, Pencil } from 'lucide-react';

interface DriverCardProps {
  driver: IDriver;
  onDelete: (id: string)=> void;
  onEdit: (driver: IDriver)=> void;
  isDeleting?: boolean;
}

export default function DriverCard({ driver, onDelete, onEdit, isDeleting }: DriverCardProps): React.JSX.Element {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleConfirmDelete = (): void => {
    onDelete(driver.id);
    setConfirmOpen(false);
  };

  const handleEditSuccess = (updatedDriver: IDriver): void => {
    onEdit(updatedDriver);
    setEditOpen(false);
  };

  const maskedIdNumber = `${driver.id_number.substring(0, 6)}****${driver.id_number.substring(9)}`;

  const getExpiryStatus = (): { label: string; variant: 'default' | 'destructive' | 'warning' } => {
    const expiryDate = new Date(driver.expiry_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return { label: 'Expired', variant: 'destructive' };
    } else if (daysUntilExpiry <= 30) {
      return { label: 'Expiring Soon', variant: 'warning' };
    } else {
      return { label: 'Valid', variant: 'default' };
    }
  };

  const expiryStatus = getExpiryStatus();
  const formattedExpiryDate = new Date(driver.expiry_date).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-base font-medium">
              {driver.surname}, {driver.initials}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{maskedIdNumber}</p>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setEditOpen(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setConfirmOpen(true)}
              disabled={isDeleting}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Expiry Date</span>
              <span>{formattedExpiryDate}</span>
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
        title="Delete Driver Licence"
        description={`Are you sure you want to delete the driver licence for ${driver.surname}, ${driver.initials}? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
      <EditDriverDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={handleEditSuccess}
        driver={driver}
      />
    </>
  );
}
