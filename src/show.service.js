function showTooltip(content, rect) {
  const tooltip = document.createElement('div');
  tooltip.className = 'wikilens-tooltip';
  tooltip.textContent = content;
  
  // Positioning logic
  tooltip.style.position = 'absolute';
  tooltip.style.left = `${rect.left}px`;
  tooltip.style.top = `${rect.bottom + window.scrollY}px`;

  document.body.appendChild(tooltip);

  function dismiss() {
    if (tooltip.parentNode) {
      tooltip.parentNode.removeChild(tooltip);
    }
    document.removeEventListener('mousedown', dismiss);
  }
  document.addEventListener('mousedown', dismiss);
}

async function fetchSummary(selection) {
  const encodedSelection = encodeURIComponent(selection);
  const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodedSelection}`;

  try {
    const res = await fetch(apiUrl);
    if (res.status === 200) {
      const data = await res.json();
      if (data.extract) {
        return data.extract;
      } else {
        return `[${selection}] not found.`; // No extract field in response
      }
    } else {
      return `[${selection}] not found.`; // Non-200 status
    }
  } catch (error) {
    return `Error fetching data for [${selection}].`;
  }
}

async function handleSelection(event) {
  const selection = window.getSelection().toString().trim();
  if (selection.length >= 3) {
    const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
    const summary = await fetchSummary(selection);
    showTooltip(summary, rect);
  }
}

document.addEventListener('mouseup', handleSelection);