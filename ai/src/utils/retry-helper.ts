/**
 * Retry helper with exponential backoff for API calls
 * Handles rate limiting and transient errors
 */

export interface RetryOptions {
  maxRetries?: number
  initialDelay?: number
  maxDelay?: number
  backoffMultiplier?: number
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 5,
    initialDelay = 1000,
    maxDelay = 60000,
    backoffMultiplier = 2,
  } = options

  let lastError: Error | undefined
  let delay = initialDelay

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error

      // Check error type
      const isRateLimitError = error.message?.includes('429') || 
                               error.message?.includes('quota') ||
                               error.message?.includes('rate limit')
      const isServerError = error.message?.includes('500') || 
                           error.message?.includes('503')
      
      // Check if it's a daily quota limit (not just per-minute)
      const isDailyQuotaExceeded = error.message?.includes('RequestsPerDayPerProjectPerModel') ||
                                   error.message?.includes('RequestsPerDay')

      if (!isRateLimitError && !isServerError) {
        // Non-retryable error, throw immediately
        throw error
      }

      // If daily quota exceeded, don't retry - it won't help
      if (isDailyQuotaExceeded) {
        throw new Error(
          `Daily API quota exceeded. The free tier Gemini API has a limit of 20 requests per day. ` +
          `Quota resets at midnight Pacific Time. ` +
          `Consider: 1) Wait until quota resets, 2) Reduce research depth, or 3) Upgrade to paid tier. ` +
          `Original error: ${error.message}`
        )
      }

      if (attempt === maxRetries) {
        // Max retries reached
        throw new Error(
          `Max retries (${maxRetries}) reached. Last error: ${error.message}`
        )
      }

      // Extract retry delay from error if available
      const retryAfterMatch = error.message?.match(/retry in (\d+(?:\.\d+)?)/i)
      let waitTime = delay

      if (retryAfterMatch) {
        // Use suggested retry delay from API
        waitTime = Math.ceil(parseFloat(retryAfterMatch[1]) * 1000)
      }

      // Cap at maxDelay
      waitTime = Math.min(waitTime, maxDelay)

      console.log(
        `[RetryHelper] Attempt ${attempt + 1}/${maxRetries} failed. ` +
        `Retrying in ${waitTime}ms... Error: ${error.message?.substring(0, 100)}`
      )

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, waitTime))

      // Increase delay for next attempt (exponential backoff)
      delay = Math.min(delay * backoffMultiplier, maxDelay)
    }
  }

  throw lastError || new Error('Retry failed with unknown error')
}
