import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EditSubscriptionDialog } from '@/components/admin/EditSubscriptionDialog';
import { Pencil, Ban, User, Package, Calendar } from 'lucide-react';
import type { ISubscription } from '@/types/admin';

interface SubscriptionCardProps {
  subscription: ISubscription;
  onCancel: (id: string)=> void;
  onEdit: (subscription: ISubscription)=> void;
  isCancelling?: boolean;
}

export function SubscriptionCard({ subscription, onCancel, onEdit, isCancelling }: SubscriptionCardProps): React.JSX.Element {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleConfirmCancel = (): void => {
    onCancel(subscription.id);
    setConfirmOpen(false);
  };

  const handleEditSuccess = (updatedSubscription: ISubscription): void => {
    onEdit(updatedSubscription);
    setEditOpen(false);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' => {
    switch (status) {
      case 'active':
        return 'default';
      case 'expired':
        return 'secondary';
      case 'cancelled':
      case 'refunded':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const capitalize = (str: string | undefined): string => {
    if (!str) {
      return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const truncateId = (id: string): string => {
    if (id.length <= 16) {
      return id;
    }
    return `${id.substring(0, 8)}...${id.substring(id.length - 8)}`;
  };

  const isCancelled = subscription.status === 'cancelled' || subscription.status === 'refunded';

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-medium">
              {subscription.app_packages?.package_name ?? 'Unknown Package'}
            </CardTitle>
            <Badge variant={getStatusVariant(subscription.status)}>
              {capitalize(subscription.status)}
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setEditOpen(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setConfirmOpen(true)}
              disabled={isCancelled || isCancelling}
              className="text-muted-foreground hover:text-destructive"
            >
              <Ban className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1">
                <User className="h-3 w-3" />
                Profile
              </span>
              <span className="font-mono text-xs">{truncateId(subscription.profile_id)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1">
                <Package className="h-3 w-3" />
                Type
              </span>
              <span>{capitalize(subscription.app_packages?.type ?? 'unknown')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Start Date
              </span>
              <span>{formatDate(subscription.start_date)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                End Date
              </span>
              <span>{formatDate(subscription.end_date)}</span>
            </div>
            {subscription.paystack_transaction_reference && (
              <div className="flex justify-between items-center pt-1">
                <span className="text-muted-foreground text-xs">Transaction Ref</span>
                <span className="font-mono text-xs truncate max-w-37.5">
                  {subscription.paystack_transaction_reference}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Cancel Subscription"
        description={'Are you sure you want to cancel this subscription? This will set the status to "cancelled".'}
        confirmLabel="Cancel Subscription"
        onConfirm={handleConfirmCancel}
        isLoading={isCancelling}
        variant="destructive"
      />
      <EditSubscriptionDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={handleEditSuccess}
        subscription={subscription}
      />
    </>
  );
}
