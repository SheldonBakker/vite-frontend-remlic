import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Package, AlertCircle, RotateCcw } from 'lucide-react';
import { CancelSubscriptionDialog } from './CancelSubscriptionDialog';
import { RefundSubscriptionDialog } from './RefundSubscriptionDialog';
import { getPricing } from '@/constants/pricing';
import { formatDateFull } from '@/lib/utils';
import type { ISubscription } from '@/types/subscription';

interface SubscriptionCardProps {
  subscription: ISubscription;
  onCancel: (subscriptionId: string)=> Promise<void>;
  isCancelling: boolean;
  onRefund?: (subscriptionId: string)=> Promise<void>;
  isRefunding?: boolean;
}

const statusColors: Record<string, string> = {
  active: 'bg-green-500/10 text-green-500 border-green-500/20',
  expired: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
  refunded: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
};

const REFUND_WINDOW_DAYS = 7;

function isWithinRefundWindow(startDate: string): boolean {
  const start = new Date(startDate);
  const now = new Date();
  const diffInMs = now.getTime() - start.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  return diffInDays <= REFUND_WINDOW_DAYS;
}

export function SubscriptionCard({
  subscription,
  onCancel,
  isCancelling,
  onRefund,
  isRefunding = false,
}: SubscriptionCardProps): React.JSX.Element {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const pkg = subscription.app_packages;
  const isActive = subscription.status === 'active';
  const canRefund = isActive && onRefund && isWithinRefundWindow(subscription.start_date);

  const handleCancelConfirm = async (): Promise<void> => {
    await onCancel(subscription.id);
    setCancelDialogOpen(false);
  };

  const handleRefundConfirm = async (): Promise<void> => {
    if (onRefund) {
      await onRefund(subscription.id);
      setRefundDialogOpen(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {pkg.package_name}
              </CardTitle>
              <CardDescription className="mt-1">
                {pkg.description ?? 'Subscription plan'}
              </CardDescription>
            </div>
            <Badge className={statusColors[subscription.status]}>
              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Plan Type</span>
            <span className="font-medium capitalize">{pkg.type}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Price</span>
            <span className="font-medium">
              {getPricing(pkg.type).amount}/{getPricing(pkg.type).period}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {formatDateFull(subscription.start_date)} - {formatDateFull(subscription.end_date)}
            </span>
          </div>
          <div className="pt-2 border-t">
            <p className="text-sm font-medium mb-2">Includes access to:</p>
            <div className="flex flex-wrap gap-2">
              {pkg.app_permissions.firearm_access && (
                <Badge variant="secondary">Firearms</Badge>
              )}
              {pkg.app_permissions.vehicle_access && (
                <Badge variant="secondary">Vehicles</Badge>
              )}
              {pkg.app_permissions.certificate_access && (
                <Badge variant="secondary">Certificates</Badge>
              )}
              {pkg.app_permissions.psira_access && (
                <Badge variant="secondary">PSIRA</Badge>
              )}
            </div>
          </div>
        </CardContent>
        {isActive && (
          <CardFooter className="border-t pt-4 gap-2">
            {canRefund && (
              <Button
                className="flex-1"
                onClick={() => setRefundDialogOpen(true)}
                disabled={isRefunding || isCancelling}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Request Refund
              </Button>
            )}
            <Button
              variant="outline"
              className={`${canRefund ? 'flex-1' : 'w-full'} text-destructive hover:text-destructive`}
              onClick={() => setCancelDialogOpen(true)}
              disabled={isCancelling || isRefunding}
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Cancel Subscription
            </Button>
          </CardFooter>
        )}
      </Card>

      <CancelSubscriptionDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={handleCancelConfirm}
        isLoading={isCancelling}
        packageName={pkg.package_name}
      />

      <RefundSubscriptionDialog
        open={refundDialogOpen}
        onOpenChange={setRefundDialogOpen}
        onConfirm={handleRefundConfirm}
        isLoading={isRefunding}
        packageName={pkg.package_name}
      />
    </>
  );
}
