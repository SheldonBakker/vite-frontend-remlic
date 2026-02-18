import { useState } from 'react';
import { useNavigate } from 'react-router';
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
import { deleteAccount } from '@/api/services/profileApi';
import { useAuthContext } from '@/context/authContext';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
}

export function DeleteAccountDialog({ open, onOpenChange, email }: DeleteAccountDialogProps): React.JSX.Element {
  const [emailInput, setEmailInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const emailMatches = emailInput.trim().toLowerCase() === email.trim().toLowerCase();

  const resetForm = (): void => {
    setEmailInput('');
    setError(null);
  };

  const handleClose = (isOpen: boolean): void => {
    if (!isOpen) {
      resetForm();
    }
    onOpenChange(isOpen);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);

    if (!emailMatches) {
      return;
    }

    setIsLoading(true);

    try {
      await deleteAccount();
      toast.success('Account deleted successfully');
      await logout();
      navigate('/login');
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.error ?? err.message);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to delete account');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            This action is permanent and cannot be undone. All your data will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)}>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="confirm-email">
                Type <span className="font-semibold">{email}</span> to confirm
              </Label>
              <Input
                id="confirm-email"
                type="email"
                placeholder="Enter your email to confirm"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleClose(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={!emailMatches || isLoading}>
              {isLoading ? 'Deleting...' : 'Delete Account'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
