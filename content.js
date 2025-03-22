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

// Prevent multiple initializations
if (window.quickApplyInitialized) {
    console.log('QuickApply already initialized');
} else {
    (function() {
        // Time presets for job search filters
        const TIME_PRESETS = {
            LAST_HOUR: { value: '3600', label: 'Last Hour' },
            LAST_SIX_HOURS: { value: '21600', label: 'Last 6 Hours' },
            LAST_24_HOURS: { value: '86400', label: 'Last 24 Hours' },
            LAST_WEEK: { value: '604800', label: 'Last Week' }
        };

        // Constants
        const URL_PARAM_NAME = 'f_TPR';

        // Function to apply time filter
        function applyTimeFilter(timeValue) {
            const timeFilter = document.querySelector('input[name="f_TPR"]');
            if (timeFilter) {
                timeFilter.value = timeValue;
                timeFilter.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }

        // Function to check if extension is enabled
        function checkExtensionState() {
            return new Promise((resolve) => {
                chrome.runtime.sendMessage({ type: 'GET_EXTENSION_STATE' }, (response) => {
                    resolve(response?.enabled ?? true);
                });
            });
        }

        // Function to initialize the content script
        async function initialize() {
            const isEnabled = await checkExtensionState();
            if (isEnabled) {
                const { f_TPR_value } = await chrome.storage.local.get('f_TPR_value');
                applyTimeFilter(f_TPR_value || TIME_PRESETS.LAST_HOUR.value);
            }
        }

        // Listen for messages from background script
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.type === 'NAVIGATION_UPDATE') {
                applyTimeFilter(message.timeValue);
            } else if (message.type === 'TIME_VALUE_UPDATED') {
                applyTimeFilter(message.timeValue);
            }
        });

        // Mark as initialized and start
        window.quickApplyInitialized = true;
        initialize();
    })();
}