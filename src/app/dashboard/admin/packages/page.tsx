import { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import {
  getPackages,
  deletePackage,
} from '@/api/services/adminApi';
import type { IPackage, PaginatedPackagesResponse } from '@/types/admin';
import type { PaginationCursor } from '@/api/types/shared';
import { PackageCard } from '@/components/admin/PackageCard';
import { FirearmCardSkeleton as RecordCardSkeleton } from '@/components/skeletons/RecordCardSkeleton';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AddPackageDialog } from '@/components/admin/AddPackageDialog';
import { Plus, Loader2, X } from 'lucide-react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface DashboardContext {
  setPageHeaderContent: (content: React.ReactNode | null)=> void;
}

const ITEMS_PER_PAGE = 20;

function encodeCursor(cursor: PaginationCursor): string {
  return btoa(JSON.stringify(cursor));
}

interface Filters {
  is_active: boolean | null;
  type: 'monthly' | 'yearly' | null;
}

export default function PackagesPage(): React.JSX.Element {
  const [deletingPackageId, setDeletingPackageId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    is_active: null,
    type: null,
  });
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
    queryKey: ['admin-packages', filters],
    queryFn: async ({ pageParam }): Promise<PaginatedPackagesResponse> => {
      return getPackages({
        cursor: pageParam ? encodeCursor(pageParam) : undefined,
        limit: ITEMS_PER_PAGE,
        is_active: filters.is_active ?? undefined,
        type: filters.type ?? undefined,
      });
    },
    initialPageParam: null as PaginationCursor | null,
    getNextPageParam: (lastPage) => lastPage.pagination.nextCursor,
  });

  const handlePackageAdded = useCallback((_pkg: IPackage): void => {
    void queryClient.invalidateQueries({ queryKey: ['admin-packages'] });
  }, [queryClient]);

  const handlePackageEdited = useCallback((_pkg: IPackage): void => {
    void queryClient.invalidateQueries({ queryKey: ['admin-packages'] });
  }, [queryClient]);

  useEffect(() => {
    setPageHeaderContent(
      <Button size="sm" onClick={() => setDialogOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Package
      </Button>,
    );

    return (): void => {
      setPageHeaderContent(null);
    };
  }, [setPageHeaderContent]);

  const handleDeletePackage = async (id: string): Promise<void> => {
    setDeletingPackageId(id);
    try {
      await deletePackage(id);
      void queryClient.invalidateQueries({ queryKey: ['admin-packages'] });
      toast.success('Package deactivated successfully');
    } catch (err) {
      const message = err instanceof AxiosError
        ? err.response?.data?.error ?? err.message
        : err instanceof Error ? err.message : 'Failed to deactivate package';
      toast.error(message);
    } finally {
      setDeletingPackageId(null);
    }
  };

  const handleIsActiveChange = (value: string): void => {
    if (value === 'all') {
      setFilters((prev) => ({ ...prev, is_active: null }));
    } else {
      setFilters((prev) => ({ ...prev, is_active: value === 'active' }));
    }
  };

  const handleTypeChange = (value: string): void => {
    if (value === 'all') {
      setFilters((prev) => ({ ...prev, type: null }));
    } else {
      setFilters((prev) => ({ ...prev, type: value as 'monthly' | 'yearly' }));
    }
  };

  const hasActiveFilters = filters.is_active !== null || filters.type !== null;

  const handleClearFilters = (): void => {
    setFilters({
      is_active: null,
      type: null,
    });
  };

  const packages = data?.pages.flatMap((page) => page.data.packages).filter((pkg) => pkg?.id) ?? [];

  const renderFilters = (): React.JSX.Element => (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Select
          value={filters.is_active === null ? 'all' : filters.is_active ? 'active' : 'inactive'}
          onValueChange={handleIsActiveChange}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.type ?? 'all'}
          onValueChange={handleTypeChange}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.is_active !== null && (
            <span className="text-sm bg-secondary px-2 py-1 rounded">
              Status: {filters.is_active ? 'Active' : 'Inactive'}
            </span>
          )}
          {filters.type && (
            <span className="text-sm bg-secondary px-2 py-1 rounded">
              Type: {filters.type}
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
            <RecordCardSkeleton key={`package-skeleton-${index}`} />
          ))}
        </div>
      </>
    );
  }

  if (isError) {
    const errorMessage = error instanceof AxiosError
      ? error.response?.data?.error ?? error.message
      : error instanceof Error ? error.message : 'Failed to load packages';
    return (
      <>
        {renderFilters()}
        <div className="text-center py-8">
          <p className="text-destructive">{errorMessage}</p>
        </div>
      </>
    );
  }

  if (packages.length === 0) {
    return (
      <>
        {renderFilters()}
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {hasActiveFilters ? 'No packages match your filters.' : 'No packages created yet.'}
          </p>
          {!hasActiveFilters && (
            <p className="text-sm text-muted-foreground mt-1">
              Click the &quot;Add Package&quot; button to create your first package.
            </p>
          )}
        </div>
        <AddPackageDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={handlePackageAdded}
        />
      </>
    );
  }

  return (
    <>
      {renderFilters()}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg, index) => (
          <PackageCard
            key={`${pkg.id}-${index}`}
            package={pkg}
            onDelete={(id) => void handleDeletePackage(id)}
            onEdit={handlePackageEdited}
            isDeleting={deletingPackageId === pkg.id}
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
      <AddPackageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handlePackageAdded}
      />
    </>
  );
}
