import type { BaseQueryParams } from '../types/shared';

type ParamValue = string | number | boolean | undefined | null;

export function buildQueryString<T extends BaseQueryParams>(
  params: T | undefined,
  additionalParams?: Record<string, ParamValue>,
): string {
  const searchParams = new URLSearchParams();

  if (params) {
    if (params.cursor) {
      searchParams.set('cursor', params.cursor);
    }
    if (params.limit !== undefined) {
      searchParams.set('limit', params.limit.toString());
    }
    if (params.sort_order) {
      searchParams.set('sort_order', params.sort_order);
    }
  }

  if (additionalParams) {
    for (const [key, value] of Object.entries(additionalParams)) {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, String(value));
      }
    }
  }

  return searchParams.toString();
}

export function buildUrl(basePath: string, queryString: string): string {
  return queryString ? `${basePath}?${queryString}` : basePath;
}
