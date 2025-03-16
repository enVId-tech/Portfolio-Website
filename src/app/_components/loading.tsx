"use client"

import React, { useEffect, useState } from 'react';
import styles from '@/styles/loading.module.scss';

interface LoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
}

export default function Loading({ isLoading, children }: LoadingProps) {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsFading(true);
      // Keep the loader visible during fade animation
      const fadeTimer = setTimeout(() => {
        setIsFading(false);
      }, 500); // Match this with CSS transition duration
      return () => clearTimeout(fadeTimer);
    }
  }, [isLoading]);

  return (
    <>
      {(isLoading || isFading) && (
        <div className={`${styles.loadingOverlay} ${isFading ? styles.fadeOut : ''}`}>
          <div className={styles.loadingContent}>
            <div className={styles.dotContainer}>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
            </div>
          </div>
        </div>
      )}
      {children}
    </>
  );
}