/**
 * QuickApply Chrome Extension
 * Popup Script
 * 
 * This script manages the extension's popup interface, including:
 * - Time filter settings
 * - Extension state management
 * - UI updates
 * - Error handling
 * 
 * @module popup
 * @version 1.0.1
 * @lastUpdated 2024
 */

import { TIME_PRESETS } from './utils/constants.js';
import { StorageService } from './services/storage.js';
import { MessagingService } from './services/messaging.js';
import { URLService } from './services/url.js';
import { UIService } from './services/ui.js';

/**
 * DOM Elements object containing references to all interactive elements
 * @type {Object}
 */
const elements = {
    /** Display element for the saved time value */
    savedValue: document.getElementById('saved_value'),
    /** Button to save the time value */
    saveButton: document.getElementById('save_button'),
    /** Container for time selection options */
    selection: document.getElementById('selection'),
    /** Button to toggle extension state */
    toggleButton: document.getElementById('toggle_button'),
    /** Input field for custom time value */
    customTimeInput: document.getElementById('f_TPR_value'),
    /** Container for temporary messages */
    savedMessage: document.getElementById('saved_message'),
    /** Visual indicator for extension status */
    statusIndicator: document.getElementById('status_indicator'),
    /** Text element for status message */
    statusText: document.getElementById('status_text'),
    /** Container for preset buttons */
    presetContainer: document.getElementById('preset_container')
};

/**
 * Saves the selected time value to Chrome storage
 * 
 * @returns {void}
 */
async function saveTimeValue() {
    try {
        let value;
        const selectedRadio = document.querySelector('input[name="time"]:checked');
        
        value = selectedRadio ? selectedRadio.value : elements.customTimeInput.value;

        if (!UIService.validateTimeValue(value)) {
            UIService.showMessage('Please enter a valid time value (minimum 1 second)', true, elements.savedMessage);
            return;
        }

        // Save to storage
        await StorageService.setTimeValue(value);
        elements.savedValue.textContent = value;
        UIService.showMessage('Time filter saved successfully!', false, elements.savedMessage);

        // Get the current active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // If we're on a LinkedIn jobs page, update the URL
        if (URLService.isLinkedInJobsUrl(tab?.url)) {
            const updatedUrl = URLService.updateTimeFilter(tab.url, value);
            await URLService.updateCurrentTabUrl(updatedUrl);
            await MessagingService.notifyTimeValueUpdate(tab.id, value);
        }
    } catch (error) {
        console.error('Error saving time value:', error);
        UIService.showMessage('Failed to save time value. Please try again.', true, elements.savedMessage);
    }
}

/**
 * Toggles the extension's enabled state
 * 
 * @returns {void}
 */
async function toggleExtension() {
    try {
        const isEnabled = await StorageService.getExtensionState();
        const newState = !isEnabled;
        
        await StorageService.setExtensionState(newState);
        UIService.updateUIState(newState, elements);
        
        // Get current tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // If we're on a LinkedIn jobs page, notify content script
        if (URLService.isLinkedInJobsUrl(tab?.url)) {
            await MessagingService.notifyTimeValueUpdate(tab.id, newState ? await StorageService.getTimeValue() : null);
        }
    } catch (error) {
        console.error('Error toggling extension:', error);
        UIService.showMessage('Failed to toggle extension. Please try again.', true, elements.savedMessage);
    }
}

/**
 * Initializes the popup interface
 * 
 * @returns {void}
 */
async function initializePopup() {
    try {
        // Load saved time value
        const savedValue = await StorageService.getTimeValue();
        if (savedValue) {
            elements.savedValue.textContent = savedValue;
            elements.customTimeInput.value = savedValue;
            
            // Select the corresponding radio button if it exists
            const radio = document.querySelector(`input[name="time"][value="${savedValue}"]`);
            if (radio) {
                radio.checked = true;
            }
        }

        // Load extension state
        const isEnabled = await StorageService.getExtensionState();
        UIService.updateUIState(isEnabled, elements);

        // Create preset buttons
        UIService.createPresetButtons(elements.presetContainer, TIME_PRESETS);

        // Set up event listeners
        elements.saveButton.addEventListener('click', saveTimeValue);
        elements.toggleButton.addEventListener('click', toggleExtension);
        elements.customTimeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveTimeValue();
            }
        });

        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                saveTimeValue();
            } else if ((e.metaKey || e.ctrlKey) && e.key === 't') {
                e.preventDefault();
                toggleExtension();
            }
        });
    } catch (error) {
        console.error('Error initializing popup:', error);
        UIService.showMessage('Failed to initialize popup. Please try again.', true, elements.savedMessage);
    }
}

// Initialize when the popup loads
document.addEventListener('DOMContentLoaded', initializePopup);