import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useQueryInvalidation(queryKey: string): ()=> void {
  const queryClient = useQueryClient();

  return useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: [queryKey] });
  }, [queryClient, queryKey]);
}
