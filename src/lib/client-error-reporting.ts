// Generic client-side error reporting. Currently just logs to the console —
// swap this out for Sentry (or another provider) if/when you want tracking.
export function reportClientError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  console.error(error, {
    route: window.location.pathname,
    ...context,
  });
}
