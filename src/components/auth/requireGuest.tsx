import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuthContext } from '@/context/authContext';

interface RequireGuestProps {
  children: ReactNode;
}

export function RequireGuest({ children }: RequireGuestProps): React.JSX.Element {
  const { isAuthenticated, isUserLoading } = useAuthContext();

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
