// Simple fixed-window rate limiter backed by Cloudflare KV (free tier).
// Not perfectly precise under heavy concurrency, but more than enough to
// stop a bot or scraper from draining your AI Gateway credits.

export type RateLimitKV = {
  get: (key: string) => Promise<string | null>;
  put: (key: string, value: string, opts?: { expirationTtl?: number }) => Promise<void>;
};

const WINDOW_SECONDS = 60 * 60; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 10;

export async function checkRateLimit(
  kv: RateLimitKV | undefined,
  identifier: string,
): Promise<{ allowed: boolean; remaining: number }> {
  // If the KV binding isn't set up yet, fail open rather than breaking chat 
  // but this means the endpoint is unprotected, so set up the binding ASAP.
  if (!kv) return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW };

  const key = `ratelimit:chat:${identifier}`;
  const current = await kv.get(key);
  const count = current ? parseInt(current, 10) : 0;

  if (count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }

  await kv.put(key, String(count + 1), { expirationTtl: WINDOW_SECONDS });
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - count - 1 };
}
