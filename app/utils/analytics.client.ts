"use client";
type AnalyticsEvent = {
  type: string;
  path?: string;
  url?: string;
  title?: string;
  timestamp: string;
  meta?: any;
};

async function sendToServer(event: AnalyticsEvent) {
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
      keepalive: true,
    });
  } catch (err) {
    // Non-blocking failure
    // eslint-disable-next-line no-console
    console.error('Analytics send failed', err);
  }
}

export function trackPageview(path: string) {
  if (!path) return;

  const event: AnalyticsEvent = {
    type: 'pageview',
    path,
    url: typeof window !== 'undefined' ? window.location.href : path,
    title: typeof document !== 'undefined' ? document.title : undefined,
    timestamp: new Date().toISOString(),
  };

  const body = JSON.stringify(event);

  if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
    try {
      // @ts-ignore
      navigator.sendBeacon('/api/analytics', body);
      return;
    } catch (e) {
      // fallback to fetch
    }
  }

  void sendToServer(event);
}

export function trackEvent(name: string, props?: any) {
  const event: AnalyticsEvent = {
    type: 'event',
    path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    timestamp: new Date().toISOString(),
    meta: { name, props },
  };

  const body = JSON.stringify(event);

  if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
    try {
      // @ts-ignore
      navigator.sendBeacon('/api/analytics', body);
      return;
    } catch (e) {
      // fallback
    }
  }

  void sendToServer(event);
}

export default { trackPageview, trackEvent };
