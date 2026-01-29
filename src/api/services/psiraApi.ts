import type { DeleteResponse, SortOrder, BaseQueryParams } from '../types/shared';
import { buildQueryString, buildUrl } from '../utils/queryBuilder';
import apiClient from './apiClient';

export async function lookupPsiraOfficer(idNumber: string): Promise<PsiraOfficer[]> {
  const response = await apiClient.get<PsiraLookupResponse>(`/psira/lookup/${idNumber}`);
  return response.data.data.officers;
}

export async function getPsiraOfficers(params?: GetPsiraParams): Promise<PaginatedPsiraResponse> {
  const queryString = buildQueryString(params, {
    id_number: params?.id_number,
    sort_by: params?.sort_by,
  });
  const url = buildUrl('/psira', queryString);
  const response = await apiClient.get<PaginatedPsiraResponse>(url);
  return response.data;
}

export async function createPsiraOfficer(data: CreatePsiraOfficerRequest): Promise<SavedPsiraOfficer> {
  const response = await apiClient.post<PsiraOfficerResponse>('/psira', data);
  return response.data.data.officer;
}

export async function deletePsiraOfficer(id: string): Promise<string> {
  const response = await apiClient.delete<DeleteResponse>(`/psira/${id}`);
  return response.data.data.message;
}

export interface PsiraOfficer {
  FirstName: string;
  LastName: string;
  Gender: string;
  RequestStatus: string;
  SIRANo: string;
  ExpiryDate: string;
}

export interface SavedPsiraOfficer {
  id: string;
  profile_id: string;
  id_number: string;
  first_name: string;
  last_name: string;
  gender: string;
  request_status: string;
  sira_no: string;
  expiry_date: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePsiraOfficerRequest {
  IDNumber: string;
  FirstName: string;
  LastName: string;
  Gender: string;
  RequestStatus: string;
  SIRANo: string;
  ExpiryDate: string;
}

export interface PaginatedPsiraResponse {
  success: boolean;
  data: {
    officers: SavedPsiraOfficer[];
  };
  pagination: {
    nextCursor: string | null;
  };
}

export type PsiraSortBy = 'expiry_date';

export interface GetPsiraParams extends BaseQueryParams {
  id_number?: string;
  sort_by?: PsiraSortBy;
}

interface PsiraLookupResponse {
  success: boolean;
  data: {
    officers: PsiraOfficer[];
  };
}

interface PsiraOfficerResponse {
  success: boolean;
  data: {
    officer: SavedPsiraOfficer;
  };
}

export type { SortOrder };
