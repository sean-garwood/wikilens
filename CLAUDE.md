## Wikilens: project overview

A Chrome browser extension (Manifest V3) that listens for text selection on any webpage and shows a Wikipedia summary tooltip for the selected term. It queries the Wikimedia REST API (`https://en.wikipedia.org/api/rest_v1/page/summary/{title}`).

## Loading the extension for testing

No build step exists. Load the extension directly in Chrome:

1. Go to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked" and select this repo directory

After any code change, click the refresh icon on the extension card and reload the target tab.

## Architecture

- `manifest.json`: MV3 manifest; injects `src/show.service.js` then `content-script.js` into all URLs (`*://*/*`). Both scripts share the global scope (no bundler, no ES modules).
- `content-script.js`: Entry point injected into every page. Manages the mousedown/mouseup event cycle, reads `window.getSelection()`, and calls the Wikimedia API when selection length >= 3. Calls `showTooltip()` from show.service.
- `src/show.service.js`: Renders and positions the tooltip DOM near the selection bounding rect. Dismisses on click outside.

## Key constraints

- No bundler or package manager: imports use bare specifiers (`"src/show.service"`). If a bundler is added later, resolve module paths accordingly.
- The extension requests only the `webRequest` permission; avoid adding broad permissions without good reason.

## Known issues

None currently tracked.
