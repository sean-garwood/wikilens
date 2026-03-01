const MIN_TITLE_LEN = 3;

async function checkSelection() {
  const title = window.getSelection().toString();

  if (title.length >= MIN_TITLE_LEN) {
    try {
      await makeRequest(title);
    } catch (error) {
      console.error("Failure checking selection: ", error);
    }
  }
  listenForMouseDown();
}

async function makeRequest(pageTitle) {
  const endpoint = "https://en.wikipedia.org/api/rest_v1/page/summary/";
  const req = new Request(endpoint + pageTitle);
  let res = await window.fetch(req);

  if (res.status == 404) {
    throw new Error(`${pageTitle} not found.`);
  }

  let json = await res.json();

  console.log(json.extract);
}

const listenForMouseDown = () => {
  const listenForMouseUp = () => {
    document.removeEventListener("mousedown", listenForMouseUp);
    document.addEventListener("mouseup", checkSelection);
  };
  document.removeEventListener("mouseup", checkSelection);
  document.addEventListener("mousedown", listenForMouseUp);
};

listenForMouseDown();
