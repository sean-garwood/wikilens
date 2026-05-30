import { strictEqual, ok } from "node:assert";
import { describe, it } from "node:test";

describe("Wikimedia API", () => {
    it("returns 200 for a known page title", async () => {
        const res = await fetch(
            "https://en.wikipedia.org/api/rest_v1/page/summary/JavaScript",
        );
        strictEqual(res.status, 200);

        const json = await res.json();
        ok(json.extract, "response should have an extract");
        ok(json.content_urls.desktop.page, "response should have a page URL");
        ok(json.title, "response should have a title");
    });

    it("returns 404 for a nonexistent page", async () => {
        const res = await fetch(
            "https://en.wikipedia.org/api/rest_v1/page/summary/Xyzzy_not_a_real_page_12345",
        );
        ok(
            res.status === 404 || res.status === 429,
            `expected 404 (or 429 if rate-limited), got ${res.status}`,
        );
    });
});
