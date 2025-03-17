"use client";
import React from 'react';
import {AuthProvider} from "@/context/AuthContext.tsx";
import Loading from '@/app/_components/loading';

interface State {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: State) {
  return (
    <NavigationManager>
      <AuthProvider>
        {children}
      </AuthProvider>
    </NavigationManager>
  );
}

function NavigationManager({ children }: State) {
  return (
    <Loading isLoading={false}>
      {children}
    </Loading>
  );
}