import { useState } from 'react';
import { toast } from 'sonner';
import type { IDriver } from '@/types/driver';
import { updateDriver } from '@/api/services/driverApi';
import { driverFormSchema, type DriverFormData } from './driverValidation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AxiosError } from 'axios';

interface EditDriverDialogProps {
  driver: IDriver;
  open: boolean;
  onOpenChange: (open: boolean)=> void;
  onSuccess: (driver: IDriver)=> void;
}

export default function EditDriverDialog({ driver, open, onOpenChange, onSuccess }: EditDriverDialogProps): React.JSX.Element {
  const [formData, setFormData] = useState<DriverFormData>(() => ({
    surname: driver.surname,
    initials: driver.initials,
    id_number: driver.id_number,
    expiry_date: driver.expiry_date.split('T')[0], // Convert to YYYY-MM-DD
  }));
  const [errors, setErrors] = useState<Partial<Record<keyof DriverFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setErrors({});

    const result = driverFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof DriverFormData, string>> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof DriverFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    const transformedData = {
      surname: result.data.surname.toUpperCase(),
      initials: result.data.initials.toUpperCase(),
      id_number: result.data.id_number,
      expiry_date: result.data.expiry_date,
    };

    setIsSubmitting(true);

    try {
      const updatedDriver = await updateDriver(driver.id, transformedData);
      onSuccess(updatedDriver);
      onOpenChange(false);
      toast.success('Driver licence updated successfully');
    } catch (err) {
      const message = err instanceof AxiosError
        ? err.response?.data?.error?.message ?? err.message
        : err instanceof Error ? err.message : 'Failed to update driver licence';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog key={driver.id} open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Edit Driver Licence</DialogTitle>
          <DialogDescription>
            Update the driver licence details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-surname">Surname *</Label>
            <Input
              id="edit-surname"
              value={formData.surname}
              onChange={(e) => {
                setFormData({ ...formData, surname: e.target.value }); 
              }}
              placeholder="SMITH"
            />
            {errors.surname && <p className="text-sm text-destructive">{errors.surname}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-initials">Initials *</Label>
            <Input
              id="edit-initials"
              value={formData.initials}
              onChange={(e) => {
                setFormData({ ...formData, initials: e.target.value }); 
              }}
              placeholder="J.D."
              maxLength={10}
            />
            {errors.initials && <p className="text-sm text-destructive">{errors.initials}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-id_number">ID Number *</Label>
            <Input
              id="edit-id_number"
              value={formData.id_number}
              onChange={(e) => {
                setFormData({ ...formData, id_number: e.target.value }); 
              }}
              placeholder="8503151234567"
              maxLength={13}
            />
            {errors.id_number && <p className="text-sm text-destructive">{errors.id_number}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-expiry_date">Expiry Date *</Label>
            <Input
              id="edit-expiry_date"
              type="date"
              value={formData.expiry_date}
              onChange={(e) => {
                setFormData({ ...formData, expiry_date: e.target.value }); 
              }}
            />
            {errors.expiry_date && <p className="text-sm text-destructive">{errors.expiry_date}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false); 
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Driver'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
