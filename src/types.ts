export interface SessionData {
  jwt: string;
  decoded: {
    userId: number;
    firstName: string;
    lastName: string;
    tenantId: string;
    lastLogin: string;
    [key: string]: any;
  };
  lastActivity: Date;
}

export interface SessionConfig {
  tenantId?: string;
  loginServiceUrl?: string;
  tokenRefreshMargin?: number; // seconds
  storageType?: 'memory' | 'localStorage' | 'sessionStorage';
}

export interface ResolvedSessionConfig {
  tenantId: string;
  loginServiceUrl: string;
  tokenRefreshMargin: number;
  storageType: 'memory' | 'localStorage' | 'sessionStorage';
}

export interface SessionContextType {
  session: SessionData | null;
  isLoading: boolean;
  error: Error | null;
  initSession: (jwt: string) => Promise<void>;
  clearSession: () => void;
  refreshSession: () => Promise<void>;
  isAuthenticated: () => boolean;
  redirectToTenant: () => void;
}