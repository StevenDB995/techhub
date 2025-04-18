import DOMPurify from 'dompurify';

const MAX_TITLE_LENGTH = 70;
const MAX_PREVIEW_LENGTH = 280;

const extractTitle = (doc) => {
  // Select the first <h1> and first <p> element that is not from toc
  const h1 = doc.querySelector('h1');
  return h1?.innerText.trim().slice(0, MAX_TITLE_LENGTH);
};

const extractPreviewText = (doc) => {
  const p = doc.querySelector('p:not(.toc-title)');
  let previewText = null;

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

    if (pText.length > MAX_PREVIEW_LENGTH) {
      let previewTextLength = MAX_PREVIEW_LENGTH;
      while (previewTextLength > 0 && pText[previewTextLength] !== ' ') {
        previewTextLength--;
      }
      previewText = pText.slice(0, previewTextLength);
    } else {
      previewText = pText;
    }
  }

  return previewText;
};

const extractImageLinks = (doc) => {
  const imgList = doc.querySelectorAll('img');
  const links = [];
  for (let img of imgList) {
    links.push(img.src);
  }
  return links;
};

export const extractMetadata = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(DOMPurify.sanitize(html), 'text/html');
  const title = extractTitle(doc);
  const previewText = extractPreviewText(doc);
  const imageLinks = extractImageLinks(doc);
  return { title, previewText, imageLinks };
};
