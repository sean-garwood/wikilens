## Wikilens: project overview

A Chrome browser extension (Manifest V3) that listens for text selection on any webpage and shows a Wikipedia summary tooltip for the selected term. It queries the Wikimedia REST API (`https://en.wikipedia.org/api/rest_v1/page/summary/{title}`).

## Loading the extension for testing

No build step exists. Load the extension directly in Chrome:

1. Go to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked" and select this repo directory

After any code change, click the refresh icon on the extension card and reload the target tab.

## Architecture

- `manifest.json`: MV3 manifest; injects `content-script.js` into all URLs (`*://*/*`) and exposes `tooltip.html` as a web-accessible resource.
- `content-script.js`: Entry point injected into every page. Manages the mousedown/mouseup event cycle, reads `window.getSelection()`, and calls the Wikimedia API when selection length >= 3. Imports from `src/show.service.js`.
- `src/show.service.js`: Responsible for rendering the tooltip DOM near the selection bounding rect. Currently in progress on `feat/tooltip`.

## Key constraints

- No bundler or package manager: imports use bare specifiers (`"src/show.service"`). If a bundler is added later, resolve module paths accordingly.
- The extension requests only the `webRequest` permission; avoid adding broad permissions without good reason.

## Known issues

- `makeRequest` in `content-script.js` currently calls `Range.getBoundingClientRect()` as a bare static call (bug: should be called on a `Range` instance) -- the bounding rect needs to be passed through to `showTooltip`.
  - !`gh issue view 1 --json "body,title" --jq "."`
