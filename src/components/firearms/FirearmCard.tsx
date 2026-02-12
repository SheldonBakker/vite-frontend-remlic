import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EditFirearmDialog } from '@/components/firearms/EditFirearmDialog';
import { Trash2, Calendar, Pencil } from 'lucide-react';
import type { Firearm } from '@/api/services/firearmsApi';
import { getExpiryBadgeProps } from '@/lib/utils';

import pistolSvg from '@/assets/svgs/pistol.svg';
import revolverSvg from '@/assets/svgs/revolver.svg';
import rifleSvg from '@/assets/svgs/rifle.svg';
import shotgunSvg from '@/assets/svgs/shotgun.svg';
import carbineSvg from '@/assets/svgs/carbine.svg';

const firearmTypeIcons: Record<string, string> = {
  Pistol: pistolSvg,
  Revolver: revolverSvg,
  Rifle: rifleSvg,
  Shotgun: shotgunSvg,
  Carbine: carbineSvg,
};

interface FirearmCardProps {
  firearm: Firearm;
  onDelete: (id: string)=> void;
  onEdit: (firearm: Firearm)=> void;
  isDeleting?: boolean;
}

export function FirearmCard({ firearm, onDelete, onEdit, isDeleting }: FirearmCardProps): React.JSX.Element {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleConfirmDelete = (): void => {
    onDelete(firearm.id);
    setConfirmOpen(false);
  };

  const handleEditSuccess = (updatedFirearm: Firearm): void => {
    onEdit(updatedFirearm);
    setEditOpen(false);
  };

  const expiryStatus = getExpiryBadgeProps(firearm.expiry_date);
  const iconSrc = firearmTypeIcons[firearm.type];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            {iconSrc && (
              <img
                src={iconSrc}
                alt={firearm.type}
                className="h-8 w-8 object-contain dark:invert"
              />
            )}
            <CardTitle className="text-base font-medium">
              {firearm.make} {firearm.model}
            </CardTitle>
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
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <span>{firearm.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Caliber</span>
              <span>{firearm.caliber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Serial No.</span>
              <span className="font-mono text-xs">{firearm.serial_number}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Expires
              </span>
              <span>{formatDate(firearm.expiry_date)}</span>
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
        title="Delete Firearm"
        description={`Are you sure you want to delete ${firearm.make} ${firearm.model}? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
      <EditFirearmDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={handleEditSuccess}
        firearm={firearm}
      />
    </>
  );
}
