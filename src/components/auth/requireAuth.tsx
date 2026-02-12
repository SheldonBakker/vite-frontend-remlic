import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuthContext } from '@/context/authContext';
import type { AppRoles } from '@/types/auth';
import { Skeleton } from '@/components/ui/skeleton';

interface RequireAuthProps {
  children: ReactNode;
  allowedRoles?: AppRoles[];
}

export function RequireAuth({ children, allowedRoles }: RequireAuthProps): React.JSX.Element {
  const { isAuthenticated, authUser, isUserLoading } = useAuthContext();
  const location = useLocation();

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-sm space-y-4 p-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && authUser && !allowedRoles.includes(authUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
