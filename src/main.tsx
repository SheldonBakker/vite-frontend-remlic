import './index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/authContext';
import { ThemeProvider } from '@/context/themeContext';
import { SubscriptionProvider } from '@/context/subscriptionContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});
import MainLayout from '@/app/layout';
import DashboardLayout from '@/app/dashboard/layout';
import LandingPage from '@/app/landing/page';
import LoginPage from '@/app/auth/login/page';
import SignupPage from '@/app/auth/signup/page';
import ForgotPasswordPage from '@/app/auth/forgot-password/page';
import ResetPasswordPage from '@/app/auth/reset-password/page';
import DashboardPage from '@/app/dashboard/page';
import FirearmsPage from '@/app/dashboard/firearms/page';
import PsiraPage from '@/app/dashboard/psira/page';
import VehiclesPage from '@/app/dashboard/vehicles/page';
import CertificatesPage from '@/app/dashboard/certificates/page';
import DriversPage from '@/app/dashboard/drivers/page';
import ProfilePage from '@/app/profile/page';
import SettingsPage from '@/app/dashboard/settings/page';
import SubscriptionPage from '@/app/dashboard/subscription/page';
import SubscriptionCallbackPage from '@/app/dashboard/subscription/callback/page';
import PermissionsPage from '@/app/dashboard/admin/permissions/page';
import PackagesPage from '@/app/dashboard/admin/packages/page';
import SubscriptionsPage from '@/app/dashboard/admin/subscriptions/page';
import TermsPage from '@/app/legal/terms/page';
import PrivacyPage from '@/app/legal/privacy/page';
import { RequireGuest } from '@/components/auth/requireGuest';
import { RequireAuth } from '@/components/auth/requireAuth';
import RouteErrorElement from '@/components/errors/routeErrorElement';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <MainLayout>
        <Outlet />
      </MainLayout>
    ),
    errorElement: <RouteErrorElement />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'login',
        element: (
          <RequireGuest>
            <LoginPage />
          </RequireGuest>
        ),
      },
      {
        path: 'signup',
        element: (
          <RequireGuest>
            <SignupPage />
          </RequireGuest>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <RequireGuest>
            <ForgotPasswordPage />
          </RequireGuest>
        ),
      },
      {
        path: 'reset-password',
        element: <ResetPasswordPage />,
      },
      {
        path: 'terms',
        element: <TermsPage />,
      },
      {
        path: 'privacy',
        element: <PrivacyPage />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    errorElement: <RouteErrorElement />,
    children: [
      { index: true, Component: DashboardPage },
      { path: 'firearms', Component: FirearmsPage },
      { path: 'psira', Component: PsiraPage },
      { path: 'vehicles', Component: VehiclesPage },
      { path: 'certificates', Component: CertificatesPage },
      { path: 'drivers', Component: DriversPage },
      { path: 'profile', Component: ProfilePage },
      { path: 'settings', Component: SettingsPage },
      { path: 'subscription', Component: SubscriptionPage },
      { path: 'subscription/callback', Component: SubscriptionCallbackPage },
      {
        path: 'admin/permissions',
        element: (
          <RequireAuth allowedRoles={['Admin']}>
            <PermissionsPage />
          </RequireAuth>
        ),
      },
      {
        path: 'admin/packages',
        element: (
          <RequireAuth allowedRoles={['Admin']}>
            <PackagesPage />
          </RequireAuth>
        ),
      },
      {
        path: 'admin/subscriptions',
        element: (
          <RequireAuth allowedRoles={['Admin']}>
            <SubscriptionsPage />
          </RequireAuth>
        ),
      },
    ],
  },
]);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <RouterProvider router={router} />
            <Toaster />
          </SubscriptionProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
