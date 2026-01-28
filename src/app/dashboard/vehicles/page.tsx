import { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import {
  getVehicles,
  deleteVehicle,
  type Vehicle,
  type PaginationCursor,
  type PaginatedVehiclesResponse,
  type VehicleSortBy,
  type SortOrder,
} from '@/api/services/vehicleApi';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
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
import { AddVehicleDialog } from '@/components/vehicles/AddVehicleDialog';
import { Plus, Loader2, Search, X } from 'lucide-react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface DashboardContext {
  setPageHeaderContent: (content: React.ReactNode | null)=> void;
}

const ITEMS_PER_PAGE = 20;

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

function encodeCursor(cursor: PaginationCursor): string {
  return btoa(JSON.stringify(cursor));
}

interface Filters {
  registration_number: string;
  year: number | null;
  sort_by: VehicleSortBy | null;
  sort_order: SortOrder;
}

function VehiclesPageContent(): React.JSX.Element {
  const [deletingVehicleId, setDeletingVehicleId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    registration_number: '',
    year: null,
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
    queryKey: ['vehicles', filters],
    queryFn: async ({ pageParam }): Promise<PaginatedVehiclesResponse> => {
      return getVehicles({
        cursor: pageParam ? encodeCursor(pageParam) : undefined,
        limit: ITEMS_PER_PAGE,
        year: filters.year ?? undefined,
        registration_number: filters.registration_number || undefined,
        sort_by: filters.sort_by ?? undefined,
        sort_order: filters.sort_by ? filters.sort_order : undefined,
      });
    },
    initialPageParam: null as PaginationCursor | null,
    getNextPageParam: (lastPage) => lastPage.pagination.nextCursor,
  });

  const handleVehicleAdded = useCallback((_vehicle: Vehicle): void => {
    void queryClient.invalidateQueries({ queryKey: ['vehicles'] });
  }, [queryClient]);

  const handleVehicleEdited = useCallback((_vehicle: Vehicle): void => {
    void queryClient.invalidateQueries({ queryKey: ['vehicles'] });
  }, [queryClient]);

  useEffect(() => {
    setPageHeaderContent(
      <Button size="sm" onClick={() => setDialogOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Vehicle
      </Button>,
    );

    return (): void => {
      setPageHeaderContent(null);
    };
  }, [setPageHeaderContent]);

  const handleDeleteVehicle = async (id: string): Promise<void> => {
    setDeletingVehicleId(id);
    try {
      await deleteVehicle(id);
      void queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Vehicle deleted successfully');
    } catch (err) {
      const message = err instanceof AxiosError
        ? err.response?.data?.error ?? err.message
        : err instanceof Error ? err.message : 'Failed to delete vehicle';
      toast.error(message);
    } finally {
      setDeletingVehicleId(null);
    }
  };

  const handleSearch = (): void => {
    setFilters((prev) => ({ ...prev, registration_number: searchInput }));
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = (): void => {
    setSearchInput('');
    setFilters((prev) => ({ ...prev, registration_number: '' }));
  };

  const handleYearChange = (value: string): void => {
    setFilters((prev) => ({
      ...prev,
      year: value === 'all' ? null : parseInt(value, 10),
    }));
  };

  const handleSortByChange = (value: string): void => {
    setFilters((prev) => ({
      ...prev,
      sort_by: value === 'none' ? null : value as VehicleSortBy,
    }));
  };

  const handleSortOrderChange = (value: string): void => {
    setFilters((prev) => ({
      ...prev,
      sort_order: value as SortOrder,
    }));
  };

  const hasActiveFilters = filters.registration_number || filters.year !== null || filters.sort_by !== null;

  const handleClearFilters = (): void => {
    setSearchInput('');
    setFilters({
      registration_number: '',
      year: null,
      sort_by: null,
      sort_order: 'desc',
    });
  };

  const vehicles = data?.pages.flatMap((page) => page.data.vehicles) ?? [];

  const renderFilters = (): React.JSX.Element => (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by registration number..."
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

        <Select value={filters.year?.toString() ?? 'all'} onValueChange={handleYearChange}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.sort_by ?? 'none'} onValueChange={handleSortByChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Default</SelectItem>
            <SelectItem value="year">Year</SelectItem>
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
          {filters.registration_number && (
            <span className="text-sm bg-secondary px-2 py-1 rounded">
              Reg: {filters.registration_number}
            </span>
          )}
          {filters.year !== null && (
            <span className="text-sm bg-secondary px-2 py-1 rounded">
              Year: {filters.year}
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
      : error instanceof Error ? error.message : 'Failed to load vehicles';
    return (
      <>
        {renderFilters()}
        <div className="text-center py-8">
          <p className="text-destructive">{errorMessage}</p>
        </div>
      </>
    );
  }

  if (vehicles.length === 0) {
    return (
      <>
        {renderFilters()}
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {hasActiveFilters ? 'No vehicles match your filters.' : 'No vehicles registered yet.'}
          </p>
          {!hasActiveFilters && (
            <p className="text-sm text-muted-foreground mt-1">
              Click the &quot;Add Vehicle&quot; button to register your first vehicle.
            </p>
          )}
        </div>
        <AddVehicleDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={handleVehicleAdded}
        />
      </>
    );
  }

  return (
    <>
      {renderFilters()}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onDelete={(id) => void handleDeleteVehicle(id)}
            onEdit={handleVehicleEdited}
            isDeleting={deletingVehicleId === vehicle.id}
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
      <AddVehicleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleVehicleAdded}
      />
    </>
  );
}

export default function VehiclesPage(): React.JSX.Element {
  return (
    <RequirePermission permission="vehicle_access">
      <VehiclesPageContent />
    </RequirePermission>
  );
}
