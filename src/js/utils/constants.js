/**
 * Constants used throughout the extension
 */

// Time presets for job search filters
export const TIME_PRESETS = {
    LAST_HOUR: { value: '3600', label: 'Last Hour' },
    LAST_SIX_HOURS: { value: '21600', label: 'Last 6 Hours' },
    LAST_24_HOURS: { value: '86400', label: 'Last 24 Hours' },
    LAST_WEEK: { value: '604800', label: 'Last Week' }
};

// URL parameters
export const URL_PARAM_NAME = 'f_TPR';

// Storage keys
export const STORAGE_KEYS = {
    TIME_VALUE: 'f_TPR_value',
    EXTENSION_ENABLED: 'extension_enabled'
};

// Message types
export const MESSAGE_TYPES = {
    GET_EXTENSION_STATE: 'GET_EXTENSION_STATE',
    NAVIGATION_UPDATE: 'NAVIGATION_UPDATE',
    TIME_VALUE_UPDATED: 'TIME_VALUE_UPDATED',
    URL_UPDATE_ERROR: 'URL_UPDATE_ERROR',
    INIT_ERROR: 'INIT_ERROR'
};

// UI constants
export const UI_CONSTANTS = {
    SAVE_MESSAGE_DURATION: 2000,
    MIN_TIME_VALUE: 1
}; 