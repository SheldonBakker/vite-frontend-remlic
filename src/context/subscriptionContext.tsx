import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { useAuthContext } from './authContext';
import { getMyPermissions } from '@/api/services/subscriptionApi';
import type { IUserPermissions, PermissionKey } from '@/types/subscription';

interface SubscriptionContextType {
  permissions: IUserPermissions | null;
  isLoading: boolean;
  error: string | null;
  hasInitialized: boolean;
  hasPermission: (permission: PermissionKey)=> boolean;
  hasActiveSubscription: boolean;
  refreshPermissions: ()=> Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const { isAuthenticated, isUserLoading, authUser } = useAuthContext();
  const [permissions, setPermissions] = useState<IUserPermissions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const isAdmin = useMemo(() => {
    return authUser?.role === 'Admin';
  }, [authUser]);

  const fetchPermissions = useCallback(async (): Promise<void> => {
    if (!isAuthenticated) {
      setPermissions(null);
      setHasInitialized(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getMyPermissions();
      setPermissions(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch permissions';
      setError(message);
      setPermissions(null);
    } finally {
      setIsLoading(false);
      setHasInitialized(true);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isUserLoading) {
      if (isAuthenticated) {
        void fetchPermissions();
      } else {
        setPermissions(null);
        setHasInitialized(true);
      }
    }
  }, [isAuthenticated, isUserLoading, fetchPermissions]);

  const hasPermission = useCallback((permission: PermissionKey): boolean => {
    if (isAdmin) {
      return true;
    }

    if (!permissions) {
      return false;
    }
    return permissions[permission] === true;
  }, [permissions, isAdmin]);

  const hasActiveSubscription = useMemo(() => {
    if (isAdmin) {
      return true;
    }

    return (permissions?.active_subscriptions ?? 0) > 0;
  }, [permissions, isAdmin]);

  const refreshPermissions = useCallback(async (): Promise<void> => {
    await fetchPermissions();
  }, [fetchPermissions]);

  const value = useMemo(
    () => ({
      permissions,
      isLoading,
      error,
      hasInitialized,
      hasPermission,
      hasActiveSubscription,
      refreshPermissions,
    }),
    [permissions, isLoading, error, hasInitialized, hasPermission, hasActiveSubscription, refreshPermissions],
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptionContext(): SubscriptionContextType {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscriptionContext must be used within a SubscriptionProvider');
  }
  return context;
}
