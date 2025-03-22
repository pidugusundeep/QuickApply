# QuickApply - LinkedIn Job Search Time Filter Extension

A Chrome extension that enhances LinkedIn's job search experience by adding custom time filter options.

## Features

- Adds custom time filter options to LinkedIn's job search:
  - Past 1 hour
  - Past 6 hours
  - Past 12 hours
- Seamlessly integrates with LinkedIn's existing time filter dropdown
- Automatically removes duplicate filter options
- Persists selected time filter across page reloads
- Works with LinkedIn's single-page application architecture

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Usage

1. Go to LinkedIn's job search page
2. Click on the "Date posted" filter
3. You'll see additional time filter options (1h, 6h, 12h) at the top of the dropdown
4. Select your desired time range
5. The filter will be applied automatically

## Technical Details

The extension consists of three main components:

- `content.js`: Injects custom time filters into LinkedIn's job search interface
- `background.js`: Handles extension initialization and page navigation
- `manifest.json`: Extension configuration and permissions

## Permissions Used

- `tabs`: For accessing LinkedIn tabs
- `webNavigation`: For handling single-page application navigation
- `scripting`: For injecting content scripts
- `storage`: For maintaining extension state
- Host permission for `linkedin.com` domains

## Development

To modify the extension:

1. Make changes to the source files
2. Reload the extension in `chrome://extensions/`
3. Test changes on LinkedIn's job search page

## License

MIT License - Feel free to modify and distribute as needed.
