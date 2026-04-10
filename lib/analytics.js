export function trackEvent(eventName, payload = {}) {
  if (typeof window === "undefined") return;

  const body = JSON.stringify({
    event: eventName,
    payload,
    path: window.location.pathname,
    timestamp: new Date().toISOString(),
  });

  const blob = new Blob([body], { type: "application/json" });

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics", blob);
    return;
  }

  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Ignore analytics failures to keep UX uninterrupted.
  });
}
