// Admin domain type definitions
import type { PaginationCursor } from '@/api/types/shared';

export interface IPermission {
  id: string;
  permission_name: string;
  psira_access: boolean;
  firearm_access: boolean;
  vehicle_access: boolean;
  certificate_access: boolean;
  drivers_access: boolean;
  created_at: string;
  updated_at: string;
}

export interface IPackage {
  id: string;
  package_name: string;
  slug: string;
  type: 'monthly' | 'yearly';
  permission_id: string;
  description: string | null;
  is_active: boolean;
  paystack_plan_code?: string | null;
  created_at: string;
  updated_at: string;
  app_permissions?: IPermission;
}

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'refunded';

export interface ISubscription {
  id: string;
  profile_id: string;
  package_id: string;
  start_date: string;
  end_date: string;
  status: SubscriptionStatus;
  paystack_transaction_reference: string | null;
  paystack_subscription_code?: string | null;
  paystack_customer_code?: string | null;
  paystack_email_token?: string | null;
  current_period_end?: string | null;
  refunded_at: string | null;
  created_at: string;
  updated_at: string;
  app_packages?: IPackage;
}

// Request types
export interface CreatePermissionRequest {
  permission_name: string;
  psira_access: boolean;
  firearm_access: boolean;
  vehicle_access: boolean;
  certificate_access: boolean;
  drivers_access: boolean;
}

export interface UpdatePermissionRequest {
  permission_name?: string;
  psira_access?: boolean;
  firearm_access?: boolean;
  vehicle_access?: boolean;
  certificate_access?: boolean;
  drivers_access?: boolean;
}

export interface CreatePackageRequest {
  package_name: string;
  slug: string;
  type: 'monthly' | 'yearly';
  permission_id: string;
  description?: string | null;
}

export interface UpdatePackageRequest {
  package_name?: string;
  slug?: string;
  type?: 'monthly' | 'yearly';
  permission_id?: string;
  description?: string | null;
  is_active?: boolean;
}

export interface CreateSubscriptionRequest {
  profile_id: string;
  package_id: string;
  start_date: string;
  end_date: string;
}

export interface UpdateSubscriptionRequest {
  profile_id?: string;
  package_id?: string;
  start_date?: string;
  end_date?: string;
  status?: SubscriptionStatus;
}

// Response types
export interface PaginatedPermissionsResponse {
  success: boolean;
  data: {
    permissions: IPermission[];
  };
  pagination: {
    nextCursor: PaginationCursor | null;
  };
  timestamp: string;
  statusCode: number;
}

export interface PaginatedPackagesResponse {
  success: boolean;
  data: {
    packages: IPackage[];
  };
  pagination: {
    nextCursor: PaginationCursor | null;
  };
  timestamp: string;
  statusCode: number;
}

export interface PaginatedSubscriptionsResponse {
  success: boolean;
  data: {
    subscriptions: ISubscription[];
  };
  pagination: {
    nextCursor: PaginationCursor | null;
  };
  timestamp: string;
  statusCode: number;
}

export interface SinglePermissionResponse {
  success: boolean;
  data: {
    permission: IPermission;
  };
  timestamp: string;
  statusCode: number;
}

export interface SinglePackageResponse {
  success: boolean;
  data: {
    package: IPackage;
  };
  timestamp: string;
  statusCode: number;
}

export interface SingleSubscriptionResponse {
  success: boolean;
  data: {
    subscription: ISubscription;
  };
  timestamp: string;
  statusCode: number;
}

export interface DeleteResponse {
  success: boolean;
  data: {
    message: string;
  };
  timestamp: string;
  statusCode: number;
}
