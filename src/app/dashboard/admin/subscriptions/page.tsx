import { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import {
  getSubscriptions,
  cancelSubscription,
} from '@/api/services/adminApi';
import type { ISubscription, SubscriptionStatus, PaginatedSubscriptionsResponse } from '@/types/admin';
import { SubscriptionCard } from '@/components/admin/SubscriptionCard';
import { FirearmCardSkeleton as RecordCardSkeleton } from '@/components/skeletons/RecordCardSkeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AddSubscriptionDialog } from '@/components/admin/AddSubscriptionDialog';
import { Plus, Loader2, Search, X } from 'lucide-react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface DashboardContext {
  setPageHeaderContent: (content: React.ReactNode | null)=> void;
}

const ITEMS_PER_PAGE = 20;

interface Filters {
  status: SubscriptionStatus | null;
  profile_id: string;
}

export default function SubscriptionsPage(): React.JSX.Element {
  const [cancellingSubscriptionId, setCancellingSubscriptionId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    status: null,
    profile_id: '',
  });
  const [searchInput, setSearchInput] = useState('');
  const { setPageHeaderContent } = useOutletContext<DashboardContext>();
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['admin-subscriptions', filters],
    queryFn: async ({ pageParam }): Promise<PaginatedSubscriptionsResponse> => {
      return getSubscriptions({
        cursor: pageParam ?? undefined,
        limit: ITEMS_PER_PAGE,
        status: filters.status ?? undefined,
        profile_id: filters.profile_id || undefined,
      });
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.pagination.nextCursor,
  });

  const handleSubscriptionAdded = useCallback((_subscription: ISubscription): void => {
    void queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
  }, [queryClient]);

  const handleSubscriptionEdited = useCallback((_subscription: ISubscription): void => {
    void queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
  }, [queryClient]);

  useEffect(() => {
    setPageHeaderContent(
      <Button size="sm" onClick={() => setDialogOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Subscription
      </Button>,
    );

    return (): void => {
      setPageHeaderContent(null);
    };
  }, [setPageHeaderContent]);

  const handleCancelSubscription = async (id: string): Promise<void> => {
    setCancellingSubscriptionId(id);
    try {
      await cancelSubscription(id);
      void queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      toast.success('Subscription cancelled successfully');
    } catch (err) {
      const message = err instanceof AxiosError
        ? err.response?.data?.error ?? err.message
        : err instanceof Error ? err.message : 'Failed to cancel subscription';
      toast.error(message);
    } finally {
      setCancellingSubscriptionId(null);
    }
  };

  const handleStatusChange = (value: string): void => {
    if (value === 'all') {
      setFilters((prev) => ({ ...prev, status: null }));
    } else {
      setFilters((prev) => ({ ...prev, status: value as SubscriptionStatus }));
    }
  };

  const handleSearch = (): void => {
    setFilters((prev) => ({ ...prev, profile_id: searchInput }));
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = (): void => {
    setSearchInput('');
    setFilters((prev) => ({ ...prev, profile_id: '' }));
  };

  const hasActiveFilters = filters.status !== null || filters.profile_id;

  const handleClearFilters = (): void => {
    setSearchInput('');
    setFilters({
      status: null,
      profile_id: '',
    });
  };

  const subscriptions = data?.pages.flatMap((page) => page.data.subscriptions).filter((subscription) => subscription?.id) ?? [];

  const renderFilters = (): React.JSX.Element => (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by profile ID..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="pl-9 pr-9"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Select
          value={filters.status ?? 'all'}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleSearch} variant="secondary">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.profile_id && (
            <span className="text-sm bg-secondary px-2 py-1 rounded">
              Profile: {filters.profile_id.substring(0, 16)}...
            </span>
          )}
          {filters.status && (
            <span className="text-sm bg-secondary px-2 py-1 rounded">
              Status: {filters.status}
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            <X className="mr-1 h-3 w-3" />
            Clear all
          </Button>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <>
        {renderFilters()}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <RecordCardSkeleton key={`subscription-skeleton-${index}`} />
          ))}
        </div>
      </>
    );
  }

  if (isError) {
    const errorMessage = error instanceof AxiosError
      ? error.response?.data?.error ?? error.message
      : error instanceof Error ? error.message : 'Failed to load subscriptions';
    return (
      <>
        {renderFilters()}
        <div className="text-center py-8">
          <p className="text-destructive">{errorMessage}</p>
        </div>
      </>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <>
        {renderFilters()}
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {hasActiveFilters ? 'No subscriptions match your filters.' : 'No subscriptions created yet.'}
          </p>
          {!hasActiveFilters && (
            <p className="text-sm text-muted-foreground mt-1">
              Click the &quot;Add Subscription&quot; button to create your first subscription.
            </p>
          )}
        </div>
        <AddSubscriptionDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={handleSubscriptionAdded}
        />
      </>
    );
  }

  return (
    <>
      {renderFilters()}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subscriptions.map((subscription, index) => (
          <SubscriptionCard
            key={`${subscription.id}-${index}`}
            subscription={subscription}
            onCancel={(id) => void handleCancelSubscription(id)}
            onEdit={handleSubscriptionEdited}
            isCancelling={cancellingSubscriptionId === subscription.id}
          />
        ))}
      </div>
      {hasNextPage && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => void fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
      <AddSubscriptionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleSubscriptionAdded}
      />
    </>
  );
}
