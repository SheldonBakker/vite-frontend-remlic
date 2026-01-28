export type AppRoles = 'Admin' | 'User' | 'Guest';

export interface AuthUser {
  id: string;
  email: string;
  role: AppRoles;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  phone: string;
  password: string;
}
