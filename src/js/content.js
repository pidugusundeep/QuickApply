/**
 * QuickApply Chrome Extension
 * Content Script
 * 
 * This script handles the functionality of the extension on LinkedIn job search pages.
 * It manages:
 * - Time filter application
 * - URL parameter handling
 * - Extension state monitoring
 * 
 * @module content
 * @version 1.0.1
 * @lastUpdated 2024
 */

import { TIME_PRESETS } from './utils/constants.js';
import { StorageService } from './services/storage.js';
import { MessagingService } from './services/messaging.js';
import { URLService } from './services/url.js';

// Prevent multiple initializations
if (window.quickApplyInitialized) {
    console.log('QuickApply already initialized');
} else {
    (function() {
        /**
         * Applies the time filter to the LinkedIn job search page
         * 
         * @param {string} timeValue - The time value to apply
         */
        function applyTimeFilter(timeValue) {
            const timeFilter = document.querySelector('input[name="f_TPR"]');
            if (timeFilter) {
                timeFilter.value = timeValue;
                timeFilter.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }

        /**
         * Initializes the content script
         */
        async function initialize() {
            try {
                const isEnabled = await MessagingService.getExtensionState();
                if (isEnabled) {
                    const timeValue = await StorageService.getTimeValue();
                    if (timeValue) {
                        applyTimeFilter(timeValue);
                    }
                }
            } catch (error) {
                console.error('Error initializing content script:', error);
                MessagingService.reportError('INIT_ERROR', error);
            }
        }

        // Listen for messages from background script
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.type === 'NAVIGATION_UPDATE' || message.type === 'TIME_VALUE_UPDATED') {
                applyTimeFilter(message.timeValue);
            }
        });

        // Mark as initialized and start
        window.quickApplyInitialized = true;
        initialize();
    })();
}