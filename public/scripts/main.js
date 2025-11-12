import { fetchKanjiMeanings, populateMeaningsLists, queryParamsUpdatedListener, addToHistory } from './utils.js';

let previousText;

const clipboardContentList = document.getElementById('clipboard-contents');

// let previousMeanings;

/* 
let callbackProcessInsertedContent = function (mutations) {
  mutations.forEach((mutation) => {
    if (mutation.target == document.body && mutation.type == 'childList' && mutation.addedNodes.length >= 1) {
      let p;
      mutation.addedNodes.forEach((node) => {
        if (node.tagName == 'P') p = node;
      })
      if (!p) return;

      // Get its text content and add the text to a new row in the table, then remove the <p> element.
      let text = p.textContent
      if (text !== previousText) {
        const li = document.createElement('li');
        li.textContent = text;
        clipboardContentList.append(li);
        previousText = text;
        p.remove()
      }
    };
  });
};
 
//Register the above new line callbackProcessInsertedContent function.
let observer = new MutationObserver(callbackProcessInsertedContent)
let observerOptions = { childList: true, attributes: false };
observer.observe(document.body, observerOptions)
*/
fetchKanjiMeanings();
window.addEventListener('popstate', queryParamsUpdatedListener);
window.populateMeaningsLists = populateMeaningsLists;
window.addToHistory = addToHistory;
