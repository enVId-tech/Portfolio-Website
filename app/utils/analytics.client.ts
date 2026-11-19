"use client";
type AnalyticsEvent = {
  type: string;
  path?: string;
  url?: string;
  title?: string;
  timestamp: string;
  meta?: Record<string, unknown>;
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
    console.error('Analytics send failed', err);
  }
}

/** Prefer sendBeacon (survives page unloads) and fall back to fetch. */
function send(event: AnalyticsEvent) {
  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    try {
      if (navigator.sendBeacon('/api/analytics', JSON.stringify(event))) return;
    } catch {
      // fall through to fetch
    }
  }

  void sendToServer(event);
}

export function trackPageview(path: string) {
  if (!path) return;

  send({
    type: 'pageview',
    path,
    url: typeof window !== 'undefined' ? window.location.href : path,
    title: typeof document !== 'undefined' ? document.title : undefined,
    timestamp: new Date().toISOString(),
  });
}

export function trackEvent(name: string, props?: Record<string, unknown>) {
  send({
    type: 'event',
    path: typeof window !== 'undefined' ? window.location.pathname : undefined,
    timestamp: new Date().toISOString(),
    meta: { name, props },
  });
}

const analytics = { trackPageview, trackEvent };

export default analytics;
