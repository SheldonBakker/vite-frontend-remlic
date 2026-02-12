import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  getExpiringRecords,
  type ExpiringRecord,
  type PaginationCursor,
  type ExpiringRecordsResponse,
  type RecordType,
  type SortOrder,
} from '@/api/services/dashboardApi';
import { useSubscriptionContext } from '@/context/subscriptionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, Calendar, AlertTriangle, Crosshair, Car, Shield, Award, ArrowUpDown, Clock, Lock } from 'lucide-react';
import { AxiosError } from 'axios';

const ITEMS_PER_PAGE = 20;

function encodeCursor(cursor: PaginationCursor): string {
  return btoa(JSON.stringify(cursor));
}

interface Filters {
  record_type: RecordType | null;
  sort_order: SortOrder;
  days_ahead: number;
  include_expired: boolean;
}

const recordTypeIcons: Record<RecordType, typeof Crosshair> = {
  firearms: Crosshair,
  vehicles: Car,
  psira_officers: Shield,
  certificates: Award,
};

const recordTypeLabels: Record<RecordType, string> = {
  firearms: 'Firearm',
  vehicles: 'Vehicle',
  psira_officers: 'PSIRA Officer',
  certificates: 'Certificate',
};

const recordTypeTabs: { value: RecordType; label: string; icon: typeof Crosshair }[] = [
  { value: 'firearms', label: 'Firearms', icon: Crosshair },
  { value: 'vehicles', label: 'Vehicles', icon: Car },
  { value: 'psira_officers', label: 'PSIRA', icon: Shield },
  { value: 'certificates', label: 'Certificates', icon: Award },
];

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getDaysUntilExpiry(expiryDate: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function ExpiringRecordCard({ record }: { record: ExpiringRecord }): React.JSX.Element {
  const daysUntil = useMemo(() => getDaysUntilExpiry(record.expiry_date), [record.expiry_date]);
  const isExpired = daysUntil < 0;
  const isExpiringSoon = daysUntil >= 0 && daysUntil <= 30;
  const Icon = recordTypeIcons[record.record_type];

  return (
    <Card className={isExpired ? 'border-destructive' : isExpiringSoon ? 'border-orange-500' : ''}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base font-medium">{record.name}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {recordTypeLabels[record.record_type]}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Identifier</span>
            <span className="font-mono text-xs">{record.identifier}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Expires
            </span>
            <span className={
              isExpired
                ? 'text-destructive font-medium'
                : isExpiringSoon
                  ? 'text-orange-500 font-medium'
                  : ''
            }>
              {formatDate(record.expiry_date)}
            </span>
          </div>
          {(isExpired || isExpiringSoon) && (
            <div className={`flex items-center gap-1 text-xs ${isExpired ? 'text-destructive' : 'text-orange-500'}`}>
              <AlertTriangle className="h-3 w-3" />
              {isExpired
                ? `Expired ${Math.abs(daysUntil)} day${Math.abs(daysUntil) !== 1 ? 's' : ''} ago`
                : `Expires in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ExpiringRecordCardSkeleton(): React.JSX.Element {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div>
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-8 w-12" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardPageContent(): React.JSX.Element {
  const [filters, setFilters] = useState<Filters>({
    record_type: 'firearms',
    sort_order: 'asc',
    days_ahead: 30,
    include_expired: true,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['expiring-records', filters],
    queryFn: async ({ pageParam }): Promise<ExpiringRecordsResponse> => {
      return getExpiringRecords({
        cursor: pageParam ? encodeCursor(pageParam) : undefined,
        limit: ITEMS_PER_PAGE,
        record_type: filters.record_type ?? undefined,
        sort_order: filters.sort_order,
        days_ahead: filters.days_ahead,
        include_expired: filters.include_expired,
      });
    },
    initialPageParam: null as PaginationCursor | null,
    getNextPageParam: (lastPage) => lastPage.pagination.nextCursor,
  });

  const handleRecordTypeChange = (value: RecordType): void => {
    setFilters((prev) => ({
      ...prev,
      record_type: value,
    }));
  };

  const toggleSortOrder = (): void => {
    setFilters((prev) => ({
      ...prev,
      sort_order: prev.sort_order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleDaysAheadChange = (value: string): void => {
    setFilters((prev) => ({
      ...prev,
      days_ahead: parseInt(value, 10),
    }));
  };

  const toggleIncludeExpired = (checked: boolean): void => {
    setFilters((prev) => ({
      ...prev,
      include_expired: checked,
    }));
  };

  const records = data?.pages.flatMap((page) => page.data.expiring_records) ?? [];

  const renderFilters = (): React.JSX.Element => (
    <div className="mb-6 space-y-4">
      {/* Record Type Filters */}
      <div className="flex flex-wrap gap-2">
        {recordTypeTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.value === filters.record_type;
          return (
            <Button
              key={tab.value}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleRecordTypeChange(tab.value)}
              className="gap-2"
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Advanced Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="days-ahead" className="text-sm">Days ahead</Label>
          <Select value={filters.days_ahead.toString()} onValueChange={handleDaysAheadChange}>
            <SelectTrigger id="days-ahead" className="w-30 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="14">14 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="60">60 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
              <SelectItem value="180">6 months</SelectItem>
              <SelectItem value="365">1 year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="include-expired"
            checked={filters.include_expired}
            onCheckedChange={toggleIncludeExpired}
          />
          <Label htmlFor="include-expired" className="text-sm cursor-pointer">
            Include expired
          </Label>
        </div>

        <div className="ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSortOrder}
            className="gap-2"
          >
            <ArrowUpDown className="h-4 w-4" />
            <span className="hidden sm:inline">
              {filters.sort_order === 'asc' ? 'Oldest first' : 'Newest first'}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Expirations</h2>
        {renderFilters()}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <ExpiringRecordCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    const errorMessage = error instanceof AxiosError
      ? error.response?.data?.error ?? error.message
      : error instanceof Error ? error.message : 'Failed to load expiring records';
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Expirations</h2>
        {renderFilters()}
        <div className="text-center py-8">
          <p className="text-destructive">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Expirations</h2>
      {renderFilters()}
      {records.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            No records found.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {records.map((record) => (
              <ExpiringRecordCard key={`${record.record_type}-${record.id}`} record={record} />
            ))}
          </div>
          {hasNextPage && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={() => void fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function DashboardPage(): React.JSX.Element {
  const { hasActiveSubscription, isLoading, hasInitialized } = useSubscriptionContext();

  if (!hasInitialized || isLoading) {
    return (
      <div>
        <Skeleton className="h-7 w-32 mb-4" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <ExpiringRecordCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!hasActiveSubscription) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Lock className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle>Subscription Required</CardTitle>
            <CardDescription>
              You need an active subscription to view your dashboard.
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

  return <DashboardPageContent />;
}
