import type { DeleteResponse, PaginationCursor, SortOrder, BaseQueryParams } from '../types/shared';
import { buildQueryString, buildUrl } from '../utils/queryBuilder';
import apiClient from './apiClient';

export async function getVehicles(params?: GetVehiclesParams): Promise<PaginatedVehiclesResponse> {
  const queryString = buildQueryString(params, {
    year: params?.year,
    registration_number: params?.registration_number,
    sort_by: params?.sort_by,
  });
  const url = buildUrl('/vehicle', queryString);
  const response = await apiClient.get<PaginatedVehiclesResponse>(url);
  return response.data;
}

export async function getVehicleById(id: string): Promise<Vehicle> {
  const response = await apiClient.get<VehicleResponse>(`/vehicle/${id}`);
  return response.data.data.vehicle;
}

export async function createVehicle(data: CreateVehicleRequest): Promise<Vehicle> {
  const response = await apiClient.post<VehicleResponse>('/vehicle', data);
  return response.data.data.vehicle;
}

export async function deleteVehicle(id: string): Promise<string> {
  const response = await apiClient.delete<DeleteResponse>(`/vehicle/${id}`);
  return response.data.data.message;
}

export async function updateVehicle(id: string, data: UpdateVehicleRequest): Promise<Vehicle> {
  const response = await apiClient.patch<VehicleResponse>(`/vehicle/${id}`, data);
  return response.data.data.vehicle;
}

export interface Vehicle {
  id: string;
  profile_id: string;
  make: string;
  model: string;
  year: number;
  vin_number: string | null;
  registration_number: string;
  expiry_date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateVehicleRequest {
  make: string;
  model: string;
  year: number;
  vin_number?: string;
  registration_number: string;
  expiry_date: string;
}

export interface UpdateVehicleRequest {
  make?: string;
  model?: string;
  year?: number;
  vin_number?: string;
  registration_number?: string;
  expiry_date?: string;
}

interface VehicleResponse {
  success: boolean;
  data: {
    vehicle: Vehicle;
  };
}

export interface PaginatedVehiclesResponse {
  success: boolean;
  data: {
    vehicles: Vehicle[];
  };
  pagination: {
    nextCursor: PaginationCursor | null;
  };
}

export type VehicleSortBy = 'year' | 'expiry_date';

export interface GetVehiclesParams extends BaseQueryParams {
  year?: number;
  registration_number?: string;
  sort_by?: VehicleSortBy;
}

export type { SortOrder, PaginationCursor };
