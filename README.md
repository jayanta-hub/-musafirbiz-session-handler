# @musafirbiz/session-handler

A React session management library for MusafirBiz multi-tenant applications with JWT authentication.

## Features

- 🔐 **JWT Authentication** - Secure token-based authentication
- 🏢 **Multi-tenant Support** - Built-in tenant routing and management
- 💾 **Flexible Storage** - Memory, localStorage, or sessionStorage options
- 🔄 **Auto Token Refresh** - Automatic session renewal before expiry
- ⚡ **React Hooks** - Modern React API with TypeScript support
- 🛡️ **Type Safe** - Full TypeScript definitions included
- 🧪 **Well Tested** - Comprehensive test coverage

## Installation

```bash
npm install @musafirbiz/session-handler
```

## Quick Start

### 1. Wrap your app with SessionProvider

```typescript
import React from 'react';
import { SessionProvider } from '@musafirbiz/session-handler';
import App from './App';

function Root() {
  return (
    <SessionProvider config={{ storageType: 'localStorage' }}>
      <App />
    </SessionProvider>
  );
}

export default Root;
```

### 2. Use the session in your components

```typescript
import React from 'react';
import { useSession } from '@musafirbiz/session-handler';

function LoginComponent() {
  const { 
    session, 
    isLoading, 
    error, 
    initSession, 
    isAuthenticated, 
    clearSession 
  } = useSession();

  const handleLogin = async (jwt: string) => {
    try {
      await initSession(jwt);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (isAuthenticated()) {
    return (
      <div>
        <h2>Welcome, {session?.decoded.firstName}!</h2>
        <button onClick={clearSession}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Please Login</h2>
      {/* Your login form here */}
    </div>
  );
}
```

## How to Test This Package

### Method 1: Run the Interactive Demo

```bash
# Clone/navigate to the package directory
cd path/to/musafirbiz-session-handler

# Install dependencies
npm install

# Build the package
npm run build

# Run tests
npm test
```

The demo app in `example/App.tsx` provides:
- Multiple tenant login options
- Session information display
- Storage type switching
- Token refresh testing
- Error handling demonstration

### Method 2: Create a Test React App

```bash
# Create a new React app
npx create-react-app my-session-test
cd my-session-test

# Install the package
npm install @musafirbiz/session-handler

# Replace src/App.js with your test code
```

### Method 3: Local Package Testing

```bash
# In the package directory
npm pack

# This creates a .tgz file like:
# musafirbiz-session-handler-1.0.0.tgz

# In your test project
npm install ./path/to/musafirbiz-session-handler-1.0.0.tgz
```

## API Reference

### SessionProvider Props

```typescript
interface SessionConfig {
  tenantId?: string;                    // Optional tenant identifier
  loginServiceUrl?: string;             // Auth service URL
  tokenRefreshMargin?: number;          // Seconds before expiry to refresh
  storageType?: 'memory' | 'localStorage' | 'sessionStorage';
}
```

### useSession Hook

```typescript
const {
  session,          // Current session data
  isLoading,        // Loading state
  error,            // Error state
  initSession,      // Initialize session with JWT
  clearSession,     // Clear current session
  refreshSession,   // Refresh current session
  isAuthenticated,  // Check if authenticated
  redirectToTenant  // Redirect to tenant portal
} = useSession();
```

## Supported Tenants

- **TMC Admin** → `admin.musafirbiz.com`
- **Org Admin** → `app.musafirbiz.com`
- **Agent** → `agent.musafirbiz.com`
- **JETT** → `jett.musafirbiz.com`

## Configuration Examples

### Memory Storage (Default)
```typescript
<SessionProvider config={{ storageType: 'memory' }}>
  <App />
</SessionProvider>
```

### Persistent Storage
```typescript
<SessionProvider config={{ 
  storageType: 'localStorage',
  tokenRefreshMargin: 300,
  loginServiceUrl: 'https://your-auth-service.com'
}}>
  <App />
</SessionProvider>
```

## Development

### Scripts

- `npm run build` - Build the package
- `npm run dev` - Build in watch mode
- `npm test` - Run tests
- `npm run prepare` - Pre-publish build

### Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## TypeScript Support

Full TypeScript definitions are included:

```typescript
import type { 
  SessionConfig, 
  SessionData, 
  SessionContextType 
} from '@musafirbiz/session-handler';
```

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

---

For detailed usage examples and advanced configurations, see [USAGE.md](./USAGE.md).
