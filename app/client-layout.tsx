"use client";
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {AuthProvider} from "@/context/AuthContext.tsx";
import Loading from '@/_components/loading';
import { trackPageview } from '@/utils/analytics.client';

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
  const pathname = usePathname();

  useEffect(() => {
    try {
      trackPageview(pathname ?? window.location.pathname);
    } catch (e) {
      // swallow analytics errors
      console.error('trackPageview error', e);
    }
  }, [pathname]);

  useEffect(() => {
    const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
    if (!GA_ID || typeof gtag !== 'function') return;

    try {
      gtag('config', GA_ID, { page_path: pathname ?? window.location.pathname });
    } catch {
      // ignore analytics errors
    }
  }, [pathname]);

  return (
    <Loading isLoading={false}>
      {children}
    </Loading>
  );
}