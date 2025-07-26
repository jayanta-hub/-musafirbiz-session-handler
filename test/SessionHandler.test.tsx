import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { SessionProvider, useSession } from '../src';

// Mock jwt-decode
jest.mock('jwt-decode', () => jest.fn(() => ({
  exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
  tenantId: 'TMC Admin',
  userId: 123
})));

describe('SessionProvider', () => {
  it('should initialize with empty session', async () => {
    const TestComponent = () => {
      const { session, isLoading } = useSession();
      
      if (isLoading) return <div>Loading...</div>;
      return <div>{session ? 'Logged In' : 'Logged Out'}</div>;
    };

    const { getByText } = render(
      <SessionProvider>
        <TestComponent />
      </SessionProvider>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(getByText('Logged Out')).toBeInTheDocument();
    });
  });

  it('should initialize session with valid JWT', async () => {
    const TestComponent = () => {
      const { session, initSession, isLoading } = useSession();
      const [initialized, setInitialized] = React.useState(false);

      React.useEffect(() => {
        if (!initialized) {
          initSession('test.jwt.token').then(() => {
            setInitialized(true);
          });
        }
      }, [initSession, initialized]);

      if (isLoading) return <div>Loading...</div>;
      return <div>{session ? 'Logged In' : 'Logged Out'}</div>;
    };

    const { getByText } = render(
      <SessionProvider>
        <TestComponent />
      </SessionProvider>
    );

    // Wait for the session to be initialized
    await waitFor(() => {
      expect(getByText('Logged In')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
