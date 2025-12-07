/**
 * Override console methods to disable non-error logging in production
 */

if (typeof window !== 'undefined') {
  // Client-side override
  if (process.env.NODE_ENV === 'production') {
    console.log = () => {};
    console.info = () => {};
    console.warn = () => {};
    console.debug = () => {};
    // Keep console.error for production error tracking
  }
} else {
  // Server-side override
  if (process.env.NODE_ENV === 'production') {
    const originalLog = console.log;
    const originalInfo = console.info;
    const originalWarn = console.warn;
    const originalDebug = console.debug;

    console.log = () => {};
    console.info = () => {};
    console.warn = () => {};
    console.debug = () => {};
    // Keep console.error for production error tracking

    // Store originals in case they're needed for debugging
    (global as any).__originalConsole = {
      log: originalLog,
      info: originalInfo,
      warn: originalWarn,
      debug: originalDebug
    };
  }
}

export {};
