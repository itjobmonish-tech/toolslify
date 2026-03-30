const globalStore = globalThis.__toolslifyRateLimitStore || new Map();

if (!globalThis.__toolslifyRateLimitStore) {
  globalThis.__toolslifyRateLimitStore = globalStore;
}

export function checkRateLimit({ key, limit = 10, windowMs = 60000 }) {
  const now = Date.now();
  const current = globalStore.get(key) || [];
  const valid = current.filter((timestamp) => now - timestamp < windowMs);

  if (valid.length >= limit) {
    const retryAfterMs = windowMs - (now - valid[0]);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
    };
  }

  valid.push(now);
  globalStore.set(key, valid);

  return {
    allowed: true,
    remaining: Math.max(0, limit - valid.length),
    retryAfterSeconds: 0,
  };
}
