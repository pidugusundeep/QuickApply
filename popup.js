document.addEventListener('DOMContentLoaded', () => {
    // Display the saved value when the popup is opened
    chrome.storage.local.get('f_TPR_value', (data) => {
        document.getElementById('saved_value').textContent = data.f_TPR_value || '3600';
    });

    document.getElementById('save_button').addEventListener('click', () => {
        let value;
        const selectedRadio = document.querySelector('input[name="time"]:checked');
        if (selectedRadio) {
            value = selectedRadio.value;
        } else {
            value = document.getElementById('f_TPR_value').value;
        }

        if (value) {
            chrome.storage.local.set({ f_TPR_value: value }, () => {
                console.log('Value saved:', value);
                // Update the displayed saved value
                document.getElementById('saved_value').textContent = value;
            });
        }
    });
});