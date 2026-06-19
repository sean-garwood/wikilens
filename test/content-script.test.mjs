import { strictEqual, ok } from "node:assert";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const scriptCode = readFileSync(
    join(import.meta.dirname, "..", "content-script.js"),
    "utf8",
);

function loadScript() {
    const mockDocument = {
        addEventListener() {},
        removeEventListener() {},
    };
    const fn = new Function(
        "document",
        "window",
        scriptCode +
            "\nreturn { normalizeTitle, MIN_TITLE_LEN, MAX_TITLE_LEN };",
    );
    return fn(mockDocument, {});
}

const { normalizeTitle, MIN_TITLE_LEN, MAX_TITLE_LEN } = loadScript();

describe("normalizeTitle", () => {
    it("strips trailing punctuation", () => {
        strictEqual(normalizeTitle("team,"), "team");
    });

    it("strips leading punctuation", () => {
        strictEqual(normalizeTitle('"JavaScript"'), "JavaScript");
    });

    it("strips surrounding whitespace", () => {
        strictEqual(normalizeTitle("  team  "), "team");
    });

    it("preserves internal punctuation and spaces", () => {
        strictEqual(normalizeTitle("Barack Obama"), "Barack Obama");
        strictEqual(normalizeTitle("U.S.A."), "U.S.A");
        strictEqual(normalizeTitle("self-driving"), "self-driving");
    });

    it("handles parentheses around a term", () => {
        strictEqual(normalizeTitle("(Python)"), "Python");
    });

    it("returns empty string for punctuation-only input", () => {
        strictEqual(normalizeTitle("..."), "");
    });
});
