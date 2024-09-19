export const extractMetaData = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Select the first <h1> and first <p> element
  const h1 = doc.querySelector('h1');
  const p = doc.querySelector('p');
  let title = null;
  let previewText = null;

  if (h1) {
    title = h1.innerText.trim();
  }

  let maxLength = 280;
  if (p) {
    const pHtml = p.innerHTML;
    const pText = pHtml.split('<br>')[0].trim();
    while (maxLength < pText.length && pText[maxLength] !== ' ') {
      maxLength++;
    }
    previewText = pText.slice(0, maxLength);
  }

  return { title, previewText };
};
