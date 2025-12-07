"use client"

import React from 'react';
import styles from '@/styles/loading.module.scss';

// Simplified loading component for lazy-loaded sections
export default function SimpleLoading() {
  return (
    <div className={styles.loadingContent} style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className={styles.dotContainer}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
    </div>
  );
}
