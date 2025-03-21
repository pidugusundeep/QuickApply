// content.js
(function() {
    chrome.storage.local.get(['f_TPR_value', 'extension_enabled'], (data) => {
        const isEnabled = data.extension_enabled !== false; // Default to true if not set
        if (!isEnabled) {
            return;
        }

        const value = data.f_TPR_value || '3600';
        var url = new URL(window.location.href);
        if (url.searchParams.has('f_TPR') && url.searchParams.get('f_TPR') !== value) {
            url.searchParams.set('f_TPR', value);
            window.location.href = url.href;
        }
    });
})();