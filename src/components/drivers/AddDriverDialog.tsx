import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createDriver } from '@/api/services/driverApi';
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

interface AddDriverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean)=> void;
}

export default function AddDriverDialog({ open, onOpenChange }: AddDriverDialogProps): React.JSX.Element {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<DriverFormData>({
    surname: '',
    initials: '',
    id_number: '',
    expiry_date: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof DriverFormData, string>>>({});

  const createMutation = useMutation({
    mutationFn: createDriver,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success('Driver licence added successfully');
      onOpenChange(false);
      setFormData({ surname: '', initials: '', id_number: '', expiry_date: '' });
      setErrors({});
    },
    onError: () => {
      toast.error('Failed to add driver licence');
    },
  });

  const handleSubmit = (e: React.FormEvent): void => {
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

    // Transform data: uppercase surname, initials, id_number
    const transformedData = {
      surname: result.data.surname.toUpperCase(),
      initials: result.data.initials.toUpperCase(),
      id_number: result.data.id_number,
      expiry_date: result.data.expiry_date,
    };

    createMutation.mutate(transformedData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Add Driver Licence</DialogTitle>
          <DialogDescription>
            Enter the driver licence details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="surname">Surname *</Label>
            <Input
              id="surname"
              value={formData.surname}
              onChange={(e) => {
                setFormData({ ...formData, surname: e.target.value }); 
              }}
              placeholder="SMITH"
            />
            {errors.surname && <p className="text-sm text-destructive">{errors.surname}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="initials">Initials *</Label>
            <Input
              id="initials"
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
            <Label htmlFor="id_number">ID Number *</Label>
            <Input
              id="id_number"
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
            <Label htmlFor="expiry_date">Expiry Date *</Label>
            <Input
              id="expiry_date"
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
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Adding...' : 'Add Driver'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
