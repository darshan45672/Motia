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

      // Check if error is retryable (rate limit or server error)
      const isRateLimitError = error.message?.includes('429') || 
                               error.message?.includes('quota') ||
                               error.message?.includes('rate limit')
      const isServerError = error.message?.includes('500') || 
                           error.message?.includes('503')

      if (!isRateLimitError && !isServerError) {
        // Non-retryable error, throw immediately
        throw error
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
