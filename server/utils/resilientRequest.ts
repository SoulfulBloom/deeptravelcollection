/**
 * Resilient request utilities with timeout handling and retry logic
 */

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { calculateBackoff as exponentialBackoff, sleep } from './retryUtils';
import OpenAI from 'openai';

// Defaults
const DEFAULT_TIMEOUT = 60000; // 60 seconds
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_BASE_DELAY = 1000; // 1 second
const DEFAULT_MAX_DELAY = 30000; // 30 seconds

interface ResilientRequestOptions {
  // Maximum number of retry attempts
  maxRetries?: number;
  // Base delay for exponential backoff (in ms)
  baseDelay?: number;
  // Maximum delay between retries (in ms)
  maxDelay?: number;
  // Request timeout (in ms)
  timeout?: number;
  // Function to determine if an error is retryable
  isRetryable?: (error: any) => boolean;
  // Function to log request attempts
  onAttempt?: (attempt: number, error?: any) => void;
}

/**
 * Make an HTTP request with built-in resilience:
 * - Timeout handling
 * - Automatic retries with exponential backoff
 * - Jitter to prevent thundering herd problem
 */
export async function resilientRequest<T = any>(
  config: AxiosRequestConfig,
  options: ResilientRequestOptions = {}
): Promise<AxiosResponse<T>> {
  const {
    maxRetries = DEFAULT_MAX_RETRIES,
    baseDelay = DEFAULT_BASE_DELAY,
    maxDelay = DEFAULT_MAX_DELAY,
    timeout = DEFAULT_TIMEOUT,
    isRetryable = defaultIsRetryable,
    onAttempt = defaultOnAttempt,
  } = options;

  // Set timeout if not already specified
  const requestConfig: AxiosRequestConfig = {
    ...config,
    timeout: config.timeout || timeout,
  };

  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      onAttempt(attempt);
      
      // Make the request
      const response = await axios(requestConfig);
      
      // If successful, return the response
      return response;
    } catch (error: any) {
      lastError = error;
      onAttempt(attempt, error);
      
      // If this was the last attempt or the error is not retryable, throw
      if (attempt >= maxRetries || !isRetryable(error)) {
        throw enhanceError(error, attempt);
      }
      
      // Calculate delay with exponential backoff and jitter
      const delay = exponentialBackoff(attempt, baseDelay, maxDelay);
      
      // Wait before the next retry
      await sleep(delay);
    }
  }

  // This should never happen but TypeScript needs it
  throw enhanceError(lastError, maxRetries);
}

/**
 * Default function to determine if an error is retryable
 */
function defaultIsRetryable(error: any): boolean {
  // Retry on network errors
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET') {
    return true;
  }
  
  // Retry on rate limiting (429) and server errors (5xx)
  if (error.response && (error.response.status === 429 || error.response.status >= 500)) {
    return true;
  }
  
  // Don't retry on client errors (4xx) except 429
  if (error.response && error.response.status >= 400 && error.response.status < 500) {
    return error.response.status === 429;
  }
  
  // Retry on unknown errors (could be network related)
  return !error.response;
}

/**
 * Default callback for logging attempt information
 */
function defaultOnAttempt(attempt: number, error?: any): void {
  if (error) {
    const status = error.response ? error.response.status : 'network error';
    console.log(`Request attempt ${attempt + 1} failed with ${status}: ${error.message}`);
  } else if (attempt > 0) {
    console.log(`Making retry attempt ${attempt + 1}...`);
  }
}

/**
 * Enhance error with retry information
 */
function enhanceError(error: any, attempt: number): any {
  if (error.isAxiosError) {
    error.attempts = attempt + 1;
    error.message = `Request failed after ${attempt + 1} attempts: ${error.message}`;
  }
  return error;
}

/**
 * Create an OpenAI client with resilient configuration
 */
export function createResilientOpenAIClient(
  options: {
    apiKey?: string,
    timeout?: number,
    maxRetries?: number
  } = {}
): OpenAI {
  const {
    apiKey = process.env.OPENAI_API_KEY,
    timeout = DEFAULT_TIMEOUT,
    maxRetries = DEFAULT_MAX_RETRIES
  } = options;
  
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }
  
  return new OpenAI({
    apiKey,
    timeout,
    maxRetries
  });
}

/**
 * Make a resilient OpenAI request
 */
export async function resilientOpenAIRequest<T>(
  requestFn: () => Promise<T>,
  options: ResilientRequestOptions = {}
): Promise<T> {
  const {
    maxRetries = DEFAULT_MAX_RETRIES,
    baseDelay = DEFAULT_BASE_DELAY,
    maxDelay = DEFAULT_MAX_DELAY,
    onAttempt = defaultOpenAIOnAttempt,
  } = options;

  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      onAttempt(attempt);
      
      // Make the request
      const response = await requestFn();
      
      // If successful, return the response
      return response;
    } catch (error: any) {
      lastError = error;
      onAttempt(attempt, error);
      
      // Determine if we should retry
      const shouldRetry = isOpenAIErrorRetryable(error) && attempt < maxRetries;
      
      if (!shouldRetry) {
        throw error;
      }
      
      // Calculate delay with exponential backoff and jitter
      const delay = exponentialBackoff(attempt, baseDelay, maxDelay);
      
      // Wait before the next retry
      await sleep(delay);
    }
  }

  // This should never happen but TypeScript needs it
  throw lastError;
}

/**
 * Determine if an OpenAI error is retryable
 */
function isOpenAIErrorRetryable(error: any): boolean {
  // Retry on rate limit errors
  if (error.status === 429) {
    return true;
  }
  
  // Retry on server errors
  if (error.status >= 500) {
    return true;
  }
  
  // Retry on timeout errors
  if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED' || error.code === 'ECONNRESET') {
    return true;
  }
  
  // Don't retry on other client errors
  return false;
}

/**
 * Default callback for logging OpenAI attempt information
 */
function defaultOpenAIOnAttempt(attempt: number, error?: any): void {
  if (error) {
    console.log(`OpenAI request attempt ${attempt + 1} failed: ${error.message}`);
  } else if (attempt > 0) {
    console.log(`Making OpenAI retry attempt ${attempt + 1}...`);
  }
}