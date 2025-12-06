import React from 'react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL || "http://localhost:3210");

export const ConvexClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
};