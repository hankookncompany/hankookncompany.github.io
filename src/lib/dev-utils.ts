/**
 * Check if we're in development environment
 * Admin features are only available in development
 */
export const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Check if admin features should be enabled
 * Only enabled in development environment
 */
export const isAdminEnabled = isDevelopment;

/**
 * Wrapper for admin-only functionality
 * Returns null in production to prevent admin features from being built
 */
export function withAdminOnly<T>(component: T): T | null {
    return isAdminEnabled ? component : null;
}

/**
 * Development-only warning message
 */
export const DEV_ONLY_MESSAGE = 'This feature is only available in development environment.';