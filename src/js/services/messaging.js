/**
 * Messaging service for handling communication between different parts of the extension
 */

import { MESSAGE_TYPES } from '../utils/constants.js';

export class MessagingService {
    /**
     * Send a message to a specific tab
     * @param {number} tabId - The ID of the target tab
     * @param {Object} message - The message to send
     * @returns {Promise<void>}
     */
    static async sendToTab(tabId, message) {
        try {
            await chrome.tabs.sendMessage(tabId, message);
        } catch (error) {
            console.warn('Failed to send message to tab:', error);
        }
    }

    /**
     * Send a message to the background script
     * @param {Object} message - The message to send
     * @returns {Promise<any>} The response from the background script
     */
    static async sendToBackground(message) {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage(message, resolve);
        });
    }

    /**
     * Get the extension state from the background script
     * @returns {Promise<boolean>} Whether the extension is enabled
     */
    static async getExtensionState() {
        const response = await this.sendToBackground({ type: MESSAGE_TYPES.GET_EXTENSION_STATE });
        return response?.enabled ?? true;
    }

    /**
     * Notify content script of time value update
     * @param {number} tabId - The ID of the target tab
     * @param {string} timeValue - The new time value
     * @returns {Promise<void>}
     */
    static async notifyTimeValueUpdate(tabId, timeValue) {
        await this.sendToTab(tabId, {
            type: MESSAGE_TYPES.TIME_VALUE_UPDATED,
            timeValue
        });
    }

    /**
     * Report an error to the background script
     * @param {string} errorType - The type of error
     * @param {Error} error - The error object
     * @returns {Promise<void>}
     */
    static async reportError(errorType, error) {
        await this.sendToBackground({
            type: errorType,
            error: error.message
        });
    }
} 