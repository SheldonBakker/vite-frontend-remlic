import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export type RecordCardSkeletonPreset = 'firearm' | 'certificate' | 'vehicle' | 'psira';

interface RecordCardSkeletonProps {
  preset?: RecordCardSkeletonPreset;
  rows?: number;
  showIcon?: boolean;
  iconRounded?: boolean;
}

const presetConfig: Record<RecordCardSkeletonPreset, { rows: number; showIcon: boolean; iconRounded: boolean }> = {
  firearm: { rows: 3, showIcon: false, iconRounded: false },
  certificate: { rows: 3, showIcon: true, iconRounded: false },
  vehicle: { rows: 3, showIcon: true, iconRounded: false },
  psira: { rows: 4, showIcon: true, iconRounded: true },
};

export function RecordCardSkeleton({
  preset,
  rows,
  showIcon,
  iconRounded,
}: RecordCardSkeletonProps): React.JSX.Element {
  const config = preset ? presetConfig[preset] : undefined;
  const finalRows = rows ?? config?.rows ?? 3;
  const finalShowIcon = showIcon ?? config?.showIcon ?? true;
  const finalIconRounded = iconRounded ?? config?.iconRounded ?? false;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          {finalShowIcon && (
            <Skeleton className={`h-8 w-8 ${finalIconRounded ? 'rounded-full' : ''}`} />
          )}
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-8 w-8 rounded" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Array.from({ length: finalRows }).map((_, index) => (
            <div key={index} className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function FirearmCardSkeleton(): React.JSX.Element {
  return <RecordCardSkeleton preset="firearm" />;
}

export function CertificateCardSkeleton(): React.JSX.Element {
  return <RecordCardSkeleton preset="certificate" />;
}

export function VehicleCardSkeleton(): React.JSX.Element {
  return <RecordCardSkeleton preset="vehicle" />;
}

export function PsiraCardSkeleton(): React.JSX.Element {
  return <RecordCardSkeleton preset="psira" />;
}
