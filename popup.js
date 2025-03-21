chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var tab = tabs[0];
    var url = new URL(tab.url);
    if (url.searchParams.has('f_TPR')) {
        url.searchParams.set('f_TPR', 'r3600');
    }
    chrome.tabs.update(tab.id, { url: url.href });
});