/**
 * Storage service for handling Chrome storage operations
 */

import { STORAGE_KEYS } from '../utils/constants.js';

export class StorageService {
    /**
     * Get a value from storage
     * @param {string} key - The storage key
     * @returns {Promise<any>} The stored value
     */
    static async get(key) {
        return new Promise((resolve) => {
            chrome.storage.local.get(key, (result) => {
                resolve(result[key]);
            });
        });
    }

    /**
     * Set a value in storage
     * @param {string} key - The storage key
     * @param {any} value - The value to store
     * @returns {Promise<void>}
     */
    static async set(key, value) {
        return new Promise((resolve) => {
            chrome.storage.local.set({ [key]: value }, resolve);
        });
    }

    /**
     * Get the current time filter value
     * @returns {Promise<string>} The time filter value
     */
    static async getTimeValue() {
        return this.get(STORAGE_KEYS.TIME_VALUE);
    }

    /**
     * Set the time filter value
     * @param {string} value - The time value to store
     * @returns {Promise<void>}
     */
    static async setTimeValue(value) {
        return this.set(STORAGE_KEYS.TIME_VALUE, value);
    }

    /**
     * Get the extension enabled state
     * @returns {Promise<boolean>} Whether the extension is enabled
     */
    static async getExtensionState() {
        const state = await this.get(STORAGE_KEYS.EXTENSION_ENABLED);
        return state !== false;
    }

    /**
     * Set the extension enabled state
     * @param {boolean} enabled - Whether the extension is enabled
     * @returns {Promise<void>}
     */
    static async setExtensionState(enabled) {
        return this.set(STORAGE_KEYS.EXTENSION_ENABLED, enabled);
    }
} 