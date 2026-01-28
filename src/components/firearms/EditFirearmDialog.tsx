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
import { updateFirearm, type UpdateFirearmRequest, type Firearm } from '@/api/services/firearmsApi';
import { FIREARM_TYPES } from '@/constants/firearms';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface EditFirearmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean)=> void;
  onSuccess: (firearm: Firearm)=> void;
  firearm: Firearm;
}

export function EditFirearmDialog({ open, onOpenChange, onSuccess, firearm }: EditFirearmDialogProps): React.JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateFirearmRequest>({
    type: firearm.type,
    make: firearm.make,
    model: firearm.model,
    caliber: firearm.caliber,
    serial_number: firearm.serial_number,
    expiry_date: firearm.expiry_date,
  });

  useEffect(() => {
    setFormData({
      type: firearm.type,
      make: firearm.make,
      model: firearm.model,
      caliber: firearm.caliber,
      serial_number: firearm.serial_number,
      expiry_date: firearm.expiry_date,
    });
  }, [firearm]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);

    if (!formData.type) {
      setError('Please select a firearm type');
      return;
    }

    setIsSubmitting(true);

    try {
      const capitalizedData: UpdateFirearmRequest = {
        ...formData,
        make: formData.make?.toUpperCase(),
        model: formData.model?.toUpperCase(),
        caliber: formData.caliber?.toUpperCase(),
        serial_number: formData.serial_number?.toUpperCase(),
      };
      const updatedFirearm = await updateFirearm(firearm.id, capitalizedData);
      onSuccess(updatedFirearm);
      onOpenChange(false);
      toast.success('Firearm updated successfully');
    } catch (err) {
      const message = err instanceof AxiosError
        ? err.response?.data?.error ?? err.message
        : err instanceof Error ? err.message : 'Failed to update firearm';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof UpdateFirearmRequest) => (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleTypeChange = (value: string): void => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Firearm</DialogTitle>
          <DialogDescription>
            Update the details of your firearm license.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)}>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Type</Label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger id="edit-type">
                  <SelectValue placeholder="Select firearm type" />
                </SelectTrigger>
                <SelectContent>
                  {FIREARM_TYPES.map((type: typeof FIREARM_TYPES[number]) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-make">Make</Label>
              <Input
                id="edit-make"
                placeholder="e.g. Glock, Smith & Wesson"
                value={formData.make}
                onChange={handleChange('make')}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-model">Model</Label>
              <Input
                id="edit-model"
                placeholder="e.g. G19, M&P Shield"
                value={formData.model}
                onChange={handleChange('model')}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-caliber">Caliber</Label>
              <Input
                id="edit-caliber"
                placeholder="e.g. 9mm, .45 ACP"
                value={formData.caliber}
                onChange={handleChange('caliber')}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-serial_number">Serial Number</Label>
              <Input
                id="edit-serial_number"
                placeholder="e.g. ABC123456"
                value={formData.serial_number}
                onChange={handleChange('serial_number')}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-expiry_date">License Expiry Date</Label>
              <Input
                id="edit-expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={handleChange('expiry_date')}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
