import { countUploadsInWindow, countUploadsToday } from './activityLogger';

export interface RateLimitConfig {
  maxPerDay: number;
  maxPer10Minutes: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxPerDay: 10,
  maxPer10Minutes: 3,
};

/**
 * Check if user has exceeded upload rate limits.
 * Returns { allowed: boolean, reason?: string }
 */
export async function checkUploadRateLimit(userId: number, isAdmin: boolean = false): Promise<{ allowed: boolean; reason?: string }> {
  // Admins are exempt from rate limiting
  if (isAdmin) {
    return { allowed: true };
  }

  try {
    const config = DEFAULT_CONFIG;

    // Check 10-minute limit
    const uploadsIn10Min = await countUploadsInWindow(userId, 10);
    if (uploadsIn10Min >= config.maxPer10Minutes) {
      return {
        allowed: false,
        reason: `Upload limit reached. Max ${config.maxPer10Minutes} uploads per 10 minutes. Please try again later.`,
      };
    }

    // Check daily limit
    const uploadsToday = await countUploadsToday(userId);
    if (uploadsToday >= config.maxPerDay) {
      return {
        allowed: false,
        reason: `Daily upload limit reached. Max ${config.maxPerDay} uploads per day. Please try again tomorrow.`,
      };
    }

    return { allowed: true };
  } catch (error) {
    console.error('[RateLimiter] Error checking rate limit:', error);
    // On error, allow upload to proceed (fail open)
    return { allowed: true };
  }
}
