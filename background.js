/**
 * QuickApply Chrome Extension
 * Background script for handling extension-wide functionality
 */

// Constants
const ERROR_TYPES = {
    URL_UPDATE_ERROR: 'URL_UPDATE_ERROR',
    INIT_ERROR: 'INIT_ERROR'
};

/**
 * Handles messages from content script
 * @param {Object} message - The message object
 * @param {Object} sender - The sender object
 * @param {Function} sendResponse - The response callback
 */
function handleMessage(message, sender, sendResponse) {
    try {
        if (message.type === ERROR_TYPES.URL_UPDATE_ERROR) {
            console.error('URL Update Error:', message.error);
        } else if (message.type === ERROR_TYPES.INIT_ERROR) {
            console.error('Initialization Error:', message.error);
        } else if (message.type === 'GET_EXTENSION_STATE') {
            chrome.storage.local.get('extension_enabled', (data) => {
                sendResponse({ enabled: data.extension_enabled !== false });
            });
            return true; // Will respond asynchronously
        }
    } catch (error) {
        console.error('Error handling message:', error);
    }
}

/**
 * Handles extension installation or update
 * @param {Object} details - The installation details
 */
function handleInstall(details) {
    if (details.reason === 'install') {
        // Set default values on installation
        chrome.storage.local.set({
            f_TPR_value: '3600',
            extension_enabled: true
        }, () => {
            if (chrome.runtime.lastError) {
                console.error('Error setting default values:', chrome.runtime.lastError);
            }
        });
    }
}

/**
 * Handles tab updates
 * @param {number} tabId - The ID of the updated tab
 * @param {Object} changeInfo - Information about the change
 * @param {Object} tab - The updated tab object
 */
function handleTabUpdate(tabId, changeInfo, tab) {
    try {
        if (changeInfo.status === 'complete' && tab?.url?.includes('linkedin.com')) {
            // Content script is already loaded via manifest
            // No need to execute it again
        }
    } catch (error) {
        console.error('Error handling tab update:', error);
    }
}

/**
 * Handles navigation state updates
 * @param {Object} details - The navigation details
 */
async function handleNavigationUpdate(details) {
    try {
        // Check if details and url exist
        if (!details?.url) {
            console.warn('Navigation details or URL is undefined');
            return;
        }

        // Check if it's a LinkedIn jobs URL
        if (!details.url.includes('linkedin.com/jobs/')) {
            return;
        }

        // Get the current extension state
        const { extension_enabled } = await chrome.storage.local.get('extension_enabled');
        
        if (extension_enabled !== false) {
            // Get the saved time value
            const { f_TPR_value } = await chrome.storage.local.get('f_TPR_value');
            
            // Send message to content script
            chrome.tabs.sendMessage(details.tabId, {
                type: 'NAVIGATION_UPDATE',
                timeValue: f_TPR_value
            }).catch(error => {
                console.warn('Failed to send message to content script:', error);
            });
        }
    } catch (error) {
        console.error('Error in navigation handler:', error);
    }
}

// Add event listeners
chrome.runtime.onMessage.addListener(handleMessage);
chrome.runtime.onInstalled.addListener(handleInstall);
chrome.tabs.onUpdated.addListener(handleTabUpdate);
chrome.webNavigation.onHistoryStateUpdated.addListener(handleNavigationUpdate);