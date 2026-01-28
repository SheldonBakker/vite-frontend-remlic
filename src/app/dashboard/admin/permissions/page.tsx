import { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import {
  getPermissions,
  deletePermission,
} from '@/api/services/adminApi';
import type { IPermission, PaginatedPermissionsResponse } from '@/types/admin';
import type { PaginationCursor } from '@/api/types/shared';
import { PermissionCard } from '@/components/admin/PermissionCard';
import { FirearmCardSkeleton as RecordCardSkeleton } from '@/components/skeletons/RecordCardSkeleton';
import { Button } from '@/components/ui/button';
import { AddPermissionDialog } from '@/components/admin/AddPermissionDialog';
import { Plus, Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface DashboardContext {
  setPageHeaderContent: (content: React.ReactNode | null)=> void;
}

const ITEMS_PER_PAGE = 20;

function encodeCursor(cursor: PaginationCursor): string {
  return btoa(JSON.stringify(cursor));
}

export default function PermissionsPage(): React.JSX.Element {
  const [deletingPermissionId, setDeletingPermissionId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
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
    queryKey: ['admin-permissions'],
    queryFn: async ({ pageParam }): Promise<PaginatedPermissionsResponse> => {
      return getPermissions({
        cursor: pageParam ? encodeCursor(pageParam) : undefined,
        limit: ITEMS_PER_PAGE,
      });
    },
    initialPageParam: null as PaginationCursor | null,
    getNextPageParam: (lastPage) => lastPage.pagination.nextCursor,
  });

  const handlePermissionAdded = useCallback((_permission: IPermission): void => {
    void queryClient.invalidateQueries({ queryKey: ['admin-permissions'] });
  }, [queryClient]);

  const handlePermissionEdited = useCallback((_permission: IPermission): void => {
    void queryClient.invalidateQueries({ queryKey: ['admin-permissions'] });
  }, [queryClient]);

  useEffect(() => {
    setPageHeaderContent(
      <Button size="sm" onClick={() => setDialogOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Permission
      </Button>,
    );

    return (): void => {
      setPageHeaderContent(null);
    };
  }, [setPageHeaderContent]);

  const handleDeletePermission = async (id: string): Promise<void> => {
    setDeletingPermissionId(id);
    try {
      await deletePermission(id);
      void queryClient.invalidateQueries({ queryKey: ['admin-permissions'] });
      toast.success('Permission deleted successfully');
    } catch (err) {
      const message = err instanceof AxiosError
        ? err.response?.data?.error ?? err.message
        : err instanceof Error ? err.message : 'Failed to delete permission';

      if (err instanceof AxiosError && err.response?.status === 409) {
        toast.error('Cannot delete permission. It is linked to existing packages.');
      } else {
        toast.error(message);
      }
    } finally {
      setDeletingPermissionId(null);
    }
  };

  const permissions = data?.pages.flatMap((page) => page.data.permissions).filter((permission) => permission?.id) ?? [];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <RecordCardSkeleton key={`permission-skeleton-${index}`} />
        ))}
      </div>
    );
  }

  if (isError) {
    const errorMessage = error instanceof AxiosError
      ? error.response?.data?.error ?? error.message
      : error instanceof Error ? error.message : 'Failed to load permissions';
    return (
      <div className="text-center py-8">
        <p className="text-destructive">{errorMessage}</p>
      </div>
    );
  }

  if (permissions.length === 0) {
    return (
      <>
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No permissions created yet.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Click the &quot;Add Permission&quot; button to create your first permission.
          </p>
        </div>
        <AddPermissionDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={handlePermissionAdded}
        />
      </>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {permissions.map((permission, index) => (
          <PermissionCard
            key={`${permission.id}-${index}`}
            permission={permission}
            onDelete={(id) => void handleDeletePermission(id)}
            onEdit={handlePermissionEdited}
            isDeleting={deletingPermissionId === permission.id}
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
      <AddPermissionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handlePermissionAdded}
      />
    </>
  );
}
