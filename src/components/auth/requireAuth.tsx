import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuthContext } from '@/context/authContext';
import type { AppRoles } from '@/types/auth';

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
        <div className="text-muted-foreground">Loading...</div>
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
