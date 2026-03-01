import apiClient from './apiClient';
import type {
  IUserPermissions,
  ISubscription,
  IPackage,
  IInitializeResponse,
} from '@/types/subscription';

interface SubscriptionsResponse {
  success: boolean;
  data: {
    subscriptions: ISubscription[];
  };
  pagination: {
    nextCursor: PaginationCursor | null;
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
  const response = await apiClient.get<SubscriptionsResponse>('/subscriptions', {
    params: { status: 'active' },
  });
  const subscriptions = response.data.data.subscriptions;
  return {
    psira_access: subscriptions.some((s) => s.app_packages?.app_permissions?.psira_access === true),
    firearm_access: subscriptions.some((s) => s.app_packages?.app_permissions?.firearm_access === true),
    vehicle_access: subscriptions.some((s) => s.app_packages?.app_permissions?.vehicle_access === true),
    certificate_access: subscriptions.some((s) => s.app_packages?.app_permissions?.certificate_access === true),
    drivers_access: subscriptions.some((s) => s.app_packages?.app_permissions?.drivers_access === true),
    active_subscriptions: subscriptions.length,
  };
}

export async function getMySubscriptions(params?: GetSubscriptionsParams): Promise<SubscriptionsResponse> {
  const response = await apiClient.get<SubscriptionsResponse>('/subscriptions', { params });
  return response.data;
}

export async function getCurrentSubscription(): Promise<ISubscription | null> {
  const response = await apiClient.get<SubscriptionsResponse>('/subscriptions', {
    params: { status: 'active', limit: 1 },
  });
  return response.data.data.subscriptions[0] ?? null;
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
  const response = await apiClient.post<InitializeResponse>('/subscriptions?action=initialize', {
    package_id: packageId,
    callback_url: callbackUrl,
  });
  return response.data.data;
}

export async function cancelSubscription(subscriptionId: string): Promise<string> {
  const response = await apiClient.post<CancelResponse>(`/subscriptions?action=cancel&id=${subscriptionId}`);
  return response.data.data.message;
}

export async function refundSubscription(subscriptionId: string): Promise<string> {
  const response = await apiClient.post<RefundResponse>(`/subscriptions?action=refund&id=${subscriptionId}`);
  return response.data.data.message;
}

export async function changePlan(
  subscriptionId: string,
  newPackageId: string,
  callbackUrl: string,
): Promise<IInitializeResponse> {
  const response = await apiClient.post<ChangePlanResponse>(
    `/subscriptions?action=change-plan&id=${subscriptionId}`,
    {
      new_package_id: newPackageId,
      callback_url: callbackUrl,
    },
  );
  return response.data.data;
}
