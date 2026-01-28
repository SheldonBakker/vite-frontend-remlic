import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errors';

interface UseDeleteItemOptions {
  queryKey: string;
  successMessage: string;
  errorMessage: string;
}

interface UseDeleteItemReturn {
  deletingId: string | null;
  handleDelete: (id: string, deleteFn: (id: string)=> Promise<unknown>)=> Promise<void>;
}

export function useDeleteItem(options: UseDeleteItemOptions): UseDeleteItemReturn {
  const { queryKey, successMessage, errorMessage } = options;
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleDelete = useCallback(
    async (id: string, deleteFn: (id: string)=> Promise<unknown>): Promise<void> => {
      setDeletingId(id);
      try {
        await deleteFn(id);
        void queryClient.invalidateQueries({ queryKey: [queryKey] });
        toast.success(successMessage);
      } catch (err) {
        toast.error(getErrorMessage(err, errorMessage));
      } finally {
        setDeletingId(null);
      }
    },
    [queryClient, queryKey, successMessage, errorMessage],
  );

  return { deletingId, handleDelete };
}
