function showTooltip(data, rect) {
  removeTooltip();

  const tooltip = document.createElement("div");
  tooltip.id = "wikilens-tooltip";

  const title = document.createElement("a");
  title.href = data.link;
  title.target = "_blank";
  title.rel = "noopener noreferrer";
  title.textContent = data.title;
  title.style.cssText =
    "font-weight:bold;font-size:14px;color:#36c;text-decoration:none;display:block;margin-bottom:4px;";

  const summary = document.createElement("p");
  summary.textContent = data.summary;
  summary.style.cssText = "margin:0;font-size:13px;line-height:1.4;color:#333;";

  tooltip.appendChild(title);
  tooltip.appendChild(summary);

  tooltip.style.cssText = [
    "position:absolute",
    "z-index:2147483647",
    "max-width:360px",
    "padding:10px 12px",
    "background:#fff",
    "border:1px solid #ccc",
    "border-radius:6px",
    "box-shadow:0 2px 8px rgba(0,0,0,.18)",
    "font-family:system-ui,sans-serif",
    "pointer-events:auto",
  ].join(";");

  document.body.appendChild(tooltip);
  positionTooltip(tooltip, rect);

  document.addEventListener("mousedown", onClickOutside);
}

function positionTooltip(tooltip, rect) {
  const gap = 6;
  let top = rect.bottom + window.scrollY + gap;
  let left = rect.left + window.scrollX;

  const tooltipRect = tooltip.getBoundingClientRect();

  if (left + tooltipRect.width > window.innerWidth) {
    left = window.innerWidth - tooltipRect.width - gap;
  }
  if (left < 0) left = gap;

  if (rect.bottom + tooltipRect.height + gap > window.innerHeight) {
    top = rect.top + window.scrollY - tooltipRect.height - gap;
  }

  tooltip.style.position = "absolute";
  tooltip.style.top = top + "px";
  tooltip.style.left = left + "px";
}

function removeTooltip() {
  const existing = document.getElementById("wikilens-tooltip");
  if (existing) existing.remove();
  document.removeEventListener("mousedown", onClickOutside);
}

function onClickOutside(e) {
  const tooltip = document.getElementById("wikilens-tooltip");
  if (tooltip && !tooltip.contains(e.target)) {
    removeTooltip();
  }
}
