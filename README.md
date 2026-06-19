# wikilens

A browser extension that displays a card containing the Wikipedia summary/disambiguation for highlighted text. Uses [Wikimedia REST API](https://www.mediawiki.org/wiki/Wikimedia_REST_API).

## Installation

### Chrome

Available on the [Chrome Web Store](https://chromewebstore.google.com/detail/wikilens/fadbmbkpjpjjibkdpmhboobbjglniolh).

### Firefox

Pending approval on the Firefox Add-ons store.

### Developer / local install

1. Go to `chrome://extensions` in your browser
1. Enable **Developer mode** (toggle in top-right)
1. Click **Load unpacked** and select this repo directory

## Usage

1. On any webpage, select text (3+ characters)
1. A tooltip will appear showing a Wikipedia summary for the selected term
1. Click outside the tooltip to dismiss it

## Data Collected

None.

## Contributing

Fork the repo and open a pull request against `main`. There is no build step; load the extension unpacked to test locally (see Developer install above).

```
make test   # run unit tests
```

### Releasing (maintainer only)

Publishing a new version to the extension stores requires push access to this repo.

**Order of operations:**

1. Merge your changes to `main` and push.
2. Bump `"version"` in `manifest.json` — AMO rejects re-uploads at an existing version number.
3. Commit the bump: `git commit -am "chore(release): bump to x.x.x"`
4. Push `main`: `git push origin main`
5. Run `make distro` — prompts for confirmation, then tags the commit, pushes the tag, and builds `dist/wikilens-x.x.x.zip` via `web-ext`.
6. Upload the zip at [addons.mozilla.org/developers](https://addons.mozilla.org/developers/).

`manifest.json` is the single source of truth for the version. The git tag is derived from it by the release script.
