import React, { useState, useEffect } from 'react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';

let convexClient: ConvexReactClient | null = null;

const getConvexClient = () => {
  if (!convexClient) {
    const convexUrl = import.meta.env.VITE_CONVEX_URL;
    if (!convexUrl) {
      console.warn('VITE_CONVEX_URL not found, using localhost');
    }
    convexClient = new ConvexReactClient(convexUrl || "http://localhost:3210");
  }
  return convexClient;
};

export const ConvexClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<ConvexReactClient | null>(null);

  useEffect(() => {
    try {
      const convex = getConvexClient();
      setClient(convex);
    } catch (error) {
      console.error('Failed to initialize Convex client:', error);
    }
  }, []);

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Initializing database...</p>
        </div>
      </div>
    );
  }

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
};