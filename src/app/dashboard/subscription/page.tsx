import { useState } from 'react';
import { useQuery, useQueries, useQueryClient } from '@tanstack/react-query';
import type { IPackage } from '@/types/subscription';
import {
  getMySubscriptions,
  getPackageBySlug,
  initializeSubscription,
  cancelSubscription,
  refundSubscription,
} from '@/api/services/subscriptionApi';
import { useSubscriptionContext } from '@/context/subscriptionContext';
import { SubscriptionCard } from '@/components/subscription/SubscriptionCard';
import { PackageCard } from '@/components/subscription/PackageCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Package } from 'lucide-react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export default function SubscriptionPage(): React.JSX.Element {
  const [subscribingPackageId, setSubscribingPackageId] = useState<string | null>(null);
  const [cancellingSubscriptionId, setCancellingSubscriptionId] = useState<string | null>(null);
  const [refundingSubscriptionId, setRefundingSubscriptionId] = useState<string | null>(null);
  const { refreshPermissions } = useSubscriptionContext();
  const queryClient = useQueryClient();

  const {
    data: subscriptionsData,
    isLoading: isLoadingSubscription,
    isError: isSubscriptionError,
    error: subscriptionError,
  } = useQuery({
    queryKey: ['subscription', 'list'],
    queryFn: async () => getMySubscriptions(),
  });

  const subscriptions = subscriptionsData?.data?.subscriptions ?? [];
  const activeSubscription = subscriptions.find((s) =>
    s.status === 'active' && new Date(s.end_date) > new Date(),
  );
  const currentSubscription = activeSubscription ?? subscriptions[0] ?? null;

  const PACKAGE_SLUGS = ['monthly-subscription', 'annual-subscription'] as const;

  const packageQueries = useQueries({
    queries: PACKAGE_SLUGS.map((slug) => ({
      queryKey: ['package', slug],
      queryFn: async (): Promise<IPackage> => getPackageBySlug(slug),
    })),
  });

  const isLoadingPackages = packageQueries.some((query) => query.isLoading);
  const isPackagesError = packageQueries.some((query) => query.isError);
  const packagesError = packageQueries.find((query) => query.error)?.error;
  const packages = packageQueries
    .map((query) => query.data)
    .filter((data): data is IPackage => data !== undefined);

  const handleSubscribe = async (packageId: string): Promise<void> => {
    setSubscribingPackageId(packageId);
    try {
      const callbackUrl = `${window.location.origin}/dashboard/subscription/callback`;
      const response = await initializeSubscription(packageId, callbackUrl);
      window.location.href = response.authorization_url;
    } catch (err) {
      const message = err instanceof AxiosError
        ? err.response?.data?.error ?? err.message
        : err instanceof Error ? err.message : 'Failed to initialize subscription';
      toast.error(message);
      setSubscribingPackageId(null);
    }
  };

  const handleCancel = async (subscriptionId: string): Promise<void> => {
    setCancellingSubscriptionId(subscriptionId);
    try {
      await cancelSubscription(subscriptionId);
      toast.success('Subscription cancelled successfully');
      void queryClient.invalidateQueries({ queryKey: ['subscription', 'list'] });
      await refreshPermissions();
    } catch (err) {
      const message = err instanceof AxiosError
        ? err.response?.data?.error ?? err.message
        : err instanceof Error ? err.message : 'Failed to cancel subscription';
      toast.error(message);
    } finally {
      setCancellingSubscriptionId(null);
    }
  };

  const handleRefund = async (subscriptionId: string): Promise<void> => {
    setRefundingSubscriptionId(subscriptionId);
    try {
      await refundSubscription(subscriptionId);
      toast.success('Refund requested successfully');
      void queryClient.invalidateQueries({ queryKey: ['subscription', 'list'] });
      await refreshPermissions();
    } catch (err) {
      const message = err instanceof AxiosError
        ? err.response?.data?.error ?? err.message
        : err instanceof Error ? err.message : 'Failed to request refund';
      toast.error(message);
    } finally {
      setRefundingSubscriptionId(null);
    }
  };

  const renderCurrentSubscription = (): React.JSX.Element => {
    if (isLoadingSubscription) {
      return (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      );
    }

    if (isSubscriptionError) {
      const errorMessage = subscriptionError instanceof AxiosError
        ? subscriptionError.response?.data?.error ?? subscriptionError.message
        : subscriptionError instanceof Error ? subscriptionError.message : 'Failed to load subscription';
      return (
        <Card>
          <CardContent className="flex items-center gap-2 py-6">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <span className="text-destructive">{errorMessage}</span>
          </CardContent>
        </Card>
      );
    }

    if (!currentSubscription) {
      return (
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Package className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle>No Active Subscription</CardTitle>
            <CardDescription>
              Choose a plan below to Signup with Remlic.
            </CardDescription>
          </CardHeader>
        </Card>
      );
    }

    return (
      <SubscriptionCard
        subscription={currentSubscription}
        onCancel={handleCancel}
        isCancelling={cancellingSubscriptionId === currentSubscription.id}
        onRefund={handleRefund}
        isRefunding={refundingSubscriptionId === currentSubscription.id}
      />
    );
  };

  const renderPackages = (): React.JSX.Element => {
    if (isLoadingPackages) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48 mt-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-24" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (isPackagesError) {
      const errorMessage = packagesError instanceof AxiosError
        ? packagesError.response?.data?.error ?? packagesError.message
        : packagesError instanceof Error ? packagesError.message : 'Failed to load packages';
      return (
        <Card>
          <CardContent className="flex items-center gap-2 py-6">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <span className="text-destructive">{errorMessage}</span>
          </CardContent>
        </Card>
      );
    }

    if (!packages || packages.length === 0) {
      return (
        <Card>
          <CardContent className="text-center py-6">
            <p className="text-muted-foreground">No packages available at the moment.</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            onSubscribe={(id) => void handleSubscribe(id)}
            isLoading={subscribingPackageId === pkg.id}
            isCurrentPlan={currentSubscription?.package_id === pkg.id}
            hasActiveSubscription={!!activeSubscription}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold mb-4">Your Subscription</h2>
        {renderCurrentSubscription()}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Available Plans</h2>
        {renderPackages()}
      </section>
    </div>
  );
}
