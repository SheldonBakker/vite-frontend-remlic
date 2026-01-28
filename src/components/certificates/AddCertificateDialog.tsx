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
import { createCertificate, type CreateCertificateRequest, type Certificate } from '@/api/services/certificatesApi';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface AddCertificateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean)=> void;
  onSuccess: (certificate: Certificate)=> void;
}

export function AddCertificateDialog({ open, onOpenChange, onSuccess }: AddCertificateDialogProps): React.JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateCertificateRequest>({
    type: '',
    first_name: '',
    last_name: '',
    certificate_number: '',
    expiry_date: '',
  });

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);

    setIsSubmitting(true);

    try {
      const submitData: CreateCertificateRequest = {
        type: formData.type.toUpperCase(),
        first_name: formData.first_name.toUpperCase(),
        last_name: formData.last_name.toUpperCase(),
        certificate_number: formData.certificate_number.toUpperCase(),
        expiry_date: formData.expiry_date,
      };

      const certificate = await createCertificate(submitData);
      onSuccess(certificate);
      onOpenChange(false);
      setFormData({
        type: '',
        first_name: '',
        last_name: '',
        certificate_number: '',
        expiry_date: '',
      });
      toast.success('Certificate added successfully');
    } catch (err) {
      const message = err instanceof AxiosError
        ? err.response?.data?.error ?? err.message
        : err instanceof Error ? err.message : 'Failed to add certificate';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof CreateCertificateRequest) => (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Certificate</DialogTitle>
          <DialogDescription>
            Enter the details of your certificate.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)}>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="type">Certificate Type</Label>
              <Input
                id="type"
                placeholder="e.g. First Aid, Fire Safety"
                value={formData.type}
                onChange={handleChange('type')}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                placeholder="e.g. John"
                value={formData.first_name}
                onChange={handleChange('first_name')}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                placeholder="e.g. Doe"
                value={formData.last_name}
                onChange={handleChange('last_name')}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="certificate_number">Certificate Number</Label>
              <Input
                id="certificate_number"
                placeholder="e.g. CERT-2024-001"
                value={formData.certificate_number}
                onChange={handleChange('certificate_number')}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expiry_date">Expiry Date</Label>
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
              {isSubmitting ? 'Adding...' : 'Add Certificate'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
