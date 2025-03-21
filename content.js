// content.js
(function() {
    var url = new URL(window.location.href);
    if (url.searchParams.has('f_TPR') && url.searchParams.get('f_TPR') !== '3600') {
        url.searchParams.set('f_TPR', '3600');
        window.location.href = url.href;
    }
})();