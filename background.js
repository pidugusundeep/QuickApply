// Execute content script when a LinkedIn page is loaded or updated
const executeContentScript = (tabId) => {
    chrome.scripting.executeScript({
        target: { tabId },
        files: ['content.js']
    });
};

// Listen for page load completion
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url?.includes('linkedin.com')) {
        executeContentScript(tabId);
    }
});

// Listen for SPA navigation
chrome.webNavigation.onHistoryStateUpdated.addListener(
    (details) => executeContentScript(details.tabId),
    { url: [{ hostContains: 'linkedin.com' }] }
);