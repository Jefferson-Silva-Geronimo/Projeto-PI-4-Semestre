import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { authService } from '../services/auth.service';
import { authStorage } from '../storage/authStorage';

import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
} from '../types/auth';

interface AuthContextData {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoadingSession: boolean;

  signIn(
    credentials: LoginCredentials
  ): Promise<LoginResponse>;

  signOut(): Promise<void>;

  refreshUser(): Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext =
  createContext<AuthContextData | undefined>(
    undefined
  );

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [
    isLoadingSession,
    setIsLoadingSession,
  ] = useState(true);

  const isAuthenticated = Boolean(user);

  const clearSession = useCallback(
    async (): Promise<void> => {
      try {
        await authStorage.removeToken();
      } finally {
        setUser(null);
      }
    },
    []
  );

  const refreshUser = useCallback(
    async (): Promise<void> => {
      const token = await authStorage.getToken();

      if (!token) {
        setUser(null);
        return;
      }

      try {
        const authenticatedUser =
          await authService.me(token);

        setUser(authenticatedUser);
      } catch {
        await clearSession();

        throw new Error(
          'A sessão não é mais válida.'
        );
      }
    },
    [clearSession]
  );

  const restoreSession = useCallback(
    async (): Promise<void> => {
      try {
        const token =
          await authStorage.getToken();

        if (!token) {
          setUser(null);
          return;
        }

        const authenticatedUser =
          await authService.me(token);

        setUser(authenticatedUser);
      } catch {
        await clearSession();
      } finally {
        setIsLoadingSession(false);
      }
    },
    [clearSession]
  );

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  const signIn = useCallback(
    async (
      credentials: LoginCredentials
    ): Promise<LoginResponse> => {
      const result = await authService.login({
        email: credentials.email
          .trim()
          .toLowerCase(),
        password: credentials.password,
      });

      try {
        await authStorage.saveToken(result.token);

        setUser(result.user);

        return result;
      } catch {
        await authStorage.removeToken();
        setUser(null);

        throw new Error(
          'Não foi possível armazenar a sessão.'
        );
      }
    },
    []
  );

  const signOut = useCallback(
    async (): Promise<void> => {
      await clearSession();
    },
    [clearSession]
  );

  const contextValue =
    useMemo<AuthContextData>(
      () => ({
        user,
        isAuthenticated,
        isLoadingSession,
        signIn,
        signOut,
        refreshUser,
      }),
      [
        user,
        isAuthenticated,
        isLoadingSession,
        signIn,
        signOut,
        refreshUser,
      ]
    );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}