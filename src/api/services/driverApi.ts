import type { IDriver, ICreateDriverRequest, IUpdateDriverRequest, IGetDriversParams } from '@/types/driver';
import type { DeleteResponse } from '../types/shared';
import { buildQueryString, buildUrl } from '../utils/queryBuilder';
import apiClient from './apiClient';

export async function getDrivers(params?: IGetDriversParams): Promise<PaginatedDriversResponse> {
  const queryString = buildQueryString(params, {
    surname: params?.surname,
    id_number: params?.id_number,
    sort_by: params?.sortBy,
    sort_order: params?.sortOrder,
  });
  const url = buildUrl('/driver-licences', queryString);
  const response = await apiClient.get<PaginatedDriversResponse>(url);
  return response.data;
}

export async function getDriverById(id: string): Promise<IDriver> {
  const response = await apiClient.get<DriverResponse>(`/driver-licences/${id}`);
  return response.data.data.driver_licence;
}

export async function createDriver(data: ICreateDriverRequest): Promise<IDriver> {
  const response = await apiClient.post<DriverResponse>('/driver-licences', data);
  return response.data.data.driver_licence;
}

export async function updateDriver(id: string, data: IUpdateDriverRequest): Promise<IDriver> {
  const response = await apiClient.patch<DriverResponse>(`/driver-licences/${id}`, data);
  return response.data.data.driver_licence;
}

export async function deleteDriver(id: string): Promise<string> {
  const response = await apiClient.delete<DeleteResponse>(`/driver-licences/${id}`);
  return response.data.data.message;
}

interface DriverResponse {
  success: boolean;
  data: {
    driver_licence: IDriver;
  };
}

export interface PaginatedDriversResponse {
  success: boolean;
  data: {
    driver_licences: IDriver[];
  };
  pagination: {
    nextCursor: string | null;
  };
}
