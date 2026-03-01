import { useState } from 'react';
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
import { createFirearm, type CreateFirearmRequest, type Firearm } from '@/api/services/firearmsApi';
import { FIREARM_TYPES } from '@/constants/firearms';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface AddFirearmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean)=> void;
  onSuccess: (firearm: Firearm)=> void;
}

export function AddFirearmDialog({ open, onOpenChange, onSuccess }: AddFirearmDialogProps): React.JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateFirearmRequest>({
    type: '',
    make: '',
    model: '',
    caliber: '',
    serial_number: '',
    expiry_date: '',
  });

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);

    if (!formData.type) {
      setError('Please select a firearm type');
      return;
    }

    setIsSubmitting(true);

    try {
      const capitalizedData = {
        ...formData,
        make: formData.make.toUpperCase(),
        model: formData.model.toUpperCase(),
        caliber: formData.caliber.toUpperCase(),
        serial_number: formData.serial_number.toUpperCase(),
      };
      const firearm = await createFirearm(capitalizedData);
      onSuccess(firearm);
      onOpenChange(false);
      setFormData({
        type: '',
        make: '',
        model: '',
        caliber: '',
        serial_number: '',
        expiry_date: '',
      });
      toast.success('Firearm added successfully');
    } catch (err) {
      const message = err instanceof AxiosError
        ? err.response?.data?.error?.message ?? err.message
        : err instanceof Error ? err.message : 'Failed to add firearm';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof CreateFirearmRequest) => (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleTypeChange = (value: string): void => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Firearm</DialogTitle>
          <DialogDescription>
            Enter the details of your firearm license.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)}>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger id="type">
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
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                placeholder="e.g. Glock, Smith & Wesson"
                value={formData.make}
                onChange={handleChange('make')}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                placeholder="e.g. G19, M&P Shield"
                value={formData.model}
                onChange={handleChange('model')}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="caliber">Caliber</Label>
              <Input
                id="caliber"
                placeholder="e.g. 9mm, .45 ACP"
                value={formData.caliber}
                onChange={handleChange('caliber')}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="serial_number">Serial Number</Label>
              <Input
                id="serial_number"
                placeholder="e.g. ABC123456"
                value={formData.serial_number}
                onChange={handleChange('serial_number')}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expiry_date">License Expiry Date</Label>
              <Input
                id="expiry_date"
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
              {isSubmitting ? 'Adding...' : 'Add Firearm'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
