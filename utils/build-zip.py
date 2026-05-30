#!/usr/bin/env python3
"""Packages the extension into a distributable zip."""

import json
import sys
import zipfile
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
CONFIG_PATH = REPO_ROOT / "build.config.json"

def load_config():
    with open(CONFIG_PATH, encoding='utf-8') as f:
        return json.load(f)

def collect_paths(entries):
    paths = []
    for entry in entries:
        full = REPO_ROOT / entry
        if full.is_dir():
            for child in sorted(full.rglob("*")):
                if child.is_file():
                    paths.append(child)
        elif full.is_file():
            paths.append(full)
        else:
            print(f"warning: '{entry}' not found, skipping", file=sys.stderr)
    return paths

def main():
    config = load_config()
    name = config.get("name", "extension")
    out_path = REPO_ROOT / f"{name}.zip"

    paths = collect_paths(config["files"])
    if not paths:
        print("error: no files matched", file=sys.stderr)
        sys.exit(1)

    with zipfile.ZipFile(out_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for p in paths:
            arcname = p.relative_to(REPO_ROOT)
            zf.write(p, arcname)
            print(f"  + {arcname}")

    print(f"\n{out_path.name} ({len(paths)} files)")

if __name__ == "__main__":
    main()
