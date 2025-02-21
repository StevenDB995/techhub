import DOMPurify from 'dompurify';

export const extractMetadata = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(DOMPurify.sanitize(html), 'text/html');

  // Select the first <h1> and first <p> element that is not from toc
  const h1 = doc.querySelector('h1');
  const p = doc.querySelector('p:not(.toc-title)');
  let title = null;
  let previewText = null;

  if (h1) {
    title = h1.innerText.trim();
  }

  let maxLength = 280;
  if (p) {
    // Only retrieve the content before the first line break of the first <p> element for preview text
    const pHtml = p.innerHTML;
    const pLines = pHtml.split('<br>');
    let pText = '';

    for (let pLine of pLines) {
      const pLineDom = document.createElement('p');
      pLineDom.innerHTML = pLine.trim();
      const pLineText = pLineDom.innerText;
      if (pLineText) {
        pText = pLineText;
        break;
      }
    }

    while (maxLength < pText.length && pText[maxLength] !== ' ') {
      maxLength++;
    }

    previewText = pText.slice(0, maxLength);
  }

  return { title, previewText };
};

export const extractImageLinks = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(DOMPurify.sanitize(html), 'text/html');
  const imgList = doc.querySelectorAll('img');
  const links = [];
  for (let img of imgList) {
    links.push(img.src);
  }
  return links;
};
