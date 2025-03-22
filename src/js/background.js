/**
 * QuickApply Chrome Extension
 * Background Script
 * 
 * This script handles background tasks and communication between different parts of the extension.
 * It manages:
 * - Extension installation and updates
 * - Tab updates and navigation
 * - Message handling
 * - Error reporting
 * 
 * @module background
 * @version 1.0.1
 * @lastUpdated 2024
 */

import { MESSAGE_TYPES, TIME_PRESETS } from './utils/constants.js';
import { StorageService } from './services/storage.js';
import { MessagingService } from './services/messaging.js';
import { URLService } from './services/url.js';

/**
 * Handles messages from content script and popup
 * 
 * @param {Object} message - The message object
 * @param {Object} sender - The sender object
 * @param {Function} sendResponse - The response callback
 */
async function handleMessage(message, sender, sendResponse) {
    try {
        if (message.type === MESSAGE_TYPES.GET_EXTENSION_STATE) {
            const isEnabled = await StorageService.getExtensionState();
            sendResponse({ enabled: isEnabled });
            return true; // Will respond asynchronously
        }
    } catch (error) {
        console.error('Error handling message:', error);
        MessagingService.reportError(MESSAGE_TYPES.URL_UPDATE_ERROR, error);
    }
}

/**
 * Handles extension installation or update
 * 
 * @param {Object} details - The installation details
 */
async function handleInstall(details) {
    if (details.reason === 'install') {
        try {
            // Set default values on installation
            await StorageService.setTimeValue(TIME_PRESETS.LAST_HOUR.value);
            await StorageService.setExtensionState(true);
        } catch (error) {
            console.error('Error setting default values:', error);
            MessagingService.reportError(MESSAGE_TYPES.INIT_ERROR, error);
        }
    }
}

/**
 * Handles tab updates
 * 
 * @param {number} tabId - The ID of the updated tab
 * @param {Object} changeInfo - Information about the change
 * @param {Object} tab - The updated tab object
 */
async function handleTabUpdate(tabId, changeInfo, tab) {
    try {
        if (changeInfo.status === 'complete' && URLService.isLinkedInJobsUrl(tab?.url)) {
            const isEnabled = await StorageService.getExtensionState();
            if (isEnabled) {
                const timeValue = await StorageService.getTimeValue();
                if (timeValue) {
                    await MessagingService.notifyTimeValueUpdate(tabId, timeValue);
                }
            }
        }
    } catch (error) {
        console.error('Error handling tab update:', error);
        MessagingService.reportError(MESSAGE_TYPES.URL_UPDATE_ERROR, error);
    }
}

/**
 * Handles navigation state updates
 * 
 * @param {Object} details - The navigation details
 */
async function handleNavigationUpdate(details) {
    try {
        if (!details?.url || !URLService.isLinkedInJobsUrl(details.url)) {
            return;
        }

        const isEnabled = await StorageService.getExtensionState();
        if (isEnabled) {
            const timeValue = await StorageService.getTimeValue();
            if (timeValue) {
                await MessagingService.notifyTimeValueUpdate(details.tabId, timeValue);
            }
        }
    } catch (error) {
        console.error('Error in navigation handler:', error);
        MessagingService.reportError(MESSAGE_TYPES.URL_UPDATE_ERROR, error);
    }
}

// Add event listeners
chrome.runtime.onMessage.addListener(handleMessage);
chrome.runtime.onInstalled.addListener(handleInstall);
chrome.tabs.onUpdated.addListener(handleTabUpdate);
chrome.webNavigation.onHistoryStateUpdated.addListener(handleNavigationUpdate);