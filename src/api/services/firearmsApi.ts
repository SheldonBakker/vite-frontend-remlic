import type { DeleteResponse, PaginationCursor, SortOrder, BaseQueryParams } from '../types/shared';
import { buildQueryString, buildUrl } from '../utils/queryBuilder';
import apiClient from './apiClient';

export async function getFirearms(params?: GetFirearmsParams): Promise<PaginatedFirearmsResponse> {
  const queryString = buildQueryString(params, {
    serial_number: params?.serial_number,
    sort_by: params?.sort_by,
  });
  const url = buildUrl('/firearms', queryString);
  const response = await apiClient.get<PaginatedFirearmsResponse>(url);
  return response.data;
}

export async function getFirearmById(id: string): Promise<Firearm> {
  const response = await apiClient.get<FirearmResponse>(`/firearms/${id}`);
  return response.data.data.firearm;
}

export async function createFirearm(data: CreateFirearmRequest): Promise<Firearm> {
  const response = await apiClient.post<FirearmResponse>('/firearms', data);
  return response.data.data.firearm;
}

export async function deleteFirearm(id: string): Promise<string> {
  const response = await apiClient.delete<DeleteResponse>(`/firearms/${id}`);
  return response.data.data.message;
}

export async function updateFirearm(id: string, data: UpdateFirearmRequest): Promise<Firearm> {
  const response = await apiClient.patch<FirearmResponse>(`/firearms/${id}`, data);
  return response.data.data.firearm;
}

export interface Firearm {
  id: string;
  profile_id: string;
  type: string;
  make: string;
  model: string;
  caliber: string;
  serial_number: string;
  expiry_date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateFirearmRequest {
  type: string;
  make: string;
  model: string;
  caliber: string;
  serial_number: string;
  expiry_date: string;
}

export interface UpdateFirearmRequest {
  type?: string;
  make?: string;
  model?: string;
  caliber?: string;
  serial_number?: string;
  expiry_date?: string;
}

interface FirearmResponse {
  success: boolean;
  data: {
    firearm: Firearm;
  };
}

export interface PaginatedFirearmsResponse {
  success: boolean;
  data: {
    firearms: Firearm[];
  };
  pagination: {
    nextCursor: PaginationCursor | null;
  };
}

export type SortBy = 'expiry_date';

export interface GetFirearmsParams extends BaseQueryParams {
  serial_number?: string;
  sort_by?: SortBy;
}

export type { SortOrder, PaginationCursor };
