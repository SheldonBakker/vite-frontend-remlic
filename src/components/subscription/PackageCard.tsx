import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2 } from 'lucide-react';
import { getPricing } from '@/constants/pricing';
import type { IPackage } from '@/types/subscription';

interface PackageCardProps {
  pkg: IPackage;
  onSubscribe: (packageId: string)=> void;
  isLoading: boolean;
  isCurrentPlan?: boolean;
  hasActiveSubscription?: boolean;
}

export function PackageCard({
  pkg,
  onSubscribe,
  isLoading,
  isCurrentPlan = false,
  hasActiveSubscription = false,
}: PackageCardProps): React.JSX.Element {
  const permissions = pkg.app_permissions;
  const pricing = getPricing(pkg.type);
  const features = [
    { name: 'Firearms Management', enabled: permissions.firearm_access },
    { name: 'Vehicle Tracking', enabled: permissions.vehicle_access },
    { name: 'Certificate Management', enabled: permissions.certificate_access },
    { name: 'PSIRA Records', enabled: permissions.psira_access },
  ];

  return (
    <Card className={isCurrentPlan ? 'border-primary' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{pkg.package_name}</CardTitle>
            <CardDescription className="mt-1">
              {pkg.description ?? 'Subscription plan'}
            </CardDescription>
          </div>
          {isCurrentPlan && (
            <Badge>Current Plan</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{pricing.amount}</span>
          <span className="text-muted-foreground">/{pricing.period}</span>
        </div>

        <div className="space-y-2">
          {features.map((feature) => (
            <div
              key={feature.name}
              className={`flex items-center gap-2 text-sm ${
                feature.enabled ? '' : 'text-muted-foreground line-through'
              }`}
            >
              <Check
                className={`h-4 w-4 ${
                  feature.enabled ? 'text-primary' : 'text-muted-foreground'
                }`}
              />
              <span>{feature.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => onSubscribe(pkg.id)}
          disabled={isLoading || hasActiveSubscription}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : isCurrentPlan ? (
            'Current Plan'
          ) : hasActiveSubscription ? (
            'Subscription Active'
          ) : (
            'Subscribe'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
