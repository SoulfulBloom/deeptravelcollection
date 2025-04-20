/**
 * Retry utilities for resilient API calls
 * 
 * Provides functions to retry operations with exponential backoff, 
 * timeout protection, and error condition checking.
 */

// Error types that should trigger a retry
const RETRYABLE_STATUS_CODES = [429, 500, 502, 503, 504];

/**
 * Creates a Promise that rejects after the specified timeout
 * @param ms - Timeout in milliseconds
 * @param message - Optional error message
 * @returns A Promise that rejects after the timeout
 */
const createTimeout = (ms: number, message: string): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      const error = new Error(message || `Operation timed out after ${ms}ms`);
      error.name = 'TimeoutError';
      reject(error);
    }, ms);
  });
};

/**
 * Wraps a function with a timeout
 * @param fn - The function to execute
 * @param ms - Timeout in milliseconds
 * @param message - Optional error message
 * @returns The result of the function or throws if it times out
 */
export async function withTimeout<T>(
  fn: () => Promise<T>, 
  ms: number, 
  message?: string
): Promise<T> {
  return Promise.race([
    fn(),
    createTimeout(ms, message || `Operation timed out after ${ms}ms`)
  ]);
}

/**
 * Configuration options for retry logic
 */
export interface RetryOptions {
  /** Maximum number of retry attempts */
  maxRetries: number;
  
  /** Base delay between retries in ms (will be multiplied by backoff factor) */
  baseDelay: number;
  
  /** Maximum delay between retries in ms */
  maxDelay: number;
  
  /** Function to determine if an error should trigger a retry */
  retryCondition?: (error: any) => boolean;
  
  /** Callback function called on each retry attempt */
  onRetry?: (attempt: number, error: any) => void;
  
  /** Whether to use jitter to randomize delay times (default: true) */
  useJitter?: boolean;
}

/**
 * Default retry options
 */
const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  baseDelay: 1000,  // 1 second
  maxDelay: 30000,  // 30 seconds
  useJitter: true,
  retryCondition: isRetryableError
};

/**
 * Checks if an error should trigger a retry based on standard HTTP error codes
 * @param error - The error to check
 * @returns Whether the error is retryable
 */
export function isRetryableError(error: any): boolean {
  // Check for rate limit or server errors
  if (error && error.status && RETRYABLE_STATUS_CODES.includes(error.status)) {
    return true;
  }
  
  // Check for network errors
  if (error && (
    error.code === 'ECONNRESET' || 
    error.code === 'ETIMEDOUT' || 
    error.code === 'ECONNREFUSED' ||
    error.name === 'TimeoutError'
  )) {
    return true;
  }
  
  // Check for API rate limit errors by message content
  if (error && error.message && (
    error.message.includes('rate limit') || 
    error.message.includes('too many requests') ||
    error.message.includes('timeout')
  )) {
    return true;
  }
  
  return false;
}

/**
 * Calculates the delay for the next retry attempt with exponential backoff
 * @param attempt - Current attempt number (1-based)
 * @param options - Retry options
 * @returns The delay in milliseconds
 */
function calculateDelay(attempt: number, options: RetryOptions): number {
  // Calculate exponential backoff: baseDelay * 2^attempt
  let delay = options.baseDelay * Math.pow(2, attempt);
  
  // Apply jitter if enabled (varies delay by ±30% randomly)
  if (options.useJitter) {
    const jitterFactor = 0.3; // 30% jitter
    const jitter = 1 - jitterFactor + (Math.random() * jitterFactor * 2);
    delay = Math.floor(delay * jitter);
  }
  
  // Ensure delay doesn't exceed maximum
  return Math.min(delay, options.maxDelay);
}

/**
 * Executes a function with retry logic
 * @param fn - The function to execute
 * @param options - Retry options
 * @returns The result of the function or throws if all retries fail
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: Partial<RetryOptions>
): Promise<T> {
  // Merge provided options with defaults
  const retryOptions = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: any;
  
  // Try the initial attempt plus retries
  for (let attempt = 0; attempt <= retryOptions.maxRetries; attempt++) {
    try {
      // For attempt 0, execute immediately
      // For attempts > 0, delay with exponential backoff
      if (attempt > 0) {
        const delay = calculateDelay(attempt - 1, retryOptions);
        console.log(`Retry attempt ${attempt}/${retryOptions.maxRetries} after ${delay}ms delay`);
        
        // Notify retry if callback provided
        if (retryOptions.onRetry) {
          retryOptions.onRetry(attempt, lastError);
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      // Execute the function
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Check if we should retry based on the error
      const shouldRetry = 
        attempt < retryOptions.maxRetries && 
        (retryOptions.retryCondition ? retryOptions.retryCondition(error) : true);
      
      // Log error details
      console.warn(
        `Attempt ${attempt + 1}/${retryOptions.maxRetries + 1} failed: ${error.message}. ` +
        `${shouldRetry ? 'Will retry.' : 'Will not retry.'}`
      );
      
      // Exit if we shouldn't retry
      if (!shouldRetry) {
        break;
      }
    }
  }
  
  // If we got here, all attempts failed
  throw lastError;
}