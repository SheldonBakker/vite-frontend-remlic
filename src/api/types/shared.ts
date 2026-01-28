export interface PaginationCursor {
  created_at: string;
  id: string;
}

export interface DeleteResponse {
  success: boolean;
  data: {
    message: string;
  };
}

export type SortOrder = 'asc' | 'desc';

export interface PaginatedResponse<T> {
  success: boolean;
  data: T;
  pagination: {
    nextCursor: PaginationCursor | null;
  };
}

export interface BaseQueryParams {
  cursor?: string;
  limit?: number;
  sort_order?: SortOrder;
}
