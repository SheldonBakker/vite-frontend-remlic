import { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCertificates,
  deleteCertificate,
  type Certificate,
  type PaginatedCertificatesResponse,
  type SortBy,
  type SortOrder,
} from '@/api/services/certificatesApi';
import { CertificateCard } from '@/components/certificates/CertificateCard';
import { CertificateCardSkeleton } from '@/components/skeletons/RecordCardSkeleton';
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
import { AddCertificateDialog } from '@/components/certificates/AddCertificateDialog';
import { Plus, Loader2, Search, X } from 'lucide-react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface DashboardContext {
  setPageHeaderContent: (content: React.ReactNode | null)=> void;
}

const ITEMS_PER_PAGE = 20;

interface Filters {
  certificate_number: string;
  sort_by: SortBy | null;
  sort_order: SortOrder;
}

function CertificatesPageContent(): React.JSX.Element {
  const [deletingCertificateId, setDeletingCertificateId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    certificate_number: '',
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
    queryKey: ['certificates', filters],
    queryFn: async ({ pageParam }): Promise<PaginatedCertificatesResponse> => {
      return getCertificates({
        cursor: pageParam ?? undefined,
        limit: ITEMS_PER_PAGE,
        certificate_number: filters.certificate_number || undefined,
        sort_by: filters.sort_by ?? undefined,
        sort_order: filters.sort_by ? filters.sort_order : undefined,
      });
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.pagination.nextCursor,
  });

  const handleCertificateAdded = useCallback((_certificate: Certificate): void => {
    void queryClient.invalidateQueries({ queryKey: ['certificates'] });
  }, [queryClient]);

  const handleCertificateEdited = useCallback((_certificate: Certificate): void => {
    void queryClient.invalidateQueries({ queryKey: ['certificates'] });
  }, [queryClient]);

  useEffect(() => {
    setPageHeaderContent(
      <Button size="sm" onClick={() => setDialogOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Certificate
      </Button>,
    );

    return (): void => {
      setPageHeaderContent(null);
    };
  }, [setPageHeaderContent]);

  const handleDeleteCertificate = async (id: string): Promise<void> => {
    setDeletingCertificateId(id);
    try {
      await deleteCertificate(id);
      void queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast.success('Certificate deleted successfully');
    } catch (err) {
      const message = err instanceof AxiosError
        ? err.response?.data?.error?.message ?? err.message
        : err instanceof Error ? err.message : 'Failed to delete certificate';
      toast.error(message);
    } finally {
      setDeletingCertificateId(null);
    }
  };

  const handleSearch = (): void => {
    setFilters((prev) => ({ ...prev, certificate_number: searchInput }));
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = (): void => {
    setSearchInput('');
    setFilters((prev) => ({ ...prev, certificate_number: '' }));
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

  const hasActiveFilters = filters.certificate_number || filters.sort_by !== null;

  const handleClearFilters = (): void => {
    setSearchInput('');
    setFilters({
      certificate_number: '',
      sort_by: null,
      sort_order: 'desc',
    });
  };

  const certificates = data?.pages.flatMap((page) => page.data.certificates) ?? [];

  const renderFilters = (): React.JSX.Element => (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by certificate number..."
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
          {filters.certificate_number && (
            <span className="text-sm bg-secondary px-2 py-1 rounded">
              Cert No: {filters.certificate_number}
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
            <CertificateCardSkeleton key={index} />
          ))}
        </div>
      </>
    );
  }

  if (isError) {
    const errorMessage = error instanceof AxiosError
      ? error.response?.data?.error ?? error.message
      : error instanceof Error ? error.message : 'Failed to load certificates';
    return (
      <>
        {renderFilters()}
        <div className="text-center py-8">
          <p className="text-destructive">{errorMessage}</p>
        </div>
      </>
    );
  }

  if (certificates.length === 0) {
    return (
      <>
        {renderFilters()}
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {hasActiveFilters ? 'No certificates match your filters.' : 'No certificates registered yet.'}
          </p>
          {!hasActiveFilters && (
            <p className="text-sm text-muted-foreground mt-1">
              Click the &quot;Add Certificate&quot; button to register your first certificate.
            </p>
          )}
        </div>
        <AddCertificateDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={handleCertificateAdded}
        />
      </>
    );
  }

  return (
    <>
      {renderFilters()}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {certificates.map((certificate) => (
          <CertificateCard
            key={certificate.id}
            certificate={certificate}
            onDelete={(id) => void handleDeleteCertificate(id)}
            onEdit={handleCertificateEdited}
            isDeleting={deletingCertificateId === certificate.id}
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
      <AddCertificateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleCertificateAdded}
      />
    </>
  );
}

export default function CertificatesPage(): React.JSX.Element {
  return (
    <RequirePermission permission="certificate_access">
      <CertificatesPageContent />
    </RequirePermission>
  );
}
