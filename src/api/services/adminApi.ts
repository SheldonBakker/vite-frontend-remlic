import type { BaseQueryParams } from '@/api/types/shared';
import type {
  CreatePermissionRequest,
  CreatePackageRequest,
  DeleteResponse as AdminDeleteResponse,
  IPackage,
  IPermission,
  ISubscription,
  PaginatedPackagesResponse,
  PaginatedPermissionsResponse,
  PaginatedSubscriptionsResponse,
  SinglePackageResponse,
  SinglePermissionResponse,
  SubscriptionStatus,
  UpdatePermissionRequest,
  UpdatePackageRequest,
  UpdateSubscriptionRequest,
} from '@/types/admin';
import apiClient from './apiClient';

export const getPermissions = async (params?: BaseQueryParams): Promise<PaginatedPermissionsResponse> => {
  const response = await apiClient.get<PaginatedPermissionsResponse>('/permissions', { params });
  return response.data;
};

export const getPermissionById = async (id: string): Promise<IPermission> => {
  const response = await apiClient.get<PaginatedPermissionsResponse>('/permissions', { params: { id } });
  return response.data.data.permissions[0];
};

export const createPermission = async (data: CreatePermissionRequest): Promise<IPermission> => {
  const response = await apiClient.post<SinglePermissionResponse>('/permissions', data);
  return response.data.data.permission;
};

export const updatePermission = async (id: string, data: UpdatePermissionRequest): Promise<IPermission> => {
  const response = await apiClient.patch<SinglePermissionResponse>(`/permissions/${id}`, data);
  return response.data.data.permission;
};

export const deletePermission = async (id: string): Promise<string> => {
  const response = await apiClient.delete<AdminDeleteResponse>(`/permissions/${id}`);
  return response.data.data.message;
};


export interface GetPackagesParams extends BaseQueryParams {
  is_active?: boolean;
  type?: 'monthly' | 'yearly';
}

export const getPackages = async (params?: GetPackagesParams): Promise<PaginatedPackagesResponse> => {
  const response = await apiClient.get<PaginatedPackagesResponse>('/packages', { params });
  return response.data;
};

export const getPackageById = async (id: string): Promise<IPackage> => {
  const response = await apiClient.get<PaginatedPackagesResponse>('/packages', { params: { id } });
  return response.data.data.packages[0];
};

export const createPackage = async (data: CreatePackageRequest): Promise<IPackage> => {
  const response = await apiClient.post<SinglePackageResponse>('/packages', data);
  return response.data.data.package;
};

export const updatePackage = async (id: string, data: UpdatePackageRequest): Promise<IPackage> => {
  const response = await apiClient.patch<SinglePackageResponse>(`/packages/${id}`, data);
  return response.data.data.package;
};

export const deletePackage = async (id: string): Promise<string> => {
  const response = await apiClient.delete<AdminDeleteResponse>(`/packages/${id}`);
  return response.data.data.message;
};


export interface GetSubscriptionsParams extends BaseQueryParams {
  status?: SubscriptionStatus;
  profile_id?: string;
}

export const getSubscriptions = async (params?: GetSubscriptionsParams): Promise<PaginatedSubscriptionsResponse> => {
  const response = await apiClient.get<PaginatedSubscriptionsResponse>('/subscriptions', { params });
  return response.data;
};

export const updateSubscription = async (id: string, data: UpdateSubscriptionRequest): Promise<ISubscription> => {
  const response = await apiClient.patch<{ success: boolean; data: { subscription: ISubscription } }>(`/subscriptions/${id}`, data);
  return response.data.data.subscription;
};

export const cancelSubscription = async (id: string): Promise<string> => {
  const response = await apiClient.delete<AdminDeleteResponse>(`/subscriptions/${id}`);
  return response.data.data.message;
};
