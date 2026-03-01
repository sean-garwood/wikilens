export function showTooltip(data, boundingRect) {
  log(data);
  const tooltip = makeTooltip(data);
  // TODO: show tooltip near the bounding rect
}

function log(data) {
  for (const [k, v] of Object.entries(data)) {
    if (v) {
      console.log(`${k}: ${v}`);
    } else {
      throw new Error(`No ${k} found for ${pageTitle}.`);
    }
  }
}

function makeTooltip(data) {
  // // get the bounding container of the highlighted element
  // try {
  // const template = browser.runtime.getURL("../tooltip.html");
  // const res = await fetch(template);
  // if (!res.ok) {
  //   throw new Error("could not fetch html tooltip template.");
  // }

  const tooltip = document.createDocumentFragment();
  // append a tooltip to the dom (TODO: where? above?)
  // TODO: handle lifecycle
  //   - time-based?
  //   - action-based?
  return tooltip
    .appendChild((document.createElement("h1").textContent = data.title))
    .appendChild((document.createElement("p").textContent = data.summary));
}
