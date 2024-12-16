import React from 'react';
import { Slot } from 'expo-router';
import AuthProvider from './components/AuthProvider';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
      <Toast/>
    </AuthProvider>
  );
}
