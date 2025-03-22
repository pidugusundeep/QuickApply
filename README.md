# QuickApply Chrome Extension

A Chrome extension that helps you quickly apply to jobs on LinkedIn by automatically setting time filters for job searches.

## Features

- **Time Filter Management**: Set custom time filters for LinkedIn job searches
- **Preset Options**: Quick selection of common time ranges (1 hour, 24 hours, 1 week, 1 month)
- **Custom Time Input**: Enter any custom time value in seconds
- **Extension Toggle**: Easily enable/disable the extension
- **Visual Feedback**: Status indicators and success/error messages
- **Settings Persistence**: Your preferences are saved between sessions

## Installation

### Development Mode

1. **Clone the repository**:
    ```sh
    git clone https://github.com/yourusername/QuickApply.git
    cd QuickApply
    ```

2. **Open Chrome and navigate to the Extensions page**:
    - Open Chrome
    - Go to `chrome://extensions/` in the address bar

3. **Enable Developer Mode**:
    - In the top right corner of the Extensions page, toggle the "Developer mode" switch to the "On" position

4. **Load the extension**:
    - Click the "Load unpacked" button
    - In the file dialog, navigate to the directory where you cloned the repository and select it

5. **Verify the installation**:
    - You should see the "QuickApply" extension listed on the Extensions page
    - Ensure the extension is enabled

### Production Installation

1. Visit the Chrome Web Store (link coming soon)
2. Click "Add to Chrome"
3. Follow the prompts to install the extension

## Usage

1. **Open the extension popup**:
    - Click on the QuickApply extension icon in the Chrome toolbar

2. **Set the time filter**:
    - Choose a preset time option (1 hour, 24 hours, 1 week, 1 month)
    - Or enter a custom time value in seconds
    - Click "Save Time Value" to apply your changes

3. **Toggle the extension**:
    - Use the "Enable/Disable" button to turn the extension on or off
    - The status indicator will show the current state

4. **View current settings**:
    - The current time filter value is displayed in the "Current Settings" section

## Technical Details

### Files

- `manifest.json`: Extension configuration and permissions
- `popup.html`: User interface for the extension popup
- `popup.js`: Popup functionality and user interaction handling
- `content.js`: Content script that modifies LinkedIn job search URLs
- `background.js`: Background script for extension-wide functionality
- `icons/`: Directory containing extension icons in various sizes

### Permissions

- `tabs`: Access to browser tabs
- `activeTab`: Access to the current tab
- `webNavigation`: Monitor web page navigation
- `scripting`: Execute scripts in web pages
- `storage`: Save extension settings
- `notifications`: Show notifications to the user

### Time Values

The extension uses seconds for time values:
- 1 hour = 3600 seconds
- 24 hours = 86400 seconds
- 1 week = 604800 seconds
- 1 month = 2592000 seconds

## Development

### Prerequisites

- Chrome browser
- Basic knowledge of HTML, CSS, and JavaScript
- Git (for version control)

### Building

1. Clone the repository
2. Make your changes
3. Test the extension in Chrome
4. Submit a pull request

### Testing

1. Enable Developer Mode in Chrome Extensions
2. Load the extension in unpacked mode
3. Test all features:
   - Time filter settings
   - Extension toggle
   - Error handling
   - UI responsiveness

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please:
1. Check the [Issues](https://github.com/yourusername/QuickApply/issues) page
2. Create a new issue if your problem isn't already listed
3. Provide detailed information about your problem

## Acknowledgments

- LinkedIn for their job search platform
- Chrome Extensions API documentation
- Contributors and users of this extension

## Version History

- 1.0.1 (2024)
  - Added comprehensive documentation
  - Improved error handling
  - Enhanced UI/UX
  - Added status indicators

- 1.0.0 (2024)
  - Initial release
  - Basic time filter functionality
  - Extension toggle feature
  - Settings persistence
