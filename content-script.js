const MIN_TITLE_LEN = 3;
// TODO: max title len

/**
 * Requests the wikipedia summary for the selected text.
 * @todo handle punctuation
 * @see Issue #7
 */
async function checkSelection() {
    const selection = window.getSelection();
    const title = selection.toString().trim();

    if (title.length >= MIN_TITLE_LEN) {
        try {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            await makeRequest(title, rect);
        } catch (error) {
            console.warn(`Failure checking selection: ${error}`);
        }
    }
    listenForMouseDown();
}

async function makeRequest(pageTitle, rect) {
    const endpoint = "https://en.wikipedia.org/api/rest_v1/page/summary/";
    const req = new Request(endpoint + encodeURIComponent(pageTitle));
    const res = await window.fetch(req);

    if (!res.ok) {
        throw new Error(
            `Wikipedia API returned ${res.status} for "${pageTitle}".`,
        );
    }

    const json = await res.json();

    showTooltip(
        {
            title: json.title,
            link: json.content_urls.desktop.page,
            summary: json.extract,
        },
        rect,
    );
}

const listenForMouseDown = () => {
    const onMouseDown = () => {
        document.removeEventListener("mousedown", onMouseDown);
        document.addEventListener("mouseup", checkSelection);
    };
    document.removeEventListener("mouseup", checkSelection);
    document.addEventListener("mousedown", onMouseDown);
};

listenForMouseDown();
