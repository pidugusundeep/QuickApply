/**
 * URL service for handling URL-related operations
 */

import { URL_PARAM_NAME } from '../utils/constants.js';

export class URLService {
    /**
     * Update the time filter parameter in a URL
     * @param {string} url - The URL to update
     * @param {string} timeValue - The new time value
     * @returns {string} The updated URL
     */
    static updateTimeFilter(url, timeValue) {
        const urlObj = new URL(url);
        urlObj.searchParams.set(URL_PARAM_NAME, `r${timeValue}`);
        return urlObj.toString();
    }

    /**
     * Check if a URL is a LinkedIn jobs URL
     * @param {string} url - The URL to check
     * @returns {boolean} Whether the URL is a LinkedIn jobs URL
     */
    static isLinkedInJobsUrl(url) {
        return url?.includes('linkedin.com/jobs/') ?? false;
    }

    /**
     * Get the current tab URL
     * @returns {Promise<string>} The current tab URL
     */
    static async getCurrentTabUrl() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        return tab?.url;
    }

    /**
     * Update the current tab URL
     * @param {string} url - The new URL
     * @returns {Promise<void>}
     */
    static async updateCurrentTabUrl(url) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.id) {
            await chrome.tabs.update(tab.id, { url });
        }
    }
} 