import { tokenCache } from '@/cache';
import { ClerkProvider } from '@clerk/clerk-expo';
import React from 'react';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

    if (!publishableKey) {
      throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file')
    }

  return (
    <ClerkProvider
      tokenCache={tokenCache} publishableKey={publishableKey}
    >
      {children}
    </ClerkProvider>
  );
};

export default AuthProvider;
