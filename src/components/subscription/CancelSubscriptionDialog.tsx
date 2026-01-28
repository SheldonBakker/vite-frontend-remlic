import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';

interface CancelSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean)=> void;
  onConfirm: ()=> Promise<void>;
  isLoading: boolean;
  packageName: string;
}

export function CancelSubscriptionDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  packageName,
}: CancelSubscriptionDialogProps): React.JSX.Element {
  const handleConfirm = (): void => {
    void onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle className="text-center">Cancel Subscription?</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to cancel your <strong>{packageName}</strong> subscription?
            You will lose access to the features included in this plan at the end of your
            current billing period.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Keep Subscription
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              'Yes, Cancel'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
