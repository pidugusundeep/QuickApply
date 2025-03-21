chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url.includes('linkedin.com')) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
        });
    }
});

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    chrome.tabs.get(details.tabId, (tab) => {
        if (tab.url.includes('linkedin.com')) {
            chrome.scripting.executeScript({
                target: { tabId: details.tabId },
                files: ['content.js']
            });
        }
    });
}, { url: [{ hostContains: 'linkedin.com' }] });