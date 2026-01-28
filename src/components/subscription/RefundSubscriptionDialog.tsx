import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, RotateCcw } from 'lucide-react';

interface RefundSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean)=> void;
  onConfirm: ()=> Promise<void>;
  isLoading: boolean;
  packageName: string;
}

export function RefundSubscriptionDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  packageName,
}: RefundSubscriptionDialogProps): React.JSX.Element {
  const handleConfirm = (): void => {
    void onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <RotateCcw className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center">Request Refund?</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to request a refund for your <strong>{packageName}</strong> subscription?
            This will cancel your subscription and return your payment.
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
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Request Refund'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
