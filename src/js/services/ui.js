/**
 * UI service for handling UI-related operations
 */

import { UI_CONSTANTS } from '../utils/constants.js';

export class UIService {
    /**
     * Show a temporary message
     * @param {string} message - The message to show
     * @param {boolean} isError - Whether the message is an error
     * @param {HTMLElement} messageElement - The element to show the message in
     */
    static showMessage(message, isError = false, messageElement) {
        if (!messageElement) return;

        messageElement.textContent = message;
        messageElement.className = `message ${isError ? 'error' : 'success'}`;
        messageElement.style.display = 'block';

        setTimeout(() => {
            messageElement.style.display = 'none';
        }, UI_CONSTANTS.SAVE_MESSAGE_DURATION);
    }

    /**
     * Update the UI state based on extension state
     * @param {boolean} isEnabled - Whether the extension is enabled
     * @param {Object} elements - The DOM elements to update
     */
    static updateUIState(isEnabled, elements) {
        if (!elements) return;

        elements.toggleButton.textContent = isEnabled ? 'Disable' : 'Enable';
        elements.statusIndicator.className = `status-indicator ${isEnabled ? 'enabled' : 'disabled'}`;
        elements.statusText.textContent = `Extension is ${isEnabled ? 'enabled' : 'disabled'}`;
    }

    /**
     * Create preset time option buttons
     * @param {HTMLElement} container - The container to add buttons to
     * @param {Object} presets - The time presets to create buttons for
     */
    static createPresetButtons(container, presets) {
        if (!container) return;

        container.innerHTML = '';
        Object.entries(presets).forEach(([key, preset]) => {
            const label = document.createElement('label');
            label.className = 'time-option';
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'time';
            radio.value = preset.value;
            
            const text = document.createTextNode(preset.label);
            
            label.appendChild(radio);
            label.appendChild(text);
            container.appendChild(label);
        });
    }

    /**
     * Validate a time value
     * @param {string} value - The time value to validate
     * @returns {boolean} Whether the value is valid
     */
    static validateTimeValue(value) {
        const numValue = parseInt(value, 10);
        return !isNaN(numValue) && numValue >= UI_CONSTANTS.MIN_TIME_VALUE;
    }
} 