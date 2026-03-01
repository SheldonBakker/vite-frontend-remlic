import { useState } from 'react';
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
import { createVehicle, type CreateVehicleRequest, type Vehicle } from '@/api/services/vehicleApi';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface AddVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean)=> void;
  onSuccess: (vehicle: Vehicle)=> void;
}

export function AddVehicleDialog({ open, onOpenChange, onSuccess }: AddVehicleDialogProps): React.JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateVehicleRequest>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    vin_number: '',
    registration_number: '',
    expiry_date: '',
  });

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);

    setIsSubmitting(true);

    try {
      const submitData: CreateVehicleRequest = {
        make: formData.make.toUpperCase(),
        model: formData.model.toUpperCase(),
        year: formData.year,
        registration_number: formData.registration_number.toUpperCase(),
        expiry_date: formData.expiry_date,
      };

      if (formData.vin_number && formData.vin_number.trim() !== '') {
        submitData.vin_number = formData.vin_number.toUpperCase();
      }

      const vehicle = await createVehicle(submitData);
      onSuccess(vehicle);
      onOpenChange(false);
      setFormData({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        vin_number: '',
        registration_number: '',
        expiry_date: '',
      });
      toast.success('Vehicle added successfully');
    } catch (err) {
      const message = err instanceof AxiosError
        ? err.response?.data?.error?.message ?? err.message
        : err instanceof Error ? err.message : 'Failed to add vehicle';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof CreateVehicleRequest) => (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = field === 'year' ? parseInt(e.target.value, 10) || 0 : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Vehicle</DialogTitle>
          <DialogDescription>
            Enter the details of your vehicle registration.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)}>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                placeholder="e.g. Toyota, Ford"
                value={formData.make}
                onChange={handleChange('make')}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                placeholder="e.g. Hilux, Ranger"
                value={formData.model}
                onChange={handleChange('model')}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                min="1900"
                max={new Date().getFullYear() + 1}
                value={formData.year}
                onChange={handleChange('year')}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="registration_number">Registration Number</Label>
              <Input
                id="registration_number"
                placeholder="e.g. CA 123-456"
                value={formData.registration_number}
                onChange={handleChange('registration_number')}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vin_number">VIN Number (Optional)</Label>
              <Input
                id="vin_number"
                placeholder="e.g. 1HGBH41JXMN109186"
                value={formData.vin_number}
                onChange={handleChange('vin_number')}
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
              {isSubmitting ? 'Adding...' : 'Add Vehicle'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
