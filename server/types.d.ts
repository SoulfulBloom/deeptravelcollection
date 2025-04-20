/**
 * Global type declarations
 */

// Extend the globalThis interface to include our premium content cache
declare global {
  // For NodeJS.Global compatibility
  namespace NodeJS {
    interface Global {
      _cachedPremiumContent: Record<number, string>;
    }
  }
  
  // For modern code that uses globalThis
  interface globalThis {
    _cachedPremiumContent: Record<number, string>;
  }
  
  // Make the variable available globally
  var _cachedPremiumContent: Record<number, string>;
}