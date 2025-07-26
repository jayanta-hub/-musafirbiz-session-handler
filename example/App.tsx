import React from 'react';
import { SessionProvider, useSession } from '../src';

const LoginPage = () => {
  const { 
    session, 
    isLoading, 
    error, 
    initSession, 
    isAuthenticated, 
    redirectToTenant 
  } = useSession();

  const handleLogin = async () => {
    try {
      // Mock JWT token - in real app, get this from your auth API
      const mockJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      await initSession(mockJWT);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  if (isLoading) return <div>Loading session...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (isAuthenticated()) {
    redirectToTenant();
    return <div>Redirecting to tenant portal...</div>;
  }

  return (
    <div>
      <h1>MusafirBiz Login</h1>
      <button onClick={handleLogin}>Login with Mock Token</button>
    </div>
  );
};

const App = () => (
  <SessionProvider config={{ storageType: 'localStorage' }}>
    <LoginPage />
  </SessionProvider>
);

export default App;