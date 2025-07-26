import React, { createContext, useState, useEffect, useCallback } from 'react';
import { SessionContextType, SessionData, SessionConfig, ResolvedSessionConfig } from './types';
import { validateToken, storeSession, loadSession, getTenantUrl } from './utils';

export const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{
  config?: SessionConfig;
  children: React.ReactNode;
}> = ({ config = {}, children }) => {
  console.log('config', config)
  const defaultConfig: ResolvedSessionConfig = {
    tenantId: '',
    loginServiceUrl: 'https://login.musafirbiz.com',
    tokenRefreshMargin: 300, // 5 minutes
    storageType: 'memory',
    ...config
  };
  console.log('defaultConfig', defaultConfig)
  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTimer, setRefreshTimer] = useState<NodeJS.Timeout | null>(null);

  // Load session from storage on initial mount
  useEffect(() => {
    const initialize = async () => {
      try {
        if (defaultConfig.storageType !== 'memory') {
          const storedSession = loadSession(defaultConfig.storageType);
          console.log('storedSession', storedSession)
          if (storedSession) {
            validateToken(storedSession.jwt);
            setSession(storedSession);
            setupTokenRefresh(storedSession);
          }
        }
      } catch (err) {
        setError(err as Error);
        clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
    };
  }, []);

  const setupTokenRefresh = useCallback((sessionData: SessionData) => {
    if (refreshTimer) clearTimeout(refreshTimer);

    const expiresIn = (sessionData.decoded.exp * 1000) - Date.now();
    const refreshTime = expiresIn - (defaultConfig.tokenRefreshMargin * 1000);

    if (refreshTime > 0) {
      const timer = setTimeout(() => {
        refreshSession();
      }, refreshTime);
      setRefreshTimer(timer);
    }
  }, [refreshTimer]);

  const initSession = useCallback(async (jwt: string) => {
    try {
      setIsLoading(true);
      const decoded = validateToken(jwt);

      const newSession: SessionData = {
        jwt,
        decoded,
        lastActivity: new Date()
      };

      setSession(newSession);
      storeSession(defaultConfig.storageType, newSession);
      setupTokenRefresh(newSession);
      setError(null);
    } catch (err) {
      setError(err as Error);
      clearSession();
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [defaultConfig.storageType]);

  const refreshSession = useCallback(async () => {
    if (!session) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${defaultConfig.loginServiceUrl}/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.jwt}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const { token } = await response.json();
        await initSession(token);
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (err) {
      setError(err as Error);
      clearSession();
    } finally {
      setIsLoading(false);
    }
  }, [session, initSession]);

  const clearSession = useCallback(() => {
    setSession(null);
    storeSession(defaultConfig.storageType, null);
    if (refreshTimer) clearTimeout(refreshTimer);
    setRefreshTimer(null);
  }, [defaultConfig.storageType, refreshTimer]);

  const isAuthenticated = useCallback(() => {
    return !!session && (session.decoded.exp * 1000) > Date.now();
  }, [session]);

  const redirectToTenant = useCallback(() => {
    if (!session) return;

    const tenantUrl = getTenantUrl(session.decoded.tenantId);
    const redirectUrl = `https://${tenantUrl}/login?code=${session.jwt}`;

    if (typeof window !== 'undefined') {
      window.location.href = redirectUrl;
    }
  }, [session]);

  const contextValue: SessionContextType = {
    session,
    isLoading,
    error,
    initSession,
    clearSession,
    refreshSession,
    isAuthenticated,
    redirectToTenant
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};