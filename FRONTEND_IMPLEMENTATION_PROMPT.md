# Frontend Google Login Implementation Prompt

You are tasked with implementing Google OAuth 2.0 authentication on the frontend of the Parcel Delivery System. Here's what needs to be done:

## Prerequisites
✅ Backend API running with Google OAuth endpoints
✅ Backend returns JWT token on successful login
✅ Backend running at: `http://localhost:5000/api/v1`
✅ Google OAuth credentials obtained from Google Cloud Console

## Your Task: Implement Frontend Google Login

### Step 1: Setup Google OAuth on Frontend

#### Option A: Using Google Sign-In Library (Recommended)
```html
<!-- Add to your HTML <head> -->
<script src="https://accounts.google.com/gapi/client:platform.js" async defer></script>
<meta name="google-signin-client_id" content="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com">
```

#### Option B: Create Environment Variables
Create `.env.local` file:
```env
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
```

### Step 2: Implement Login Component

#### For React Users
Create `src/components/GoogleLogin.jsx`:
```jsx
import React from 'react';

export default function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = 'http://localhost:5000/api/v1/auth/google';
  };

  return (
    <button onClick={handleGoogleLogin} className="google-login-btn">
      Sign in with Google
    </button>
  );
}
```

#### For Vue Users
Create `src/components/GoogleLogin.vue`:
```vue
<template>
  <button @click="handleGoogleLogin" class="google-login-btn">
    Sign in with Google
  </button>
</template>

<script>
export default {
  methods: {
    handleGoogleLogin() {
      window.location.href = 'http://localhost:5000/api/v1/auth/google';
    }
  }
}
</script>
```

#### For Angular Users
Create `google-login.component.ts`:
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-google-login',
  template: `
    <button (click)="handleGoogleLogin()" class="google-login-btn">
      Sign in with Google
    </button>
  `
})
export class GoogleLoginComponent {
  handleGoogleLogin() {
    window.location.href = 'http://localhost:5000/api/v1/auth/google';
  }
}
```

### Step 3: Handle OAuth Callback

After user authorizes, backend redirects to callback. Handle the redirect:

#### React - Using useEffect
```jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a token in the response
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      localStorage.setItem('accessToken', token);
      navigate('/dashboard');
    }
  }, [navigate]);

  return <div>Redirecting...</div>;
}
```

#### Vanilla JavaScript
```javascript
// On your callback page
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (token) {
  localStorage.setItem('accessToken', token);
  window.location.href = '/dashboard';
} else {
  console.error('No token received from backend');
  window.location.href = '/login';
}
```

### Step 4: Store and Manage JWT Token

#### Create Auth Service/Store
```javascript
// authService.js
class AuthService {
  saveToken(token) {
    localStorage.setItem('accessToken', token);
  }

  getToken() {
    return localStorage.getItem('accessToken');
  }

  saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();
```

### Step 5: Add Token to API Requests

#### Using Fetch with Interceptor
```javascript
// apiClient.js
const apiClient = async (url, options = {}) => {
  const token = localStorage.getItem('accessToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
  }

  return response.json();
};

export default apiClient;
```

#### Using Axios with Interceptor
```javascript
// axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/v1'
});

// Add token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

#### For React with Custom Hook
```javascript
// useApi.js
import { useEffect, useState } from 'react';

export function useApi(url, method = 'GET') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      
      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('API request failed');
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, method]);

  return { data, loading, error };
}
```

### Step 6: Create Login Page

#### React Example
```jsx
import React, { useState } from 'react';
import GoogleLoginButton from '../components/GoogleLogin';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        window.location.href = '/dashboard';
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Sign in to Parcel Delivery</h1>

      <form onSubmit={handleCredentialsLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      <div className="divider">OR</div>

      <GoogleLoginButton />
    </div>
  );
}
```

### Step 7: Create Protected Routes

#### React Router Example
```jsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
```

#### Usage
```jsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
</Routes>
```

### Step 8: Implement Logout

```javascript
function handleLogout() {
  // Clear tokens
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');

  // Optional: Revoke Google session
  if (window.google) {
    google.accounts.id.revoke(
      localStorage.getItem('userEmail'),
      () => console.log('Google session revoked')
    );
  }

  // Redirect to login
  window.location.href = '/login';
}
```

### Step 9: Display User Info

```jsx
function UserProfile() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="profile">
      {user.picture && <img src={user.picture} alt={user.name} />}
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
```

### Step 10: Test the Complete Flow

#### Testing Checklist
- [ ] Click "Sign in with Google"
- [ ] Redirect to Google consent screen
- [ ] Select Google account
- [ ] Backend receives authorization
- [ ] Redirected back to frontend
- [ ] Token stored in localStorage
- [ ] User info displayed correctly
- [ ] Protected routes accessible
- [ ] API requests include token
- [ ] Logout clears token

#### Manual Testing
```bash
# Check token in console
javascript: console.log(localStorage.getItem('accessToken'))

# Check user data
javascript: console.log(JSON.parse(localStorage.getItem('user')))

# Test API with token
fetch('http://localhost:5000/api/v1/parcels', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
}).then(r => r.json()).then(d => console.log(d))
```

### Step 11: Add Styling (Optional)

```css
.google-login-btn {
  background: white;
  border: 1px solid #ddd;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s;
  width: 100%;
  margin-top: 10px;
}

.google-login-btn:hover {
  background: #f9f9f9;
  border-color: #bbb;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.divider {
  text-align: center;
  margin: 20px 0;
  color: #999;
}
```

## Expected Response from Backend

After successful Google authorization, the response will be:

```json
{
  "success": true,
  "StatusCodes": 200,
  "message": "Google login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@gmail.com",
      "name": "John Doe",
      "picture": "https://lh3.googleusercontent.com/...",
      "role": "SENDER"
    }
  }
}
```

## Common Implementation Patterns

### State Management with Redux
```javascript
// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('accessToken'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  }
});

export default authSlice.reducer;
```

### Using Context API
```javascript
// AuthContext.js
import { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('accessToken'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (accessToken, userData) => {
    setToken(accessToken);
    setUser(userData);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

## Error Handling

### Handle Different Error Scenarios
```javascript
const handleLoginError = (error) => {
  if (error.message === 'Redirect URI mismatch') {
    console.error('Check GOOGLE_CALLBACK_URL in backend');
  } else if (error.message === 'Client not found') {
    console.error('Check GOOGLE_CLIENT_ID');
  } else if (error.status === 401) {
    console.error('Invalid credentials');
  } else if (error.status === 500) {
    console.error('Server error');
  }
};
```

## Security Best Practices

✅ Store token in httpOnly cookie (not localStorage in production)
✅ Validate token on backend for every request
✅ Implement token refresh mechanism
✅ HTTPS only in production
✅ CORS properly configured
✅ Never expose sensitive data in frontend

## Success Criteria

✅ Google login button visible
✅ Clicking redirects to Google
✅ User can authorize app
✅ Backend callback receives authorization
✅ Frontend receives JWT token
✅ Token stored securely
✅ Protected routes work with token
✅ Logout clears token
✅ All pages display correctly

---

**Ready to connect frontend and backend!**
