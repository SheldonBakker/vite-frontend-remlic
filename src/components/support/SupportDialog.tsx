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
import { Textarea } from '@/components/ui/textarea';
import { useAuthContext } from '@/context/authContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import apiClient from '@/api/services/apiClient';

interface SupportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean)=> void;
}

interface SupportFormData {
  email: string;
  subject: string;
  message: string;
}

export function SupportDialog({ open, onOpenChange }: SupportDialogProps): React.JSX.Element {
  const { authUser } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<SupportFormData>({
    email: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    if (authUser?.email) {
      setFormData((prev) => ({ ...prev, email: authUser.email }));
    }
  }, [authUser?.email]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiClient.post('/contact', {
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      toast.success('Support request sent successfully. We\'ll get back to you soon!');
      onOpenChange(false);
      setFormData({
        email: authUser?.email ?? '',
        subject: '',
        message: '',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send support request';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof SupportFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleOpenChange = (newOpen: boolean): void => {
    onOpenChange(newOpen);
    if (!newOpen) {
      setFormData({
        email: authUser?.email ?? '',
        subject: '',
        message: '',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact Support</DialogTitle>
          <DialogDescription>
            Have a question or need help? Send us a message and we&apos;ll get back to you as soon as possible.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange('email')}
                disabled={!!authUser?.email}
                required
              />
              {authUser?.email && (
                <p className="text-xs text-muted-foreground">
                  Using your account email
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="What is this regarding?"
                value={formData.subject}
                onChange={handleChange('subject')}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Please describe your issue or question in detail..."
                value={formData.message}
                onChange={handleChange('message')}
                rows={5}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
