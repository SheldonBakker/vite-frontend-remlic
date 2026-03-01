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
import { updateSubscription, getPackages } from '@/api/services/adminApi';
import type { UpdateSubscriptionRequest, ISubscription, IPackage, SubscriptionStatus } from '@/types/admin';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface EditSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean)=> void;
  onSuccess: (subscription: ISubscription)=> void;
  subscription: ISubscription;
}

export function EditSubscriptionDialog({ open, onOpenChange, onSuccess, subscription }: EditSubscriptionDialogProps): React.JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [formData, setFormData] = useState<UpdateSubscriptionRequest>({
    profile_id: subscription.profile_id,
    package_id: subscription.package_id,
    start_date: subscription.start_date,
    end_date: subscription.end_date,
    status: subscription.status,
  });

  useEffect(() => {
    if (open) {
      const fetchPackages = async (): Promise<void> => {
        setLoadingPackages(true);
        try {
          const response = await getPackages({ limit: 100 });
          setPackages(response.data.packages);
        } catch (err) {
          const message = err instanceof AxiosError
            ? err.response?.data?.error?.message ?? err.message
            : 'Failed to load packages';
          toast.error(message);
        } finally {
          setLoadingPackages(false);
        }
      };
      void fetchPackages();
    }
  }, [open]);

  useEffect(() => {
    if (subscription) {
      setFormData({
        profile_id: subscription.profile_id,
        package_id: subscription.package_id,
        start_date: subscription.start_date,
        end_date: subscription.end_date,
        status: subscription.status,
      });
      setError(null);
    }
  }, [subscription]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);

    const trimmedProfileId = formData.profile_id?.trim();

    if (!trimmedProfileId) {
      setError('Profile ID is required');
      return;
    }

    if (!formData.package_id) {
      setError('Please select a package');
      return;
    }

    if (!formData.start_date) {
      setError('Start date is required');
      return;
    }

    if (!formData.end_date) {
      setError('End date is required');
      return;
    }

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);

    if (endDate < startDate) {
      setError('End date must be on or after start date');
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedSubscription = await updateSubscription(subscription.id, {
        ...formData,
        profile_id: trimmedProfileId,
      });
      onSuccess(updatedSubscription);
      onOpenChange(false);
      toast.success('Subscription updated successfully');
    } catch (err) {
      const message = err instanceof AxiosError
        ? err.response?.data?.error?.message ?? err.message
        : err instanceof Error ? err.message : 'Failed to update subscription';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof UpdateSubscriptionRequest) => (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePackageChange = (value: string): void => {
    setFormData((prev) => ({ ...prev, package_id: value }));
  };

  const handleStatusChange = (value: SubscriptionStatus): void => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Subscription</DialogTitle>
          <DialogDescription>
            Update subscription details and status.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)}>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="profile_id">Profile ID</Label>
              <Input
                id="profile_id"
                placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
                value={formData.profile_id ?? ''}
                onChange={handleChange('profile_id')}
                required
              />
              <span className="text-xs text-muted-foreground">
                User's UUID from the profiles table
              </span>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="package">Package</Label>
              <Select value={formData.package_id} onValueChange={handlePackageChange} disabled={loadingPackages}>
                <SelectTrigger id="package">
                  <SelectValue placeholder={loadingPackages ? 'Loading packages...' : 'Select package'} />
                </SelectTrigger>
                <SelectContent>
                  {packages.map((pkg) => (
                    <SelectItem key={pkg.id} value={pkg.id}>
                      {pkg.package_name} ({pkg.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={handleStatusChange}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date ?? ''}
                onChange={handleChange('start_date')}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date ?? ''}
                onChange={handleChange('end_date')}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || loadingPackages}>
              {isSubmitting ? 'Updating...' : 'Update Subscription'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
