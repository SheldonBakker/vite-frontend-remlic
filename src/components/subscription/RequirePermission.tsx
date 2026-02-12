import { Link } from 'react-router-dom';
import { useSubscriptionContext } from '@/context/subscriptionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { RecordCardSkeleton } from '@/components/skeletons/RecordCardSkeleton';
import type { PermissionKey } from '@/types/subscription';

interface RequirePermissionProps {
  permission: PermissionKey;
  children: React.ReactNode;
}

const permissionLabels: Record<PermissionKey, string> = {
  psira_access: 'PSIRA Records',
  firearm_access: 'Firearms',
  vehicle_access: 'Vehicles',
  certificate_access: 'Certificates',
  drivers_access: 'Drivers',
};

export function RequirePermission({ permission, children }: RequirePermissionProps): React.JSX.Element {
  const { hasPermission, isLoading, hasInitialized } = useSubscriptionContext();

  if (!hasInitialized || isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <RecordCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!hasPermission(permission)) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Lock className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle>Subscription Required</CardTitle>
            <CardDescription>
              You need an active subscription to access {permissionLabels[permission]}.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild>
              <Link to="/dashboard/subscription">View Subscription Plans</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
