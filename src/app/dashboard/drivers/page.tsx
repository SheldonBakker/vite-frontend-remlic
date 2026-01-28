import { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import {
  getDrivers,
  deleteDriver,
  type PaginatedDriversResponse,
  type PaginationCursor,
} from '@/api/services/driverApi';
import type { IDriver } from '@/types/driver';
import DriverCard from '@/components/drivers/DriverCard';
import { VehicleCardSkeleton } from '@/components/skeletons/RecordCardSkeleton';
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
import AddDriverDialog from '@/components/drivers/AddDriverDialog';
import { Plus, Loader2, Search, X } from 'lucide-react';
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
  surname: string;
  id_number: string;
  sort_by: 'surname' | 'expiry_date' | 'created_at' | null;
  sort_order: 'asc' | 'desc';
}

function DriversPageContent(): React.JSX.Element {
  const [deletingDriverId, setDeletingDriverId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    surname: '',
    id_number: '',
    sort_by: null,
    sort_order: 'asc',
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
    queryKey: ['drivers', filters],
    queryFn: async ({ pageParam }): Promise<PaginatedDriversResponse> => {
      return getDrivers({
        cursor: pageParam ? encodeCursor(pageParam) : undefined,
        limit: ITEMS_PER_PAGE,
        surname: filters.surname || undefined,
        id_number: filters.id_number || undefined,
        sortBy: filters.sort_by ?? undefined,
        sortOrder: filters.sort_by ? filters.sort_order : undefined,
      });
    },
    initialPageParam: null as PaginationCursor | null,
    getNextPageParam: (lastPage) => lastPage.pagination.nextCursor,
  });

  const handleDriverEdited = useCallback((_driver: IDriver): void => {
    void queryClient.invalidateQueries({ queryKey: ['drivers'] });
  }, [queryClient]);

  useEffect(() => {
    setPageHeaderContent(
      <Button size="sm" onClick={() => setDialogOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Driver
      </Button>,
    );

    return (): void => {
      setPageHeaderContent(null);
    };
  }, [setPageHeaderContent]);

  const handleDeleteDriver = async (id: string): Promise<void> => {
    setDeletingDriverId(id);
    try {
      await deleteDriver(id);
      void queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success('Driver licence deleted successfully');
    } catch (err) {
      const message = err instanceof AxiosError
        ? err.response?.data?.error ?? err.message
        : err instanceof Error ? err.message : 'Failed to delete driver licence';
      toast.error(message);
    } finally {
      setDeletingDriverId(null);
    }
  };

  const handleSearch = (): void => {
    setFilters((prev) => ({ ...prev, surname: searchInput }));
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = (): void => {
    setSearchInput('');
    setFilters((prev) => ({ ...prev, surname: '' }));
  };

  const handleSortByChange = (value: string): void => {
    setFilters((prev) => ({
      ...prev,
      sort_by: value === 'none' ? null : value as 'surname' | 'expiry_date' | 'created_at',
    }));
  };

  const handleSortOrderChange = (value: string): void => {
    setFilters((prev) => ({
      ...prev,
      sort_order: value as 'asc' | 'desc',
    }));
  };

  const hasActiveFilters = filters.surname || filters.id_number || filters.sort_by !== null;

  const handleClearFilters = (): void => {
    setSearchInput('');
    setFilters({
      surname: '',
      id_number: '',
      sort_by: null,
      sort_order: 'asc',
    });
  };

  const drivers = data?.pages.flatMap((page) => page.data.driver_licences) ?? [];

  const renderFilters = (): React.JSX.Element => (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by surname..."
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

        <Input
          placeholder="ID Number (exact)"
          value={filters.id_number}
          onChange={(e) => setFilters((prev) => ({ ...prev, id_number: e.target.value }))}
          className="w-full sm:w-48"
          maxLength={13}
        />

        <Select value={filters.sort_by ?? 'none'} onValueChange={handleSortByChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Default</SelectItem>
            <SelectItem value="surname">Surname</SelectItem>
            <SelectItem value="expiry_date">Expiry Date</SelectItem>
            <SelectItem value="created_at">Created Date</SelectItem>
          </SelectContent>
        </Select>

        {filters.sort_by && (
          <Select value={filters.sort_order} onValueChange={handleSortOrderChange}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
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
          {filters.surname && (
            <span className="text-sm bg-secondary px-2 py-1 rounded">
              Surname: {filters.surname}
            </span>
          )}
          {filters.id_number && (
            <span className="text-sm bg-secondary px-2 py-1 rounded">
              ID: {filters.id_number}
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
            <VehicleCardSkeleton key={index} />
          ))}
        </div>
      </>
    );
  }

  if (isError) {
    const errorMessage = error instanceof AxiosError
      ? error.response?.data?.error ?? error.message
      : error instanceof Error ? error.message : 'Failed to load driver licences';
    return (
      <>
        {renderFilters()}
        <div className="text-center py-8">
          <p className="text-destructive">{errorMessage}</p>
        </div>
      </>
    );
  }

  if (drivers.length === 0) {
    return (
      <>
        {renderFilters()}
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {hasActiveFilters ? 'No driver licences match your filters.' : 'No driver licences registered yet.'}
          </p>
          {!hasActiveFilters && (
            <p className="text-sm text-muted-foreground mt-1">
              Click the &quot;Add Driver&quot; button to register your first driver licence.
            </p>
          )}
        </div>
        <AddDriverDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </>
    );
  }

  return (
    <>
      {renderFilters()}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {drivers.map((driver) => (
          <DriverCard
            key={driver.id}
            driver={driver}
            onDelete={(id) => void handleDeleteDriver(id)}
            onEdit={handleDriverEdited}
            isDeleting={deletingDriverId === driver.id}
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
      <AddDriverDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}

export default function DriversPage(): React.JSX.Element {
  return (
    <RequirePermission permission="drivers_access">
      <DriversPageContent />
    </RequirePermission>
  );
}
