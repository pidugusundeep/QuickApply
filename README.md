# QuickApply Chrome Extension

QuickApply is a Chrome extension that allows you to quickly apply to jobs on LinkedIn by setting a custom time value for job searches.

## Installation

To install this extension in developer mode, follow these steps:

1. **Clone the repository**:
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Open Chrome and navigate to the Extensions page**:
    - Open Chrome.
    - Go to `chrome://extensions/` in the address bar.

3. **Enable Developer Mode**:
    - In the top right corner of the Extensions page, toggle the "Developer mode" switch to the "On" position.

4. **Load the extension**:
    - Click the "Load unpacked" button.
    - In the file dialog, navigate to the directory where you cloned the repository and select it.

5. **Verify the extension is installed**:
    - You should see the "QuickApply" extension listed on the Extensions page.
    - Ensure the extension is enabled.

## Usage

1. **Open the extension popup**:
    - Click on the QuickApply extension icon in the Chrome toolbar.

2. **Set the time value**:
    - Select a predefined time value or enter a custom value in seconds.
    - Click the "Save" button to save the value.

3. **Enable or disable the extension**:
    - Use the "Enable" or "Disable" button to toggle the extension on or off.

4. **Apply the time value**:
    - When the extension is enabled, it will automatically set the `f_TPR` parameter in the LinkedIn job search URL to the saved value.

## Files

- `background.js`: Contains the background script for the extension.
- `content.js`: Contains the content script that modifies the LinkedIn job search URL.
- `popup.html`: Contains the HTML for the extension popup.
- `popup.js`: Contains the JavaScript for the extension popup.
- `manifest.json`: Contains the extension manifest file.

## License

This project is licensed under the MIT License.