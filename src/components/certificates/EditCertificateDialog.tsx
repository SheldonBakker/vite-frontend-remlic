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
import { updateCertificate, type UpdateCertificateRequest, type Certificate } from '@/api/services/certificatesApi';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface EditCertificateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean)=> void;
  onSuccess: (certificate: Certificate)=> void;
  certificate: Certificate;
}

export function EditCertificateDialog({ open, onOpenChange, onSuccess, certificate }: EditCertificateDialogProps): React.JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateCertificateRequest>({
    type: certificate.type,
    first_name: certificate.first_name,
    last_name: certificate.last_name,
    certificate_number: certificate.certificate_number,
    expiry_date: certificate.expiry_date,
  });

  useEffect(() => {
    setFormData({
      type: certificate.type,
      first_name: certificate.first_name,
      last_name: certificate.last_name,
      certificate_number: certificate.certificate_number,
      expiry_date: certificate.expiry_date,
    });
  }, [certificate]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);

    setIsSubmitting(true);

    try {
      const submitData: UpdateCertificateRequest = {
        type: formData.type?.toUpperCase(),
        first_name: formData.first_name?.toUpperCase(),
        last_name: formData.last_name?.toUpperCase(),
        certificate_number: formData.certificate_number?.toUpperCase(),
        expiry_date: formData.expiry_date,
      };

      const updatedCertificate = await updateCertificate(certificate.id, submitData);
      onSuccess(updatedCertificate);
      onOpenChange(false);
      toast.success('Certificate updated successfully');
    } catch (err) {
      const message = err instanceof AxiosError
        ? err.response?.data?.error?.message ?? err.message
        : err instanceof Error ? err.message : 'Failed to update certificate';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof UpdateCertificateRequest) => (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Certificate</DialogTitle>
          <DialogDescription>
            Update the details of your certificate.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)}>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Certificate Type</Label>
              <Input
                id="edit-type"
                placeholder="e.g. First Aid, Fire Safety"
                value={formData.type}
                onChange={handleChange('type')}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-first_name">First Name</Label>
              <Input
                id="edit-first_name"
                placeholder="e.g. John"
                value={formData.first_name}
                onChange={handleChange('first_name')}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-last_name">Last Name</Label>
              <Input
                id="edit-last_name"
                placeholder="e.g. Doe"
                value={formData.last_name}
                onChange={handleChange('last_name')}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-certificate_number">Certificate Number</Label>
              <Input
                id="edit-certificate_number"
                placeholder="e.g. CERT-2024-001"
                value={formData.certificate_number}
                onChange={handleChange('certificate_number')}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-expiry_date">Expiry Date</Label>
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
