document.addEventListener('DOMContentLoaded', () => {
    // Display the saved value and button state when the popup is opened
    chrome.storage.local.get(['f_TPR_value', 'extension_enabled'], (data) => {
        document.getElementById('saved_value').textContent = data.f_TPR_value || '3600';
        const isEnabled = data.extension_enabled !== false; // Default to true if not set
        document.getElementById('save_button').disabled = !isEnabled;
        document.getElementById('selection').style.display = isEnabled ? 'block' : 'none';
        document.getElementById('toggle_button').textContent = isEnabled ? 'Disable' : 'Enable';
        document.getElementById('toggle_button').style.backgroundColor = isEnabled ? 'red' : 'green';
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

    document.getElementById('toggle_button').addEventListener('click', () => {
        chrome.storage.local.get('extension_enabled', (data) => {
            const isEnabled = data.extension_enabled !== false; // Default to true if not set
            const newEnabledState = !isEnabled;
            document.getElementById('save_button').disabled = !newEnabledState;
            document.getElementById('selection').style.display = newEnabledState ? 'block' : 'none';
            document.getElementById('toggle_button').textContent = newEnabledState ? 'Disable' : 'Enable';
            document.getElementById('toggle_button').style.backgroundColor = newEnabledState ? 'red' : 'green';
            chrome.storage.local.set({ extension_enabled: newEnabledState });
        });
    });
});