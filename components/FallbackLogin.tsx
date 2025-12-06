import React, { useState } from 'react';

const FallbackLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      setMessage(`Registration for ${email} - Convex connection needed to complete`);
    } else {
      setMessage(`Login attempt for ${email} - Convex connection needed to complete`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Database Connection Issue</h2>
          <p className="mt-2 text-sm text-gray-600">
            Convex database is not connected properly
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm">
          <strong>Note:</strong> This is a fallback mode. Please check your Convex configuration.
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
          >
            {isRegistering ? 'Register' : 'Sign In'} (Demo)
          </button>
        </form>

        {message && (
          <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-3 rounded-lg text-sm">
            {message}
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-orange-600 hover:text-orange-500 text-sm font-medium"
          >
            {isRegistering ? 'Already have an account? Sign in' : 'Need an account? Register'}
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>To fix this issue:</p>
          <p>1. Run: <code className="bg-gray-200 px-1 rounded">npx convex dev</code></p>
          <p>2. Check VITE_CONVEX_URL in .env.local</p>
          <p>3. Ensure Convex is properly configured</p>
        </div>
      </div>
    </div>
  );
};

export default FallbackLogin;