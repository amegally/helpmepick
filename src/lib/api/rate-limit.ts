import { RateLimiter } from 'limiter';

// Create a token bucket with 10 tokens that refills at a rate of 1 token per second
const limiter = new RateLimiter({
  tokensPerInterval: 10,
  interval: "second",
  fireImmediately: true,
});

export async function rateLimit() {
  return limiter;
} 