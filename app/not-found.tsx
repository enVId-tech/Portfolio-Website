"use client"

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/notFound.module.scss';
import DotBackground from "@/_components/dotbackground";

export default function NotFound(): React.ReactElement {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const redirectTimeout = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(redirectTimeout);
  }, [router]);

  return (
    <DotBackground config={{
      spacingBetweenDots: 40,
      dotSize: 1.2,
      dotColor: 'rgb(200, 200, 255)',
      dotOpacity: 0.3,
      maxDistance: 150,
      friction: 0.8,
    }}>
      <div className={styles.notFoundContainer}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.message}>Oops! Page not found.</p>
        <p className={styles.redirectMessage}>
          Redirecting to homepage in 5 seconds...
        </p>
        <button
          onClick={() => router.push('/')}
          className={styles.homeButton}
        >
          Return to Homepage Now
        </button>
      </div>
    </DotBackground>
  );
}