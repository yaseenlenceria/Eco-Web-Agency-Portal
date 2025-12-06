import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSimpleAuth } from '../contexts/SimpleAuthContext';

const AuthDebug: React.FC = () => {
  // Try to use either auth system
  let authData, authSystem = 'None';

  try {
    authData = useAuth();
    authSystem = 'Convex + Firebase';
  } catch {
    try {
      authData = useSimpleAuth();
      authSystem = 'Firebase Only';
    } catch {
      // No auth system available
    }
  }

  const { user, loading, error, isAuthenticated } = authData || { user: null, loading: false, error: null, isAuthenticated: false };

  if (loading) {
    return <div className="p-4 bg-blue-50 text-blue-700 rounded">Loading authentication...</div>;
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg text-sm">
      <h3 className="font-semibold mb-2">Auth Status Debug:</h3>
      <div className="space-y-1">
        <p>Auth System: <span className="font-medium">{authSystem}</span></p>
        <p>Is Authenticated: {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
        {error && <p className="text-red-600">Error: {error}</p>}
        {user && (
          <div className="mt-2 p-2 bg-white rounded">
            <p>User ID: {user._id || user.uid}</p>
            <p>Email: {user.email}</p>
            <p>Name: {user.displayName || user.name || 'Not provided'}</p>
            <p>Role: {user.role || 'user'}</p>
            {(user.avatar || user.photoURL) && <p>Avatar: ✅ Available</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthDebug;