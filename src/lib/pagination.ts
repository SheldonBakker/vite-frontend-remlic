import type { PaginationCursor } from '@/api/types/shared';

export function encodeCursor(cursor: PaginationCursor): string {
  return btoa(JSON.stringify(cursor));
}

export function decodeCursor(encoded: string): PaginationCursor {
  return JSON.parse(atob(encoded)) as PaginationCursor;
}

export const DEFAULT_PAGE_SIZE = 20;
