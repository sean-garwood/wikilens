import { ok, strictEqual } from "node:assert";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const serviceCode = readFileSync(
    join(import.meta.dirname, "..", "src", "show.service.js"),
    "utf8",
);

function makeElement(tag) {
    const el = {
        tagName: tag.toUpperCase(),
        id: "",
        href: "",
        target: "",
        rel: "",
        textContent: "",
        children: [],
        style: { cssText: "" },
        appendChild(child) {
            el.children.push(child);
            return child;
        },
        querySelector(sel) {
            const match = sel.match(/^(\w+)$/);
            if (!match) return null;
            const t = match[1].toUpperCase();
            for (const c of el.children) {
                if (c.tagName === t) return c;
            }
            return null;
        },
        querySelectorAll(sel) {
            if (sel.startsWith("#")) {
                const id = sel.slice(1);
                const results = [];
                if (el.id === id) results.push(el);
                for (const c of el.children) {
                    if (c.id === id) results.push(c);
                }
                return results;
            }
            return [];
        },
        contains() {
            return false;
        },
        remove() {
            const idx = mockBody.children.indexOf(el);
            if (idx !== -1) mockBody.children.splice(idx, 1);
        },
        getBoundingClientRect() {
            return {
                width: 300,
                height: 80,
                top: 0,
                left: 0,
                bottom: 80,
                right: 300,
            };
        },
    };
    return el;
}

let mockBody;
let listeners;

function setupEnv() {
    listeners = {};
    mockBody = makeElement("body");

    const mockDocument = {
        body: mockBody,
        createElement(tag) {
            return makeElement(tag);
        },
        getElementById(id) {
            for (const c of mockBody.children) {
                if (c.id === id) return c;
            }
            return null;
        },
        addEventListener(evt, fn) {
            listeners[evt] = fn;
        },
        removeEventListener(evt, fn) {
            if (listeners[evt] === fn) delete listeners[evt];
        },
    };

    const mockWindow = {
        innerWidth: 1024,
        innerHeight: 768,
        scrollX: 0,
        scrollY: 0,
    };

    let fn = new Function(
        "document",
        "window",
        serviceCode +
            "\nreturn { showTooltip, removeTooltip, onClickOutside };",
    );
    return { fns: fn(mockDocument, mockWindow), mockDocument };
}

describe("showTooltip", () => {
    it("inserts a tooltip element with correct content", () => {
        const { fns } = setupEnv();

        fns.showTooltip(
            {
                title: "Test",
                link: "https://en.wikipedia.org/wiki/Test",
                summary: "A test article.",
            },
            { top: 100, bottom: 120, left: 50, right: 150 },
        );

        const tooltip = mockBody.children.find(
            (c) => c.id === "wikilens-tooltip",
        );
        ok(tooltip, "tooltip should be in the DOM");

        const link = tooltip.querySelector("a");
        strictEqual(link.textContent, "Test");
        strictEqual(link.href, "https://en.wikipedia.org/wiki/Test");

        const p = tooltip.querySelector("p");
        strictEqual(p.textContent, "A test article.");
    });

    it("replaces previous tooltip on second call", () => {
        const { fns } = setupEnv();
        const rect = { top: 100, bottom: 120, left: 50, right: 150 };

        fns.showTooltip(
            {
                title: "First",
                link: "https://en.wikipedia.org/wiki/First",
                summary: "First.",
            },
            rect,
        );
        fns.showTooltip(
            {
                title: "Second",
                link: "https://en.wikipedia.org/wiki/Second",
                summary: "Second.",
            },
            rect,
        );

        const tooltips = mockBody.children.filter(
            (c) => c.id === "wikilens-tooltip",
        );
        strictEqual(tooltips.length, 1, "only one tooltip should exist");
        strictEqual(tooltips[0].querySelector("a").textContent, "Second");
    });
});

describe("removeTooltip", () => {
    it("removes the tooltip from the DOM", () => {
        const { fns } = setupEnv();

        fns.showTooltip(
            {
                title: "Gone",
                link: "https://en.wikipedia.org/wiki/Gone",
                summary: "Bye.",
            },
            { top: 0, bottom: 20, left: 0, right: 100 },
        );

        ok(mockBody.children.find((c) => c.id === "wikilens-tooltip"));
        fns.removeTooltip();
        strictEqual(
            mockBody.children.find((c) => c.id === "wikilens-tooltip"),
            undefined,
        );
    });
});
