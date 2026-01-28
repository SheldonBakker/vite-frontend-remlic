import apiClient from './apiClient';
import type {
  IUserPermissions,
  ISubscription,
  IPackage,
  IInitializeResponse,
} from '@/types/subscription';

interface PermissionsResponse {
  success: boolean;
  data: {
    permissions: IUserPermissions;
  };
}

interface SubscriptionsResponse {
  success: boolean;
  data: {
    subscriptions: ISubscription[];
  };
  pagination: {
    nextCursor: PaginationCursor | null;
  };
}

interface CurrentSubscriptionResponse {
  success: boolean;
  data: {
    subscription: ISubscription | null;
  };
}

interface InitializeResponse {
  success: boolean;
  data: IInitializeResponse;
}

interface CancelResponse {
  success: boolean;
  data: {
    message: string;
  };
}

interface RefundResponse {
  success: boolean;
  data: {
    message: string;
  };
}

interface ChangePlanResponse {
  success: boolean;
  data: IInitializeResponse;
}

interface PackagesResponse {
  success: boolean;
  data: {
    packages: IPackage[];
  };
}

interface PackageBySlugResponse {
  success: boolean;
  data: {
    package: IPackage;
  };
}

export interface PaginationCursor {
  created_at: string;
  id: string;
}

export interface GetSubscriptionsParams {
  cursor?: string;
  limit?: number;
}

export async function getMyPermissions(): Promise<IUserPermissions> {
  const response = await apiClient.get<PermissionsResponse>('/subscriptions/me/permissions');
  return response.data.data.permissions;
}

export async function getMySubscriptions(params?: GetSubscriptionsParams): Promise<SubscriptionsResponse> {
  const searchParams = new URLSearchParams();
  if (params?.cursor) {
    searchParams.set('cursor', params.cursor);
  }
  if (params?.limit) {
    searchParams.set('limit', params.limit.toString());
  }
  const queryString = searchParams.toString();
  const url = queryString ? `/subscriptions/me?${queryString}` : '/subscriptions/me';
  const response = await apiClient.get<SubscriptionsResponse>(url);
  return response.data;
}

export async function getCurrentSubscription(): Promise<ISubscription | null> {
  const response = await apiClient.get<CurrentSubscriptionResponse>('/subscriptions/me/current');
  return response.data.data.subscription;
}

export async function getPackages(): Promise<IPackage[]> {
  const response = await apiClient.get<PackagesResponse>('/packages');
  return response.data.data.packages;
}

export async function getPackageBySlug(slug: string): Promise<IPackage> {
  const response = await apiClient.get<PackageBySlugResponse>(`/packages/slug/${slug}`);
  return response.data.data.package;
}

export async function initializeSubscription(
  packageId: string,
  callbackUrl: string,
): Promise<IInitializeResponse> {
  const response = await apiClient.post<InitializeResponse>('/subscriptions/initialize', {
    package_id: packageId,
    callback_url: callbackUrl,
  });
  return response.data.data;
}

export async function cancelSubscription(subscriptionId: string): Promise<string> {
  const response = await apiClient.post<CancelResponse>(`/subscriptions/me/${subscriptionId}/cancel`);
  return response.data.data.message;
}

export async function refundSubscription(subscriptionId: string): Promise<string> {
  const response = await apiClient.post<RefundResponse>(`/subscriptions/me/${subscriptionId}/refund`);
  return response.data.data.message;
}

export async function changePlan(
  subscriptionId: string,
  newPackageId: string,
  callbackUrl: string,
): Promise<IInitializeResponse> {
  const response = await apiClient.post<ChangePlanResponse>(
    `/subscriptions/me/${subscriptionId}/change-plan`,
    {
      new_package_id: newPackageId,
      callback_url: callbackUrl,
    },
  );
  return response.data.data;
}
