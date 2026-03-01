import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { updatePermission } from '@/api/services/adminApi';
import type { UpdatePermissionRequest, IPermission } from '@/types/admin';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface EditPermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean)=> void;
  onSuccess: (permission: IPermission)=> void;
  permission: IPermission;
}

export function EditPermissionDialog({ open, onOpenChange, onSuccess, permission }: EditPermissionDialogProps): React.JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdatePermissionRequest>({
    permission_name: permission.permission_name,
    psira_access: permission.psira_access,
    firearm_access: permission.firearm_access,
    vehicle_access: permission.vehicle_access,
    certificate_access: permission.certificate_access,
    drivers_access: permission.drivers_access,
  });

  useEffect(() => {
    if (permission) {
      setFormData({
        permission_name: permission.permission_name,
        psira_access: permission.psira_access,
        firearm_access: permission.firearm_access,
        vehicle_access: permission.vehicle_access,
        certificate_access: permission.certificate_access,
        drivers_access: permission.drivers_access,
      });
      setError(null);
    }
  }, [permission]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);

    const trimmedName = formData.permission_name?.trim();
    if (!trimmedName) {
      setError('Permission name is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedPermission = await updatePermission(permission.id, {
        ...formData,
        permission_name: trimmedName,
      });
      onSuccess(updatedPermission);
      onOpenChange(false);
      toast.success('Permission updated successfully');
    } catch (err) {
      const message = err instanceof AxiosError
        ? err.response?.data?.error?.message ?? err.message
        : err instanceof Error ? err.message : 'Failed to update permission';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData((prev) => ({ ...prev, permission_name: e.target.value }));
  };

  const handleCheckboxChange = (field: keyof Omit<UpdatePermissionRequest, 'name'>) => (checked: boolean): void => {
    setFormData((prev) => ({ ...prev, [field]: checked }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Permission</DialogTitle>
          <DialogDescription>
            Update permission details and access controls.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)}>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="name">Permission Name</Label>
              <Input
                id="name"
                placeholder="e.g. Basic User, Premium User"
                value={formData.permission_name ?? ''}
                onChange={handleNameChange}
                required
              />
            </div>
            <div className="space-y-3">
              <Label>Access Controls</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="psira_access"
                    checked={formData.psira_access ?? false}
                    onCheckedChange={handleCheckboxChange('psira_access')}
                  />
                  <label
                    htmlFor="psira_access"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    PSIRA Access
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="firearm_access"
                    checked={formData.firearm_access ?? false}
                    onCheckedChange={handleCheckboxChange('firearm_access')}
                  />
                  <label
                    htmlFor="firearm_access"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Firearm Access
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="vehicle_access"
                    checked={formData.vehicle_access ?? false}
                    onCheckedChange={handleCheckboxChange('vehicle_access')}
                  />
                  <label
                    htmlFor="vehicle_access"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Vehicle Access
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="certificate_access"
                    checked={formData.certificate_access ?? false}
                    onCheckedChange={handleCheckboxChange('certificate_access')}
                  />
                  <label
                    htmlFor="certificate_access"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Certificate Access
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="drivers_access"
                    checked={formData.drivers_access ?? false}
                    onCheckedChange={handleCheckboxChange('drivers_access')}
                  />
                  <label
                    htmlFor="drivers_access"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Drivers Access
                  </label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Permission'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
