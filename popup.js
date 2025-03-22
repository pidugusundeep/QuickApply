/**
 * QuickApply Chrome Extension
 * Popup Script
 * 
 * This script handles the functionality of the extension's popup interface.
 * It manages:
 * - Time filter settings
 * - Extension state (enabled/disabled)
 * - User interface updates
 * - Error handling and user feedback
 * 
 * @module popup
 * @version 1.0.1
 * @lastUpdated 2024
 */

/**
 * Constants
 */
const TIME_PRESETS = {
    LAST_HOUR: { value: '3600', label: 'Last Hour' },
    LAST_SIX_HOURS: { value: '21600', label: 'Last 6 Hours' },
    LAST_24_HOURS: { value: '86400', label: 'Last 24 Hours' },
    LAST_WEEK: { value: '604800', label: 'Last Week' }
};

const UI_CONSTANTS = {
    SAVE_MESSAGE_DURATION: 2000,
    ERROR_MESSAGE_DURATION: 3000
};

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
 * Updates the UI state based on whether the extension is enabled
 * 
 * @param {boolean} isEnabled - Whether the extension is currently enabled
 * @returns {void}
 */
function updateUIState(isEnabled) {
    try {
        if (!elements.saveButton || !elements.selection || !elements.toggleButton || 
            !elements.statusIndicator || !elements.statusText) {
            console.error('Required DOM elements not found');
            return;
        }

        elements.saveButton.disabled = !isEnabled;
        elements.selection.style.display = isEnabled ? 'block' : 'none';
        elements.toggleButton.textContent = isEnabled ? 'Disable' : 'Enable';
        elements.toggleButton.classList.toggle('disabled', !isEnabled);
        elements.statusIndicator.className = `status-indicator ${isEnabled ? 'active' : 'inactive'}`;
        elements.statusText.textContent = isEnabled ? 'Extension is enabled' : 'Extension is disabled';
    } catch (error) {
        console.error('Error updating UI state:', error);
    }
}

/**
 * Shows a temporary message to the user
 * 
 * @param {string} message - The message to display
 * @param {boolean} isError - Whether the message is an error message
 * @param {number} duration - How long to show the message in milliseconds
 * @returns {void}
 */
function showMessage(message, isError = false, duration = UI_CONSTANTS.SAVE_MESSAGE_DURATION) {
    try {
        elements.savedMessage.textContent = message;
        elements.savedMessage.className = `message ${isError ? 'error-message' : 'success-message'}`;
        elements.savedMessage.style.display = 'block';
        
        setTimeout(() => {
            elements.savedMessage.style.display = 'none';
        }, duration);
    } catch (error) {
        console.error('Error showing message:', error);
    }
}

/**
 * Validates a time value
 * 
 * @param {string} value - The time value to validate
 * @returns {boolean} - Whether the value is valid
 */
function validateTimeValue(value) {
    try {
        const numValue = parseInt(value);
        if (isNaN(numValue) || numValue <= 0) {
            throw new Error('Invalid time value');
        }
        return true;
    } catch (error) {
        showMessage('Please enter a valid positive number', true, UI_CONSTANTS.ERROR_MESSAGE_DURATION);
        return false;
    }
}

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

        if (!validateTimeValue(value)) {
            return;
        }

        // Save to storage
        await chrome.storage.local.set({ f_TPR_value: value });
        elements.savedValue.textContent = value;
        showMessage('Time filter saved successfully!');

        // Get the current active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // If we're on a LinkedIn jobs page, update the URL
        if (tab?.url?.includes('linkedin.com/jobs/')) {
            // Update the URL parameter
            const url = new URL(tab.url);
            url.searchParams.set('f_TPR', `r${value}`);
            
            // Update the tab URL
            await chrome.tabs.update(tab.id, { url: url.toString() });
            
            // Notify content script
            chrome.tabs.sendMessage(tab.id, {
                type: 'TIME_VALUE_UPDATED',
                timeValue: value
            }).catch(error => {
                console.warn('Failed to notify content script:', error);
            });
        }
    } catch (error) {
        console.error('Error saving time value:', error);
        showMessage('Failed to save time value. Please try again.', true);
    }
}

/**
 * Toggles the extension's enabled state
 * 
 * @returns {void}
 */
async function toggleExtension() {
    try {
        const { extension_enabled } = await chrome.storage.local.get('extension_enabled');
        const newEnabledState = !extension_enabled;

        await chrome.storage.local.set({ extension_enabled: newEnabledState });
        updateUIState(newEnabledState);
        showMessage(`Extension ${newEnabledState ? 'enabled' : 'disabled'} successfully!`);
    } catch (error) {
        console.error('Error toggling extension:', error);
        showMessage('Failed to toggle extension. Please try again.', true);
    }
}

/**
 * Creates preset time option buttons
 */
function createPresetButtons() {
    try {
        if (!elements.presetContainer) {
            console.error('Preset container not found');
            return;
        }

        // Clear existing content
        elements.presetContainer.innerHTML = '';

        // Create buttons for each preset
        Object.entries(TIME_PRESETS).forEach(([key, preset]) => {
            const label = document.createElement('label');
            label.className = 'time-option';
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'time';
            radio.value = preset.value;
            
            const text = document.createTextNode(preset.label);
            
            label.appendChild(radio);
            label.appendChild(text);
            elements.presetContainer.appendChild(label);
        });
    } catch (error) {
        console.error('Error creating preset buttons:', error);
    }
}

/**
 * Sets up keyboard shortcuts for saving and toggling
 * 
 * @returns {void}
 */
function setupKeyboardShortcuts() {
    try {
        document.addEventListener('keydown', (event) => {
            // Ctrl/Cmd + S to save
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault();
                saveTimeValue();
            }
            // Ctrl/Cmd + T to toggle extension
            if ((event.ctrlKey || event.metaKey) && event.key === 't') {
                event.preventDefault();
                toggleExtension();
            }
        });
    } catch (error) {
        console.error('Error setting up keyboard shortcuts:', error);
    }
}

/**
 * Initializes the popup interface
 * 
 * This function:
 * 1. Loads saved settings from Chrome storage
 * 2. Updates the UI with saved values
 * 3. Sets up event listeners
 * 4. Creates preset buttons
 * 5. Sets up keyboard shortcuts
 * 
 * @returns {void}
 */
async function initializePopup() {
    try {
        const { f_TPR_value, extension_enabled } = await chrome.storage.local.get([
            'f_TPR_value',
            'extension_enabled'
        ]);

        elements.savedValue.textContent = f_TPR_value || TIME_PRESETS.LAST_HOUR.value;
        updateUIState(extension_enabled !== false);
        
        // Create preset buttons
        createPresetButtons();
        
        // Setup event listeners
        elements.saveButton.addEventListener('click', saveTimeValue);
        elements.toggleButton.addEventListener('click', toggleExtension);
        
        // Setup keyboard shortcuts
        setupKeyboardShortcuts();
    } catch (error) {
        console.error('Error initializing popup:', error);
        showMessage('Failed to initialize extension. Please refresh.', true);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePopup);