import { Redis } from '@upstash/redis';
import { NextRequest } from 'next/server';
import { CustomError, ErrorType } from './custom-error';

// Initialize Redis connection from environment variables
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

// Define the structure of rate limit configuration
interface RateLimitConfig {
  limit: number; // Maximum number of requests allowed
  window: number; // Time window in milliseconds
}

// Default rate limit configuration
const defaultConfig: RateLimitConfig = {
  limit: parseInt(process.env.RATE_LIMIT || '10', 10), // Default to 10 requests
  window: parseInt(process.env.RATE_LIMIT_WINDOW || '60000', 10), // Default to 1 minute
};

/**
 * Rate limit middleware function
 * @param request - Incoming Next.js request
 * @param config - Rate limit configuration (optional)
 * @returns Promise with rate limit result
 */
export async function rateLimit(request: NextRequest, config: RateLimitConfig = defaultConfig) {
  const ip = request.headers.get('x-forwarded-for') || request.ip || '127.0.0.1'; // Get client IP
  const key = `ratelimit:${ip}`; // Redis key for the rate limit counter

  try {
    // Get the current count from Redis
    const current = await redis.get(key);
    const count = current ? parseInt(current, 10) : 0; // Parse current count or default to 0

    // Check if the limit has been exceeded
    if (count >= config.limit) {
      throw new CustomError(ErrorType.RateLimitExceeded, 'Rate limit exceeded'); // Throw custom error
    }

    // Increment the count and set expiry for the key if it’s the first request
    if (count === 0) {
      await redis.set(key, 1, { px: config.window }); // Set initial count and expiry
    } else {
      await redis.incr(key); // Increment count
    }

    // Return rate limit status
    return {
      success: true,
      remaining: config.limit - (count + 1), // Calculate remaining requests
      reset: new Date(Date.now() + config.window), // Calculate reset time
    };
  } catch (error) {
    console.error('Redis error:', error);
    throw new CustomError(ErrorType.InternalServerError, 'Internal server error');
  }
}

/**
 * Generate rate limit headers for the response
 * @param rateLimitResult - Result from the rateLimit function
 * @returns Object with rate limit headers
 */
export function getRateLimitHeaders(rateLimitResult: Awaited<ReturnType<typeof rateLimit>>) {
  return {
    'X-RateLimit-Limit': String(defaultConfig.limit), // Total requests allowed
    'X-RateLimit-Remaining': String(rateLimitResult.remaining), // Remaining requests
    'X-RateLimit-Reset': Math.ceil(rateLimitResult.reset.getTime() / 1000), // Reset time in seconds since epoch
    'X-RateLimit-Reset-Time': rateLimitResult.reset.toUTCString(), // Reset time in UTC
  };
}
