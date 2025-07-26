import jwtDecode from 'jwt-decode';
import { SessionData } from './types';

interface JWTPayload {
  exp: number;
  userId: number;
  firstName: string;
  lastName: string;
  tenantId: string;
  lastLogin: string;
  [key: string]: any;
}

export const validateToken = (token: string): JWTPayload => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    if (!decoded.exp || Date.now() >= decoded.exp * 1000) {
      throw new Error('Token expired');
    }
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const getTenantUrl = (tenantId: string): string => {
  const tenantMap: Record<string, string> = {
    'TMC Admin': 'admin.musafirbiz.com',
    'Org Admin': 'app.musafirbiz.com',
    'Agent': 'agent.musafirbiz.com',
    'JETT': 'jett.musafirbiz.com'
  };
  
  return tenantMap[tenantId] || tenantMap['Org Admin'];
};

export const storeSession = (storageType: string, session: SessionData | null) => {
  if (storageType === 'localStorage') {
    if (session) {
      localStorage.setItem('musafir_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('musafir_session');
    }
  } else if (storageType === 'sessionStorage') {
    if (session) {
      sessionStorage.setItem('musafir_session', JSON.stringify(session));
    } else {
      sessionStorage.removeItem('musafir_session');
    }
  }
};

export const loadSession = (storageType: string): SessionData | null => {
  try {
    const storedSession = 
      storageType === 'localStorage' ? localStorage.getItem('musafir_session') :
      storageType === 'sessionStorage' ? sessionStorage.getItem('musafir_session') :
      null;
    
    return storedSession ? JSON.parse(storedSession) : null;
  } catch {
    return null;
  }
};