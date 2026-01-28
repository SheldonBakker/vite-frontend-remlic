import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { updatePackage, getPermissions } from '@/api/services/adminApi';
import type { UpdatePackageRequest, IPackage, IPermission } from '@/types/admin';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface EditPackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean)=> void;
  onSuccess: (pkg: IPackage)=> void;
  package: IPackage;
}

export function EditPackageDialog({ open, onOpenChange, onSuccess, package: pkg }: EditPackageDialogProps): React.JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [formData, setFormData] = useState<UpdatePackageRequest>({
    package_name: pkg.package_name,
    slug: pkg.slug,
    type: pkg.type,
    permission_id: pkg.permission_id,
    description: pkg.description,
    is_active: pkg.is_active,
  });

  useEffect(() => {
    if (open) {
      const fetchPermissions = async (): Promise<void> => {
        setLoadingPermissions(true);
        try {
          const response = await getPermissions({ limit: 100 });
          setPermissions(response.data.permissions);
        } catch (err) {
          const message = err instanceof AxiosError
            ? err.response?.data?.error ?? err.message
            : 'Failed to load permissions';
          toast.error(message);
        } finally {
          setLoadingPermissions(false);
        }
      };
      void fetchPermissions();
    }
  }, [open]);

  useEffect(() => {
    if (pkg) {
      setFormData({
        package_name: pkg.package_name,
        slug: pkg.slug,
        type: pkg.type,
        permission_id: pkg.permission_id,
        description: pkg.description,
        is_active: pkg.is_active,
      });
      setError(null);
    }
  }, [pkg]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);

    const trimmedName = formData.package_name?.trim();
    const trimmedSlug = formData.slug?.trim();

    if (!trimmedName) {
      setError('Package name is required');
      return;
    }

    if (!trimmedSlug) {
      setError('Slug is required');
      return;
    }

    if (!/^[a-z0-9-]+$/.test(trimmedSlug)) {
      setError('Slug can only contain lowercase letters, numbers, and hyphens');
      return;
    }

    if (!formData.permission_id) {
      setError('Please select a permission');
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedPackage = await updatePackage(pkg.id, {
        ...formData,
        package_name: trimmedName,
        slug: trimmedSlug,
        description: formData.description?.trim() ?? null,
      });
      onSuccess(updatedPackage);
      onOpenChange(false);
      toast.success('Package updated successfully');
    } catch (err) {
      const message = err instanceof AxiosError
        ? err.response?.data?.error ?? err.message
        : err instanceof Error ? err.message : 'Failed to update package';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof UpdatePackageRequest) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleTypeChange = (value: 'monthly' | 'yearly'): void => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handlePermissionChange = (value: string): void => {
    setFormData((prev) => ({ ...prev, permission_id: value }));
  };

  const handleIsActiveChange = (checked: boolean): void => {
    setFormData((prev) => ({ ...prev, is_active: checked }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Package</DialogTitle>
          <DialogDescription>
            Update package details, permissions, and status.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)}>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="package_name">Package Name</Label>
              <Input
                id="package_name"
                placeholder="e.g. Basic Plan, Premium Plan"
                value={formData.package_name ?? ''}
                onChange={handleChange('package_name')}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                placeholder="e.g. basic-plan, premium-plan"
                value={formData.slug ?? ''}
                onChange={handleChange('slug')}
                pattern="^[a-z0-9-]+$"
                title="Only lowercase letters, numbers, and hyphens allowed"
                required
              />
              <span className="text-xs text-muted-foreground">
                Only lowercase letters, numbers, and hyphens
              </span>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select package type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="permission">Permission</Label>
              <Select value={formData.permission_id} onValueChange={handlePermissionChange} disabled={loadingPermissions}>
                <SelectTrigger id="permission">
                  <SelectValue placeholder={loadingPermissions ? 'Loading permissions...' : 'Select permission'} />
                </SelectTrigger>
                <SelectContent>
                  {permissions.map((permission) => (
                    <SelectItem key={permission.id} value={permission.id}>
                      {permission.permission_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Brief description of what this package includes"
                value={formData.description ?? ''}
                onChange={handleChange('description')}
                maxLength={500}
                rows={3}
              />
              <span className="text-xs text-muted-foreground">
                {formData.description?.length ?? 0}/500 characters
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active ?? false}
                onCheckedChange={handleIsActiveChange}
              />
              <label
                htmlFor="is_active"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Package is active
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || loadingPermissions}>
              {isSubmitting ? 'Updating...' : 'Update Package'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
