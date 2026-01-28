import type { PaginationCursor, SortOrder, BaseQueryParams } from '../types/shared';
import { buildQueryString, buildUrl } from '../utils/queryBuilder';
import apiClient from './apiClient';

export async function getExpiringRecords(params: GetExpiringRecordsParams): Promise<ExpiringRecordsResponse> {
  const queryString = buildQueryString(params, {
    record_type: params.record_type,
    days_ahead: params.days_ahead,
    include_expired: params.include_expired,
  });
  const url = buildUrl('/dashboard/expiring', queryString);
  const response = await apiClient.get<ExpiringRecordsResponse>(url);
  return response.data;
}

export type RecordType = 'firearms' | 'vehicles' | 'psira_officers' | 'certificates';

export interface ExpiringRecord {
  id: string;
  record_type: RecordType;
  name: string;
  identifier: string;
  expiry_date: string;
  created_at: string;
}

export interface ExpiringRecordsResponse {
  success: boolean;
  data: {
    expiring_records: ExpiringRecord[];
  };
  pagination: {
    nextCursor: PaginationCursor | null;
  };
}

export interface GetExpiringRecordsParams extends BaseQueryParams {
  record_type?: RecordType;
  days_ahead: number;
  include_expired: boolean;
}

export type { SortOrder, PaginationCursor };
