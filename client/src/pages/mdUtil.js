export const extractTitle = (markdown) => {
  // Regular expression to match each line
  const lineRegex = /[^\r\n]+/g;

  // Use matchAll to iterate over lines
  // New lines are excluded
  const iter = markdown.matchAll(lineRegex);
  let rowCount = 0;
  let title = null;

  // Scan only up to 2 rows of the markdown content (new lines excluded)
  while (!iter.done && rowCount < 2 && title == null) {
    const line = iter.next().value[0];
    if (line.length >= 2 && line.slice(0, 2) === '# ') {
      title = line.slice(2).trim();
    }
    rowCount++;
  }

  return title;
};

export const extractPreviewText = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  // Select the first <p> element
  const paragraph = doc.querySelector('p');
  let maxLength = 280;
  if (paragraph) {
    const pText = paragraph.innerText.trim();
    while (maxLength < pText.length && pText[maxLength] !== ' ') {
      maxLength++;
    }
    return pText.slice(0, maxLength);
  } else {
    return null;
  }
}
