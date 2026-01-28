export type PermissionKey = 'psira_access' | 'firearm_access' | 'vehicle_access' | 'certificate_access' | 'drivers_access';

export interface IUserPermissions {
  psira_access: boolean;
  firearm_access: boolean;
  vehicle_access: boolean;
  certificate_access: boolean;
  drivers_access: boolean;
  active_subscriptions: number;
}

export type PackageType = 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'refunded';

export interface IAppPermissions {
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
  type: PackageType;
  permission_id: string;
  description: string | null;
  is_active: boolean;
  paystack_plan_code: string;
  app_permissions: IAppPermissions;
  created_at: string;
  updated_at: string;
}

export interface ISubscription {
  id: string;
  profile_id: string;
  package_id: string;
  start_date: string;
  end_date: string;
  status: SubscriptionStatus;
  app_packages: IPackage;
  created_at: string;
  updated_at: string;
}

export interface IInitializeResponse {
  authorization_url: string;
  reference: string;
  access_code: string;
}
