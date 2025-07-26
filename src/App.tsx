import React from 'react';
import { SessionProvider } from './SessionProvider';
import { useSession } from './useSession';

const App = () => {
  return (
    <SessionProvider config={{ storageType: 'localStorage' }}>
      <LoginComponent />
    </SessionProvider>
  );
};

const LoginComponent = () => {
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
      // In a real app, you would get this from your login API
      const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; 
      await initSession(jwtToken);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (isAuthenticated()) {
    redirectToTenant();
    return null;
  }

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default App;