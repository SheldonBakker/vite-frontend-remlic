import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EditPermissionDialog } from '@/components/admin/EditPermissionDialog';
import { Trash2, Pencil, Check, X } from 'lucide-react';
import type { IPermission } from '@/types/admin';

interface PermissionCardProps {
  permission: IPermission;
  onDelete: (id: string)=> void;
  onEdit: (permission: IPermission)=> void;
  isDeleting?: boolean;
}

export function PermissionCard({ permission, onDelete, onEdit, isDeleting }: PermissionCardProps): React.JSX.Element {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleConfirmDelete = (): void => {
    onDelete(permission.id);
    setConfirmOpen(false);
  };

  const handleEditSuccess = (updatedPermission: IPermission): void => {
    onEdit(updatedPermission);
    setEditOpen(false);
  };

  const accessItems = [
    { label: 'PSIRA Access', value: permission.psira_access },
    { label: 'Firearm Access', value: permission.firearm_access },
    { label: 'Vehicle Access', value: permission.vehicle_access },
    { label: 'Certificate Access', value: permission.certificate_access },
    { label: 'Drivers Access', value: permission.drivers_access },
  ];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">
            {permission.permission_name}
          </CardTitle>
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
            {accessItems.map((item) => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="flex items-center">
                  {item.value ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground" />
                  )}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Permission"
        description={`Are you sure you want to delete "${permission.permission_name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
      <EditPermissionDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={handleEditSuccess}
        permission={permission}
      />
    </>
  );
}
