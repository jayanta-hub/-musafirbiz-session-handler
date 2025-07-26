import React, { useState } from 'react';
import { SessionProvider, useSession } from '../src';
import type { SessionConfig } from '../src';

// Mock JWT tokens for different tenants
const mockTokens = {
  'TMC Admin': {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3OTY5ODQwMDAsInVzZXJJZCI6MSwiZmlyc3ROYW1lIjoiQWRtaW4iLCJsYXN0TmFtZSI6IlVzZXIiLCJ0ZW5hbnRJZCI6IlRNQyBBZG1pbiIsImxhc3RMb2dpbiI6IjIwMjUtMDctMjZUMDY6MDA6MDBaIn0.fake-signature',
    user: 'Admin User (TMC Admin)'
  },
  'Org Admin': {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3OTY5ODQwMDAsInVzZXJJZCI6MiwiZmlyc3ROYW1lIjoiT3JnIiwibGFzdE5hbWUiOiJBZG1pbiIsInRlbmFudElkIjoiT3JnIEFkbWluIiwibGFzdExvZ2luIjoiMjAyNS0wNy0yNlQwNjowMDowMFoifQ.fake-signature',
    user: 'Org Admin (Organization)'
  },
  'Agent': {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3OTY5ODQwMDAsInVzZXJJZCI6MywiZmlyc3ROYW1lIjoiQWdlbnQiLCJsYXN0TmFtZSI6IlVzZXIiLCJ0ZW5hbnRJZCI6IkFnZW50IiwibGFzdExvZ2luIjoiMjAyNS0wNy0yNlQwNjowMDowMFoifQ.fake-signature',
    user: 'Agent User'
  },
  'JETT': {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3OTY5ODQwMDAsInVzZXJJZCI6NCwiZmlyc3ROYW1lIjoiSmV0dCIsImxhc3ROYW1lIjoiVXNlciIsInRlbmFudElkIjoiSkVUVCIsImxhc3RMb2dpbiI6IjIwMjUtMDctMjZUMDY6MDA6MDBaIn0.fake-signature',
    user: 'JETT User'
  }
};

const LoginComponent = () => {
  const { 
    session, 
    isLoading, 
    error, 
    initSession, 
    isAuthenticated, 
    clearSession,
    refreshSession
  } = useSession();
  
  const [selectedTenant, setSelectedTenant] = useState<keyof typeof mockTokens>('TMC Admin');
  const [autoRedirect, setAutoRedirect] = useState(false);

  const handleLogin = async () => {
    try {
      const mockData = mockTokens[selectedTenant];
      console.log(`Logging in as: ${mockData.user}`);
      await initSession(mockData.token);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleLogout = () => {
    clearSession();
    console.log('User logged out');
  };

  const handleRefresh = async () => {
    try {
      await refreshSession();
      console.log('Session refreshed');
    } catch (err) {
      console.error('Refresh failed:', err);
    }
  };

  const handleRedirect = () => {
    if (session) {
      const tenantUrl = getTenantUrl(session.decoded.tenantId);
      console.log(`Would redirect to: https://${tenantUrl}/login?code=${session.jwt}`);
      alert(`Would redirect to: https://${tenantUrl}`);
    }
  };

  // Simple tenant URL mapping for demo
  const getTenantUrl = (tenantId: string): string => {
    const tenantMap: Record<string, string> = {
      'TMC Admin': 'admin.musafirbiz.com',
      'Org Admin': 'app.musafirbiz.com',
      'Agent': 'agent.musafirbiz.com',
      'JETT': 'jett.musafirbiz.com'
    };
    return tenantMap[tenantId] || tenantMap['Org Admin'];
  };

  if (isLoading) return <div style={styles.loading}>Loading session...</div>;
  
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>MusafirBiz Session Handler Demo</h1>
      
      {error && (
        <div style={styles.error}>
          <strong>Error:</strong> {error.message}
        </div>
      )}
      
      {!isAuthenticated() ? (
        <div style={styles.loginSection}>
          <h2>Login</h2>
          
          <div style={styles.formGroup}>
            <label>Select Tenant:</label>
            <select 
              value={selectedTenant} 
              onChange={(e) => setSelectedTenant(e.target.value as keyof typeof mockTokens)}
              style={styles.select}
            >
              {Object.entries(mockTokens).map(([tenant, data]) => (
                <option key={tenant} value={tenant}>{data.user}</option>
              ))}
            </select>
          </div>
          
          <button onClick={handleLogin} style={styles.button}>
            Login as {mockTokens[selectedTenant].user}
          </button>
          
          <div style={styles.info}>
            <h3>Available Test Users:</h3>
            <ul>
              {Object.entries(mockTokens).map(([tenant, data]) => (
                <li key={tenant}>
                  <strong>{data.user}</strong> - Redirects to {getTenantUrl(tenant)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div style={styles.sessionSection}>
          <h2>Session Active</h2>
          
          <div style={styles.sessionInfo}>
            <h3>User Information:</h3>
            <p><strong>Name:</strong> {session?.decoded.firstName} {session?.decoded.lastName}</p>
            <p><strong>User ID:</strong> {session?.decoded.userId}</p>
            <p><strong>Tenant:</strong> {session?.decoded.tenantId}</p>
            <p><strong>Last Login:</strong> {session?.decoded.lastLogin}</p>
            <p><strong>Session Started:</strong> {session?.lastActivity.toLocaleString()}</p>
            <p><strong>Token Expires:</strong> {session ? new Date(session.decoded.exp * 1000).toLocaleString() : 'N/A'}</p>
          </div>
          
          <div style={styles.actions}>
            <button onClick={handleRefresh} style={styles.button} disabled={isLoading}>
              {isLoading ? 'Refreshing...' : 'Refresh Session'}
            </button>
            
            <button onClick={handleRedirect} style={styles.button}>
              Simulate Tenant Redirect
            </button>
            
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
          
          <div style={styles.tokenInfo}>
            <h3>JWT Token (First 50 chars):</h3>
            <code style={styles.code}>
              {session?.jwt.substring(0, 50)}...
            </code>
          </div>
        </div>
      )}
      
      <div style={styles.footer}>
        <p><em>This is a demo of the @musafirbiz/session-handler package</em></p>
        <p>Check the browser console for detailed logs</p>
      </div>
    </div>
  );
};

const App = () => {
  const [storageType, setStorageType] = useState<'memory' | 'localStorage' | 'sessionStorage'>('localStorage');
  
  const sessionConfig: SessionConfig = {
    loginServiceUrl: 'https://login.musafirbiz.com',
    tokenRefreshMargin: 300,
    storageType: storageType
  };

  return (
    <div>
      <div style={styles.configBar}>
        <label>Storage Type: </label>
        <select 
          value={storageType} 
          onChange={(e) => setStorageType(e.target.value as any)}
          style={styles.select}
        >
          <option value="memory">Memory (temporary)</option>
          <option value="localStorage">localStorage (persistent)</option>
          <option value="sessionStorage">sessionStorage (tab-scoped)</option>
        </select>
      </div>
      
      <SessionProvider config={sessionConfig}>
        <LoginComponent />
      </SessionProvider>
    </div>
  );
};

// Simple styles for the demo
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  configBar: {
    backgroundColor: '#f5f5f5',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '4px',
    textAlign: 'center' as const
  },
  title: {
    color: '#2c3e50',
    textAlign: 'center' as const,
    marginBottom: '30px'
  },
  loading: {
    textAlign: 'center' as const,
    padding: '20px',
    fontSize: '18px'
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '20px'
  },
  loginSection: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  sessionSection: {
    backgroundColor: '#e8f5e8',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  formGroup: {
    marginBottom: '15px'
  },
  select: {
    padding: '8px',
    marginLeft: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd'
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    margin: '5px'
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    margin: '5px'
  },
  sessionInfo: {
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '15px'
  },
  actions: {
    marginBottom: '15px'
  },
  tokenInfo: {
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '4px'
  },
  code: {
    backgroundColor: '#f1f1f1',
    padding: '5px',
    borderRadius: '3px',
    fontFamily: 'monospace'
  },
  info: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#e9ecef',
    borderRadius: '4px'
  },
  footer: {
    textAlign: 'center' as const,
    marginTop: '40px',
    padding: '20px',
    borderTop: '1px solid #ddd',
    color: '#666'
  }
};

export default App;
