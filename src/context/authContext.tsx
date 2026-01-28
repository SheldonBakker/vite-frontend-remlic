import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/api/supabaseClient';
import { signup as signupApi } from '@/api/authApi';
import type { AppRoles, AuthUser, SignupData } from '@/types/auth';

interface AuthContextType {
  authUser: AuthUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isUserLoading: boolean;
  login: (email: string, password: string)=> Promise<void>;
  signup: (data: SignupData)=> Promise<string>;
  logout: ()=> Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [session, setSession] = useState<Session | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  const extractUserFromSession = useCallback((session: Session | null): AuthUser | null => {
    if (!session?.access_token) {
      return null;
    }

    const parts = session.access_token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(atob(parts[1])) as {
      sub: string;
      email?: string;
      app_metadata?: { role?: AppRoles };
    };

    return {
      id: payload.sub,
      email: payload.email ?? '',
      role: payload.app_metadata?.role ?? 'Guest',
    };
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setAuthUser(extractUserFromSession(session));
        setIsUserLoading(false);
      },
    );

    void supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthUser(extractUserFromSession(session));
      setIsUserLoading(false);
    });

    return (): void => {
      subscription.unsubscribe();
    };
  }, [extractUserFromSession]);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
  }, []);

  const signup = useCallback(async (data: SignupData): Promise<string> => {
    return signupApi({
      email: data.email,
      phone: data.phone,
      password: data.password,
    });
  }, []);

  const logout = useCallback(async (): Promise<void> => {

    try {
      await supabase.auth.signOut({ scope: 'local' });
    } catch {
    }
    setSession(null);
    setAuthUser(null);
  }, []);

  const value = useMemo(
    () => ({
      authUser,
      session,
      isAuthenticated: !!session,
      isUserLoading,
      login,
      signup,
      logout,
    }),
    [authUser, session, isUserLoading, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
