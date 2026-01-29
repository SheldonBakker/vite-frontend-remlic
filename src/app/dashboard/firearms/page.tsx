import { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import {
  getFirearms,
  deleteFirearm,
  type Firearm,
  type PaginatedFirearmsResponse,
  type SortBy,
  type SortOrder,
} from '@/api/services/firearmsApi';
import { FirearmCard } from '@/components/firearms/FirearmCard';
import { FirearmCardSkeleton } from '@/components/skeletons/RecordCardSkeleton';
import { RequirePermission } from '@/components/subscription/RequirePermission';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AddFirearmDialog } from '@/components/firearms/AddFirearmDialog';
import { Plus, Loader2, Search, X } from 'lucide-react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface DashboardContext {
  setPageHeaderContent: (content: React.ReactNode | null)=> void;
}

const ITEMS_PER_PAGE = 20;

interface Filters {
  serial_number: string;
  sort_by: SortBy | null;
  sort_order: SortOrder;
}

function FirearmsPageContent(): React.JSX.Element {
  const [deletingFirearmId, setDeletingFirearmId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    serial_number: '',
    sort_by: null,
    sort_order: 'desc',
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
    queryKey: ['firearms', filters],
    queryFn: async ({ pageParam }): Promise<PaginatedFirearmsResponse> => {
      return getFirearms({
        cursor: pageParam ?? undefined,
        limit: ITEMS_PER_PAGE,
        serial_number: filters.serial_number || undefined,
        sort_by: filters.sort_by ?? undefined,
        sort_order: filters.sort_by ? filters.sort_order : undefined,
      });
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.pagination.nextCursor,
  });

  const handleFirearmAdded = useCallback((_firearm: Firearm): void => {
    void queryClient.invalidateQueries({ queryKey: ['firearms'] });
  }, [queryClient]);

  const handleFirearmEdited = useCallback((_firearm: Firearm): void => {
    void queryClient.invalidateQueries({ queryKey: ['firearms'] });
  }, [queryClient]);

  useEffect(() => {
    setPageHeaderContent(
      <Button size="sm" onClick={() => setDialogOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Firearm
      </Button>,
    );

    return (): void => {
      setPageHeaderContent(null);
    };
  }, [setPageHeaderContent]);

  const handleDeleteFirearm = async (id: string): Promise<void> => {
    setDeletingFirearmId(id);
    try {
      await deleteFirearm(id);
      void queryClient.invalidateQueries({ queryKey: ['firearms'] });
      toast.success('Firearm deleted successfully');
    } catch (err) {
      const message = err instanceof AxiosError
        ? err.response?.data?.error ?? err.message
        : err instanceof Error ? err.message : 'Failed to delete firearm';
      toast.error(message);
    } finally {
      setDeletingFirearmId(null);
    }
  };

  const handleSearch = (): void => {
    setFilters((prev) => ({ ...prev, serial_number: searchInput }));
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = (): void => {
    setSearchInput('');
    setFilters((prev) => ({ ...prev, serial_number: '' }));
  };

  const handleSortByChange = (value: string): void => {
    setFilters((prev) => ({
      ...prev,
      sort_by: value === 'none' ? null : value as SortBy,
    }));
  };

  const handleSortOrderChange = (value: string): void => {
    setFilters((prev) => ({
      ...prev,
      sort_order: value as SortOrder,
    }));
  };

  const hasActiveFilters = filters.serial_number || filters.sort_by !== null;

  const handleClearFilters = (): void => {
    setSearchInput('');
    setFilters({
      serial_number: '',
      sort_by: null,
      sort_order: 'desc',
    });
  };

  const firearms = data?.pages.flatMap((page) => page.data.firearms) ?? [];

  const renderFilters = (): React.JSX.Element => (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by serial number..."
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

        <Select value={filters.sort_by ?? 'none'} onValueChange={handleSortByChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Default</SelectItem>
            <SelectItem value="expiry_date">Expiry Date</SelectItem>
          </SelectContent>
        </Select>

        {filters.sort_by && (
          <Select value={filters.sort_order} onValueChange={handleSortOrderChange}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
        )}

        <Button onClick={handleSearch} variant="secondary">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.serial_number && (
            <span className="text-sm bg-secondary px-2 py-1 rounded">
              Serial: {filters.serial_number}
            </span>
          )}
          {filters.sort_by && (
            <span className="text-sm bg-secondary px-2 py-1 rounded">
              Sort: {filters.sort_by} ({filters.sort_order})
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
          {[...Array(3)].map((_, index) => (
            <FirearmCardSkeleton key={index} />
          ))}
        </div>
      </>
    );
  }

  if (isError) {
    const errorMessage = error instanceof AxiosError
      ? error.response?.data?.error ?? error.message
      : error instanceof Error ? error.message : 'Failed to load firearms';
    return (
      <>
        {renderFilters()}
        <div className="text-center py-8">
          <p className="text-destructive">{errorMessage}</p>
        </div>
      </>
    );
  }

  if (firearms.length === 0) {
    return (
      <>
        {renderFilters()}
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {hasActiveFilters ? 'No firearms match your filters.' : 'No firearms registered yet.'}
          </p>
          {!hasActiveFilters && (
            <p className="text-sm text-muted-foreground mt-1">
              Click the &quot;Add Firearm&quot; button to register your first firearm.
            </p>
          )}
        </div>
        <AddFirearmDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={handleFirearmAdded}
        />
      </>
    );
  }

  return (
    <>
      {renderFilters()}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {firearms.map((firearm) => (
          <FirearmCard
            key={firearm.id}
            firearm={firearm}
            onDelete={(id) => void handleDeleteFirearm(id)}
            onEdit={handleFirearmEdited}
            isDeleting={deletingFirearmId === firearm.id}
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
      <AddFirearmDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleFirearmAdded}
      />
    </>
  );
}

export default function FirearmsPage(): React.JSX.Element {
  return (
    <RequirePermission permission="firearm_access">
      <FirearmsPageContent />
    </RequirePermission>
  );
}
