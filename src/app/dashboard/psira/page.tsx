import { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import {
  getPsiraOfficers,
  deletePsiraOfficer,
  type SavedPsiraOfficer,
  type PaginatedPsiraResponse,
  type PsiraSortBy,
  type SortOrder,
} from '@/api/services/psiraApi';
import { PsiraCard } from '@/components/psira/PsiraCard';
import { PsiraCardSkeleton } from '@/components/skeletons/RecordCardSkeleton';
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
import { AddPsiraDialog } from '@/components/psira/AddPsiraDialog';
import { Plus, Loader2, Search, X } from 'lucide-react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface DashboardContext {
  setPageHeaderContent: (content: React.ReactNode | null)=> void;
}

const ITEMS_PER_PAGE = 20;

interface Filters {
  id_number: string;
  sort_by: PsiraSortBy | null;
  sort_order: SortOrder;
}

function PsiraPageContent(): React.JSX.Element {
  const [deletingPsiraId, setDeletingPsiraId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    id_number: '',
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
    queryKey: ['psira', filters],
    queryFn: async ({ pageParam }): Promise<PaginatedPsiraResponse> => {
      return getPsiraOfficers({
        cursor: pageParam ?? undefined,
        limit: ITEMS_PER_PAGE,
        id_number: filters.id_number || undefined,
        sort_by: filters.sort_by ?? undefined,
        sort_order: filters.sort_by ? filters.sort_order : undefined,
      });
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.pagination.nextCursor,
  });

  const handlePsiraAdded = useCallback((_officer: SavedPsiraOfficer): void => {
    void queryClient.invalidateQueries({ queryKey: ['psira'] });
  }, [queryClient]);

  useEffect(() => {
    setPageHeaderContent(
      <Button size="sm" onClick={() => setDialogOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add PSIRA Record
      </Button>,
    );

    return (): void => {
      setPageHeaderContent(null);
    };
  }, [setPageHeaderContent]);

  const handleDeletePsira = async (id: string): Promise<void> => {
    setDeletingPsiraId(id);
    try {
      await deletePsiraOfficer(id);
      void queryClient.invalidateQueries({ queryKey: ['psira'] });
      toast.success('PSIRA record deleted successfully');
    } catch (err) {
      const message = err instanceof AxiosError
        ? err.response?.data?.error?.message ?? err.message
        : err instanceof Error ? err.message : 'Failed to delete PSIRA record';
      toast.error(message);
    } finally {
      setDeletingPsiraId(null);
    }
  };

  const handleSearch = (): void => {
    setFilters((prev) => ({ ...prev, id_number: searchInput }));
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = (): void => {
    setSearchInput('');
    setFilters((prev) => ({ ...prev, id_number: '' }));
  };

  const handleSortByChange = (value: string): void => {
    setFilters((prev) => ({
      ...prev,
      sort_by: value === 'none' ? null : value as PsiraSortBy,
    }));
  };

  const handleSortOrderChange = (value: string): void => {
    setFilters((prev) => ({
      ...prev,
      sort_order: value as SortOrder,
    }));
  };

  const hasActiveFilters = filters.id_number || filters.sort_by !== null;

  const handleClearFilters = (): void => {
    setSearchInput('');
    setFilters({
      id_number: '',
      sort_by: null,
      sort_order: 'desc',
    });
  };

  const psiraOfficers = data?.pages.flatMap((page) => page.data.officers) ?? [];

  const renderFilters = (): React.JSX.Element => (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by ID number..."
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
          {filters.id_number && (
            <span className="text-sm bg-secondary px-2 py-1 rounded">
              ID: {filters.id_number}
            </span>
          )}
          {filters.sort_by && (
            <span className="text-sm bg-secondary px-2 py-1 rounded">
              Sort: {filters.sort_by.replace('_', ' ')} ({filters.sort_order})
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
            <PsiraCardSkeleton key={index} />
          ))}
        </div>
      </>
    );
  }

  if (isError) {
    const errorMessage = error instanceof AxiosError
      ? error.response?.data?.error ?? error.message
      : error instanceof Error ? error.message : 'Failed to load PSIRA records';
    return (
      <>
        {renderFilters()}
        <div className="text-center py-8">
          <p className="text-destructive">{errorMessage}</p>
        </div>
      </>
    );
  }

  if (psiraOfficers.length === 0) {
    return (
      <>
        {renderFilters()}
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {hasActiveFilters ? 'No PSIRA records match your filters.' : 'No PSIRA records yet.'}
          </p>
          {!hasActiveFilters && (
            <p className="text-sm text-muted-foreground mt-1">
              Click the &quot;Add PSIRA Record&quot; button to add your first record.
            </p>
          )}
        </div>
        <AddPsiraDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={handlePsiraAdded}
        />
      </>
    );
  }

  return (
    <>
      {renderFilters()}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {psiraOfficers.map((officer) => (
          <PsiraCard
            key={officer.id}
            officer={officer}
            onDelete={(id) => void handleDeletePsira(id)}
            isDeleting={deletingPsiraId === officer.id}
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
      <AddPsiraDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handlePsiraAdded}
      />
    </>
  );
}

export default function PsiraPage(): React.JSX.Element {
  return (
    <RequirePermission permission="psira_access">
      <PsiraPageContent />
    </RequirePermission>
  );
}
