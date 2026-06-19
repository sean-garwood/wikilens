#!/usr/bin/env python3
"""Tag, push, and build the extension zip. Bump manifest.json version first."""

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def run(cmd, **kwargs):
    return subprocess.run(cmd, check=True, cwd=ROOT, **kwargs)


def capture(cmd):
    return subprocess.run(cmd, check=True, cwd=ROOT, capture_output=True, text=True)


def main():
    version = json.loads((ROOT / "manifest.json").read_text())["version"]
    tag = f"v{version}"

    answer = input(f"Publish {tag}? [y/N] ").strip().lower()
    if answer != "y":
        print("Aborted.")
        sys.exit(0)

    dirty = capture(["git", "status", "--porcelain"]).stdout.strip()
    if dirty:
        print("error: working tree has uncommitted changes; commit or stash first", file=sys.stderr)
        sys.exit(1)

    existing = subprocess.run(
        ["git", "rev-parse", tag], cwd=ROOT, capture_output=True, check=False
    )
    if existing.returncode == 0:
        print(f"error: tag {tag} already exists", file=sys.stderr)
        sys.exit(1)

    run(["git", "tag", tag])
    run(["git", "push", "origin", tag])
    run([sys.executable, str(ROOT / "utils" / "build-zip.py")])

    print(f"\nDone: wikilens.zip (tagged {tag})")
    print("Upload at:")
    print("  Firefox: https://addons.mozilla.org/developers/")
    print("  Chrome:  https://chrome.google.com/webstore/devconsole")


if __name__ == "__main__":
    main()
