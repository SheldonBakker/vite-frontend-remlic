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
import { createPackage, getPermissions } from '@/api/services/adminApi';
import type { CreatePackageRequest, IPackage, IPermission } from '@/types/admin';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface AddPackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean)=> void;
  onSuccess: (pkg: IPackage)=> void;
}

export function AddPackageDialog({ open, onOpenChange, onSuccess }: AddPackageDialogProps): React.JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [formData, setFormData] = useState<CreatePackageRequest>({
    package_name: '',
    slug: '',
    type: 'monthly',
    permission_id: '',
    description: '',
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

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);

    const trimmedName = formData.package_name.trim();
    const trimmedSlug = formData.slug.trim();

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
      const pkg = await createPackage({
        ...formData,
        package_name: trimmedName,
        slug: trimmedSlug,
        description: formData.description?.trim() ?? null,
      });
      onSuccess(pkg);
      onOpenChange(false);
      setFormData({
        package_name: '',
        slug: '',
        type: 'monthly',
        permission_id: '',
        description: '',
      });
      toast.success('Package created successfully');
    } catch (err) {
      const message = err instanceof AxiosError
        ? err.response?.data?.error ?? err.message
        : err instanceof Error ? err.message : 'Failed to create package';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof CreatePackageRequest) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleTypeChange = (value: 'monthly' | 'yearly'): void => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handlePermissionChange = (value: string): void => {
    setFormData((prev) => ({ ...prev, permission_id: value }));
  };

  const autoGenerateSlug = (): void => {
    const slug = formData.package_name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    setFormData((prev) => ({ ...prev, slug }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Package</DialogTitle>
          <DialogDescription>
            Create a new subscription package with pricing and permissions.
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
                value={formData.package_name}
                onChange={handleChange('package_name')}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="slug">Slug</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={autoGenerateSlug}
                  className="h-auto py-0 text-xs"
                >
                  Auto-generate
                </Button>
              </div>
              <Input
                id="slug"
                placeholder="e.g. basic-plan, premium-plan"
                value={formData.slug}
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || loadingPermissions}>
              {isSubmitting ? 'Creating...' : 'Create Package'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
