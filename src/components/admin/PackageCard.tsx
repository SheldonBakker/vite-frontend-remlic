import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EditPackageDialog } from '@/components/admin/EditPackageDialog';
import { Trash2, Pencil, Calendar, Shield } from 'lucide-react';
import type { IPackage } from '@/types/admin';

interface PackageCardProps {
  package: IPackage;
  onDelete: (id: string)=> void;
  onEdit: (pkg: IPackage)=> void;
  isDeleting?: boolean;
}

export function PackageCard({ package: pkg, onDelete, onEdit, isDeleting }: PackageCardProps): React.JSX.Element {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleConfirmDelete = (): void => {
    onDelete(pkg.id);
    setConfirmOpen(false);
  };

  const handleEditSuccess = (updatedPackage: IPackage): void => {
    onEdit(updatedPackage);
    setEditOpen(false);
  };

  const capitalize = (str: string | undefined): string => {
    if (!str) {
      return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const truncateDescription = (text: string | null, maxLength: number): string => {
    if (!text) {
      return 'No description';
    }
    if (text.length <= maxLength) {
      return text;
    }
    return `${text.substring(0, maxLength) }...`;
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-medium">
              {pkg.package_name}
            </CardTitle>
            <Badge variant={pkg.is_active ? 'default' : 'secondary'}>
              {pkg.is_active ? 'Active' : 'Inactive'}
            </Badge>
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
              <span className="text-muted-foreground">Slug</span>
              <span className="font-mono text-xs">{pkg.slug}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Type
              </span>
              <span>{capitalize(pkg.type)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Permission
              </span>
              <span className="truncate max-w-37.5">
                {pkg.app_permissions?.permission_name ?? pkg.permission_id}
              </span>
            </div>
            <div className="pt-1">
              <span className="text-muted-foreground text-xs">
                {truncateDescription(pkg.description, 80)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Deactivate Package"
        description={`Are you sure you want to deactivate "${pkg.package_name}"? This will set it to inactive.`}
        confirmLabel="Deactivate"
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
      <EditPackageDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={handleEditSuccess}
        package={pkg}
      />
    </>
  );
}
